const { postEvent, Events } = require('./events');
const fs = require('node:fs');
const util = require('node:util');
function debug(...args) {
  fs.writeFileSync(1, `${util.format(...args)}\n`, { flag: 'a' });
}

const asyncResources = new Map();
const init = (asyncId, type, triggerAsyncId, resource) => {
  // debug(`asyncId: ${asyncId}, type: ${type}, taid: ${triggerAsyncId}`);
  let asyncResourceType;
  // debug('[log] init: ', type);
  if (type === 'PROMISE') {
    const parentResource = asyncResources.get(triggerAsyncId);
    
    asyncResourceType = 'promise';
    // According to the promiseResolve documentation, a Promise is trigger right after a previous Promise was resolved. So, in order to 
    // only catch the actual callback of the Promise, we need to filter the first Promise triggered.
    if (parentResource?.asyncResourceType === asyncResourceType) {
      const callbackName = resource.callback?.name || 'anonymous';
      postEvent(Events.InitPromise(asyncId, triggerAsyncId, callbackName));
    }
    // postEvent(Events.InitMicrotask(asyncId, triggerAsyncId, callbackName));
  }
  if (type === 'Timeout') {
    const callbackName = resource._onTimeout.name || 'anonymous';
    const idleTimeout = resource._idleTimeout || 0;
    // postEvent(Events.InitTimeout(asyncId, callbackName, idleTimeout));
  }
  if (type === 'Immediate') {
    const callbackName = resource._onImmediate.name || 'anonymous';
    // postEvent(Events.InitImmediate(asyncId, callbackName));
  }
  if (type === 'Microtask') {
    const callbackName = resource.callback?.name || 'anonymous';
    // debug('Microtask: ', resource);
    // postEvent(Events.InitMicrotask(asyncId, triggerAsyncId, callbackName));
  }
  if (
    type === 'TickObject' &&
    resource.callback?.name !== 'maybeReadMore_' &&
    resource.callback?.name !== 'afterWriteTick' &&
    resource.callback?.name !== 'onSocketNT' &&
    resource.callback?.name !== 'initRead' &&
    resource.callback?.name !== 'emitReadable_' &&
    resource.callback?.name !== 'emitCloseNT' &&
    resource.callback?.name !== 'endReadableNT' &&
    resource.callback?.name !== 'finish' &&
    resource.callback?.name !== 'resume_'
  ) {
    const callbackName = resource?.callback?.name || 'microtask';
    // debug('TickObject: ', callbackName);
    // postEvent(Events.InitMicrotask(asyncId, triggerAsyncId, callbackName));
  }

  asyncResources.set(asyncId, { resource, asyncResourceType });
};

const before = (asyncId) => {
  const resource = asyncResources.get(asyncId)?.resource || {};
  const resourceName = resource?.constructor?.name;
  // debug('[log] - before - resourceName: ', resourceName, ', name: ', resource?.callback?.name);
  if (resourceName === 'Promise') {
    postEvent(Events.BeforeMicrotask(asyncId));
  }
  if (resourceName === 'Timeout') {
    const callbackName = resource._onTimeout.name || 'anonymous';
    postEvent(Events.BeforeMacrotask(asyncId, callbackName));
  }
  if (resourceName === 'Immediate') {
    const callbackName = resource._onImmediate.name || 'anonymous';
    postEvent(Events.BeforeMacrotask(asyncId, callbackName));
  }
  if (
    resourceName === "Object" &&
    resource.callback &&
    resource.callback.name !== "maybeReadMore_" &&
    resource.callback.name !== "afterWriteTick" &&
    resource.callback.name !== "onSocketNT" &&
    resource.callback.name !== "emitCloseNT" &&
    resource.callback.name !== "initRead" &&
    resource.callback.name !== "emitReadable_" &&
    resource.callback.name !== "endReadableNT" &&
    resource.callback.name !== "endWritableNT" &&
    resource.callback.name !== "finish" &&
    resource.callback.name !== "resetCache" &&
    resource.callback.name !== "resume_" &&
    resource.callback.name !== "bound"
  ) {
    const callbackName = resource.callback.name || "anonymous";
    postEvent(Events.BeforeMicrotask(asyncId, callbackName));
  }
  if (resourceName === 'AsyncResource') {
    const callbackName = resource.callback.name || 'anonymous';
    postEvent(Events.BeforeMicrotask(asyncId, callbackName));
  }
  if (resourceName === "FSReqCallback" || resourceName === "TCP") {
    const callbackName = resource?.callback?.name || "anonymous";
    postEvent(Events.BeforeMacrotask(asyncId, callbackName));
  }
};

const after = (asyncId) => {
  const resource = asyncResources.get(asyncId)?.resource || {};
  const resourceName = resource.constructor.name;
  if (resourceName === 'Promise') {
    // postEvent(Events.AfterPromise(asyncId));
  }
  if (resourceName === 'AsyncResource') {
    // postEvent(Events.AfterMicrotask(asyncId));
  }
};

const destroy = (asyncId) => {
  const resource = asyncResources.get(asyncId)?.resource || {};
};

const promiseResolve = (asyncId) => {
  const resource = asyncResources.get(asyncId);
  // const promise = asyncResources.get(asyncId)?.promise;

  if (resource) {
    // debug('promiseResolve: ', asyncId);
    // postEvent(Events.ResolvePromise(asyncId));
  }
};

module.exports = { init, before, after, destroy, promiseResolve };
