import asyncHooks from "node:async_hooks";
import fs from "node:fs";

import net from "node:net";
import http from "node:http";
import babel from "@babel/core";

import traverseModule from "@babel/traverse";
const traverse = traverseModule.default;
import parser  from "@babel/parser";
import vm  from "node:vm";
import t  from "@babel/types";
import EventEmitterBase  from "node:events";
import { Readable as ReadableBase }   from "node:stream";
import fetch  from "node-fetch";
import crypto  from "crypto";
// Custom Babel Plugin
import { traceLoops }  from "./babelPlugin/loopTracer.js";
import { traceFunction }  from "./babelPlugin/functionTracer.js";
import { traceFuncCall }  from "./babelPlugin/functionCallTracer.js";

import { postEvent, Events, Tracer }  from "./events.js";

// Async Hook Function
import {
  init,
  before,
  after,
  destroy,
  promiseResolve,
}  from "./asyncHook.js";
import path from "path";
import { workerAction } from './worker_action.js';

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
