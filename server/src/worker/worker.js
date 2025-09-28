const asyncHooks = require("node:async_hooks");
const fs = require("node:fs");
const net = require('node:net');
const http = require("node:http");
const babel = require("@babel/core");
const traverse = require("@babel/traverse").default;
const parser = require("@babel/parser");
const vm = require("node:vm");
const t = require("@babel/types");
const EventEmitterBase = require("node:events");
const { Readable: ReadableBase } = require("node:stream");
const fetch = require("node-fetch");
const crypto = require("crypto");
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
const { workerAction } = require("./worker_action.js")

workerAction({
  asyncHooks,
  fs,
  net,
  http,
  babel,
  traverse,
  parser,
  vm,
  t,
  EventEmitterBase,
  ReadableBase,
  fetch,
  crypto,
  traceLoops,
  traceFuncCall,
  traceFunction,
  Events,
  Tracer,
  postEvent,
  init,
  before,
  after,
  destroy,
  promiseResolve,
  path,
});