const _ = require('lodash');
const fs = require('node:fs');
const util = require('node:util');
function debug(...args) {
  fs.writeFileSync(1, `${util.format(...args)}\n`, { flag: 'a' });
}
const eventsReducer = (state, evt) => {
  const { type, payload } = evt;
  // console.log('type: ', type)
  // console.log('payload: ', payload)
  if (type === 'EarlyTermination') state.events.push(evt);
  if (type === 'UncaughtError') state.events.push(evt);

  if (type === 'ConsoleLog') state.events.push(evt);
  if (type === 'ConsoleWarn') state.events.push(evt);
  if (type === 'ConsoleError') state.events.push(evt);

  if (type === 'EnterFunction') {
    // console.log('[log] ', state?.prevEvt?.type)
    if (state?.prevEvt?.type === 'InitPromise') {
      state.events.push({ type: 'EnqueueMicrotask', payload: evt.payload });
      state.events.push({ type: 'DequeueMicrotask', payload: evt.payload });
      state.events.push(evt);
    } else if (state?.prevEvt?.type === 'BeforeMicrotask') {
      state.events.push({ type: 'EnqueueMicrotask', payload: evt.payload });
      state.events.push({ type: 'DequeueMicrotask', payload: evt.payload });
      state.events.push(evt);
    } else if(state?.prevEvt?.type === 'BeforeTicktask') {
      state.events.push({ type: 'EnqueueTicktask', payload: evt.payload });
      state.events.push({ type: 'DequeueTicktask', payload: evt.payload });
      state.events.push(evt);
    } else if (state?.prevEvt?.type === 'BeforeMacrotask') {
      state.events.push({ type: 'EnqueueTask', payload: evt.payload });
      state.events.push({ type: 'DequeueTask', payload: evt.payload });
      state.events.push(evt);
    } else {
      state.events.push(evt);
    }
  }
  if (type == 'ExitFunction') state.events.push(evt);
  if (type == 'ErrorFunction') state.events.push(evt);

  /*if (type === 'InitPromise') {
    state.events.push({ type: 'EnqueueMicrotask', payload: evt.payload });
    state.events.push(evt);
    state.events.push({ type: 'DequeueMicrotask', payload: evt.payload });
  }*/
  if (type === 'ResolvePromise') {
    console.log('ResolvePromise')
    // state.events.push(evt);

    // const microtaskInfo = state.parentsIdsOfPromisesWithInvokedCallbacks.find(
      // ({ asyncID }) => asyncID === payload.asyncID
    // );

    if (microtaskInfo) {
      /*state.events.push({
        type: 'EnqueueMicrotask',
        payload: { name: microtaskInfo.name },
      });*/
    }
  }
  if (type === 'BeforePromise') {
    // state.events.push(evt);
  }
  if (type === 'AfterPromise') {
    // state.events.push(evt);
  }

  if (type === 'InitTimeout') {
    // state.events.push(evt);
  }
  if (type === 'BeforeTimeout') {
    // state.events.push(evt);
  }

  if (type === 'InitImmediate') {
    // state.events.push(evt);
    // state.events.push({ type: 'EnqueueTask', payload: evt.payload });
  }
  if (type === 'BeforeImmediate') {
    // state.events.push({ type: 'EnqueueTask', payload: evt.payload });
    // state.events.push(evt);
    // state.events.push({ type: 'DequeueTask', payload: evt.payload });
  }

  if (type?.startsWith('EventLoop') || type === 'NextTick' || type === 'MicroTasks'  || type === 'EndProcessTicksAndRejections') {
    state.events.push(evt);
  }

  state.prevEvt = evt;

  return state;
};

// TODO: Return line:column numbers for func calls

const reduceEvents = (events) => {
    
  // For some reason, certain Promises (e.g. from `fetch` calls) seem to
  // resolve multiple times. I don't know why this happens, but it screws things
  // up for the view layer, so we'll just take the last one ¯\_(ツ)_/¯
  /* events = _(events)
    .reverse()
    .uniqWith(
      (aEvt, bEvt) =>
        aEvt.type === 'ResolvePromise' &&
        bEvt.type === 'ResolvePromise' &&
        aEvt.payload.asyncID === bEvt.payload.asyncID
    )
    .reverse()
    .value(); */

  // Before we reduce the events, we need to figure out when Microtasks
  // were enqueued.
  //
  // A Microtask was enqueued when its parent resolved iff the child Promise
  // of the parent had its callback invoked.
  //
  // A Promise has its callback invoked if a function was entered immediately
  // after the Promise's `BeforePromise` event.

  /*const resolvedPromiseIds = events
    .filter(({ type }) => type === 'ResolvePromise')
    .map(({ payload: { asyncID } }) => asyncID);*/

  /*const promisesWithInvokedCallbacksInfo = events
    .filter(({ type }) =>
      [
        'BeforePromise',
        'EnterFunction',
        'ExitFunction',
        'ResolvePromise',
      ].includes(type)
    )
    .map((evt, idx, arr) => {
      return evt.type === 'BeforePromise' &&
        (arr[idx + 1] || {}).type === 'EnterFunction'
        ? [evt, arr[idx + 1]]
        : undefined;
    })
    .filter(Boolean)
    .map(([beforePromiseEvt, enterFunctionEvt]) => ({
      asyncID: beforePromiseEvt.payload.asyncID,
      name: enterFunctionEvt.payload.name,
    }));*/

  /*const promiseChildIdToParentId = {};
  events
    .filter(({ type }) => type === 'InitPromise')
    .forEach(({ payload: { asyncID, parentId } }) => {
      promiseChildIdToParentId[asyncID] = parentId;
    });*/

  /*const parentsIdsOfPromisesWithInvokedCallbacks = promisesWithInvokedCallbacksInfo.map(
    ({ asyncID: childId, name }) => ({
      asyncID: promiseChildIdToParentId[childId],
      name,
    })
  );*/

  /*const microtasksWithInvokedCallbacksInfo = events
    .filter(({ type }) =>
      [
        'InitMicrotask',
        'BeforeMicrotask',
        'AfterMicrotask',
        'EnterFunction',
        'ExitFunction',
        'InitImmediate',
        'BeforeImmediate',
      ].includes(type)
    )
    .map((evt, idx, arr) =>
      evt.type === 'BeforeMicrotask' &&
      (arr[idx + 1] || {}).type === 'EnterFunction'
        ? [evt, arr[idx + 1]]
        : undefined
    )
    .filter(Boolean)
    .map(([beforeMicrotaskEvt, enterFunctionEvt]) => ({
      asyncID: beforeMicrotaskEvt.payload.asyncID,
      name: enterFunctionEvt.payload.name,
    }));*/
  
  /*const microtaskChildIdToParentId = {};
  events
    .filter(({ type }) => type === 'InitMicrotask')
    .forEach(({ payload: { asyncID, parentId } }) => {
      microtaskChildIdToParentId[asyncID] = parentId;
    });*/

  /*const parentsIdsOfMicrotasks = microtasksWithInvokedCallbacksInfo.map(
    ({ asyncID: childId, name }) => ({
      asyncID: microtaskChildIdToParentId[childId],
      name,
    })
  );*/

  /*console.log({
    resolvedPromiseIds,
    promisesWithInvokedCallbacksInfo,
    parentsIdsOfPromisesWithInvokedCallbacks,
    promiseChildIdToParentId,
    microtasksWithInvokedCallbacksInfo,
    microtaskChildIdToParentId,
    parentsIdsOfMicrotasks,
  });*/

  return events.reduce(eventsReducer, {
    events: [],
    prevEvt: {},
  }).events;
};

module.exports = { reduceEvents };
