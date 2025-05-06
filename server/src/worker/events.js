const {format: prettyFormat} = require('pretty-format');
const event = (type, payload) => ({ type, payload });
const arrToPrettyStr = (arr) =>
  arr.map((a) => (typeof a === "string" ? a : prettyFormat(a))).join(' ') + '\n';
const START_TIME = Date.now();
const TIMEOUT_MILLIS = 5000;
const EVENT_LIMIT = 250;
const Events = {
  ConsoleLog: (message) => event('ConsoleLog', { message }),
  ConsoleWarn: (message) => event('ConsoleWarn', { message }),
  ConsoleError: (message) => event('ConsoleError', { message }),

  EnterFunction: (funcID, name, start, end) =>
    event('EnterFunction', { funcID, name, start, end }),
  ExitFunction: (funcID, name, start, end) =>
    event('ExitFunction', { funcID, name, start, end }),
  ErrorFunction: (message, funcID, name, start, end) =>
    event('ErrorFunction', { message, funcID, name, start, end }),

  InitPromise: (asyncID, parentId, name) =>
    event('InitPromise', { asyncID, parentId, name }),
  ResolvePromise: (asyncID) => event('ResolvePromise', { asyncID }),
  BeforePromise: (asyncID) => event('BeforePromise', { asyncID }),
  AfterPromise: (asyncID) => event('AfterPromise', { asyncID }),

  // TickObject: (asyncID, parentId, callbackName) =>
  //   event('TickObject', { asyncID, parentId, callbackName }),

  InitMicrotask: (asyncID, parentId, name) =>
    event('InitMicrotask', { asyncID, parentId, name }),
  BeforeMicrotask: (asyncID, name) => {
    return event('BeforeMicrotask', { asyncID, name });
  },
  AfterMicrotask: (asyncID) => event('AfterMicrotask', { asyncID }),

  InitTicktask: (asyncID, parentId, name) =>
    event('InitTicktask', { asyncID, parentId, name }),
  BeforeTicktask: (asyncID, name) => {
    return event('BeforeTicktask', { asyncID, name });
  },
  AfterTicktask: (asyncID) => event('AfterTicktask', { asyncID }),

  InitTimeout: (asyncID, name, idleTimeout) =>
    event('InitTimeout', { asyncID, name, idleTimeout }),
  BeforeTimeout: (asyncID, name) => event('BeforeTimeout', { asyncID, name }),

  BeforeMacrotask: (asyncID, name) => event('BeforeMacrotask', { asyncID, name }),
  AfterMacrotask: (asyncID, name) => event('AfterMacrotask', { asyncID, name }),

  InitImmediate: (asyncID, name) => event('InitImmediate', { asyncID, name }),
  BeforeImmediate: (asyncID, name) =>
    event('BeforeImmediate', { asyncID, name }),

  UncaughtError: (error) =>
    event('UncaughtError', {
      name: (error || {}).name,
      stack: (error || {}).stack,
      message: (error || {}).message,
    }),
  EarlyTermination: (message) => event('EarlyTermination', { message }),
};

let events = [];
const postEvent = (event) => {
  events.push(event);

  const { type, payload, message } = event;

  if (payload?.message) {
    console.log(`[event] Type: '${type}'; Message: '${payload?.message?.trim()?.replace(/\n/g, '')}'`);
  } else {
    console.log(`[event] Type: '${type}'; FuncID: '${payload?.funcID}'; Name: '${payload?.name}'; Start: '${payload?.start}'; End: '${payload?.end}'`);
  }
};

const Tracer = {
  enterFunc: (id, name, start, end) =>
    postEvent(Events.EnterFunction(id, name, start, end)),
  exitFunc: (id, name, start, end) =>
    postEvent(Events.ExitFunction(id, name, start, end)),
  errorFunc: (message, id, name, start, end) =>
    postEvent(Events.ErrorFunction(message, id, name, start, end)),
  log: (...args) => {
    postEvent(Events.ConsoleLog(arrToPrettyStr(args)));
  },
  warn: (...args) => postEvent(Events.ConsoleWarn(arrToPrettyStr(args))),
  error: (...args) => postEvent(Events.ConsoleError(arrToPrettyStr(args))),
  iterateLoop: () => {
    const hasTimedOut = Date.now() - START_TIME > TIMEOUT_MILLIS;
    const reachedEventLimit = events.length >= EVENT_LIMIT;
    const shouldTerminate = reachedEventLimit || hasTimedOut;
    if (shouldTerminate) {
      postEvent(
        Events.EarlyTermination(
          hasTimedOut
            ? `Terminated early: Timeout of ${TIMEOUT_MILLIS} millis exceeded.`
            : `Termianted early: Event limit of ${EVENT_LIMIT} exceeded.`
        )
      );
      process.exit(1);
    }
  },
};

module.exports = { events, event, Events, postEvent, Tracer };
