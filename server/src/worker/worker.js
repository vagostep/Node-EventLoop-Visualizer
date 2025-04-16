const asyncHooks = require("node:async_hooks");
const fs = require("node:fs");
require("node:perf_hooks")
const babel = require("@babel/core");
const traverse = require("@babel/traverse").default;
const parser = require("@babel/parser");
const vm = require("node:vm");
const t = require("@babel/types");

const fetch = require("node-fetch");
const _ = require("lodash");

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
    readFile: fs.readFile
  },
  process: {
    nextTick: process.nextTick,
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
    listOfUserDefinedFunc.push(path.node.id.name);
  },
  ArrowFunctionExpression: function (path) {
    let fnName;
    if (t.isIdentifier(path.container.id)) {
      fnName = path.container.id.name;
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
