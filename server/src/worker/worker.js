const asyncHooks = require("node:async_hooks");
const fs = require("node:fs");
const net = require('node:net');
const http = require("node:http");
const babel = require("@babel/core");
const traverse = require("@babel/traverse").default;
const parser = require("@babel/parser");
const vm = require("node:vm");
const t = require("@babel/types");

const fetch = require("node-fetch");

// Custom Babel Plugin
const { traceLoops } = require("./babelPlugin/loopTracer");
const { traceFunction } = require("./babelPlugin/functionTracer");
const { traceFuncCall } = require("./babelPlugin/functionCallTracer");

const { postEvent, Events, Tracer } = require("./events");

// Async Hook Function
const {
  init,
  before,
  after,
  destroy,
  promiseResolve,
} = require("./asyncHook.js");
const path = require("path");

asyncHooks
  .createHook({ init, before, after, destroy, promiseResolve })
  .enable();

// TODO: Maybe change this name to avoid conflicts?
const nextId = (() => {
  let id = 0;
  return () => id++;
})();

// E.g. call stack size exceeded errors...
process.on("uncaughtException", (err) => {
  postEvent(Events.UncaughtError(err));
  process.exit(1);
});

const fakeFilePath = path.join(__dirname, 'file.txt');
console.log(fakeFilePath)
const context = {
  nextId,
  Tracer,
  console: {
    log: Tracer.log,
    warn: Tracer.warn,
    error: Tracer.error,
  },
  setTimeout,
  setInterval,
  clearInterval,
  setImmediate,
  queueMicrotask,
  __filename,
  fs: {
    readFile: (callback) => {

      return fs.readFile(fakeFilePath, 'utf8', callback);
    },
    readFileSync: () => {

      return fs.readFileSync(fakeFilePath, 'utf8');
    },
  },
  process: {
    nextTick: process.nextTick,
  },
  http: {
    createServer: (callback) => {

      const server = http.createServer(callback);

      const originalServerListen = server.listen.bind(server);

      server.listen = (listenCallback) => {
        return originalServerListen(3000, listenCallback);
      };

      return server;
    },
    request: (callback) => {

      if (typeof callback !== "function") {
        throw new Error('Invalid argument: callback is not a function as 1st argument');
      }

      const options = {
        hostname: "localhost",
        port: 3000,
        path: "/",
        method: "GET"
      };

      return http.request(options, callback);
    }
  },
  net: {
    createConnection: (callback) => {
      
      return net.createConnection({
        port: 4000
      }, callback);
    },
    createServer: (callback) => {

      const server = net.createServer(callback);

      const originalServerListen = server.listen.bind(server);

      server.listen = (listenCallback) => {
        return originalServerListen(4000, listenCallback);
      }

      return server;
    },
  },
  fetch,
  JSON,
};

const code = process.argv.slice(2)?.[0];
const jsSourceCode = JSON.parse(code);

const oriAST = parser.parse(jsSourceCode);
const listOfUserDefinedFunc = [];

// Get list of name of user defined function
traverse(oriAST, {
  FunctionDeclaration: function (path) {
    listOfUserDefinedFunc.push(path?.node?.id?.name);
  },
  ArrowFunctionExpression: function (path) {
    let fnName;
    if (t.isIdentifier(path.container.id)) {
      fnName = path?.container?.id?.name;
    } else {
      fnName = "anonymous";
    }
    listOfUserDefinedFunc.push(fnName);
  },
});

let modifiedSource = babel.transformSync(jsSourceCode.toString(), {
  plugins: [
    [traceFuncCall, { listOfUserDefinedFunc }],
    traceFunction,
    traceLoops,
  ],
}).code;

const script = new vm.Script(modifiedSource);
vm.createContext(context);
script.runInContext(context);
