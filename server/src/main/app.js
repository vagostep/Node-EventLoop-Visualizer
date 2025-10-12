const { reduceEvents } = require("./eventsReducer");
const path = require("node:path");
const { spawn } = require("node:child_process");
const { Transform } = require("node:stream");
const express = require('express');
const cors = require("cors");
const fs = require("node:fs");

const app = express();
app.use(express.json()); 

const corsOptions = {
  origin: [
    "http://localhost:5173",
    "https://nodeloops.com",
    "https://www.nodeloops.com"
  ],
  methods: ["POST"],
  allowedHeaders: ["Content-Type", "Authorization"],
};
app.use(cors(corsOptions));

// Heroku provides a PORT env var that we have to use
const PORT = process.env.PORT || 8090;
// const wss = new WebSocket.Server({ port: PORT });
const nodePath = process.env.NODE_PATH ? `${path.join(__dirname, "../", process.env.NODE_PATH)}` : `${path.join(__dirname, "../../node")}/node`;
console.log("Running server on PORT:", PORT);

const Messages = {
  RunCode: "RunCode",
};

app.post('/execute-code', async (req, res) => {

  const reducedRequest = await processRequest(req, res);
  res.status(200).json(reducedRequest);
})

const getTransformedMessageConsoleLine = (text) => {
  
  return text?.split("Message:")?.[1]?.trim()?.replace(/^'|'$/g, '');;
}

const getTransformedMessageLine = (text) => {
  return text?.split(":")?.[1]?.trim()?.replaceAll("'", "");
};

function processRequest(req) {

  return new Promise((resolve, reject) => {
    const { type, payload, module } = req?.body;
    if (type === Messages.RunCode) {
      let events = [];
      let stdOutput = [];
      let fileExtension = module === "CommonJs" ? "js" : "mjs";

      const activeChildProcess = spawn(nodePath, [
        `${path.join(__dirname, "../worker")}/worker.${fileExtension}`,
        JSON.stringify(payload),
      ]);

      activeChildProcess.on("error", (error) => {
        console.log(`error: ${error}`);
      });

      const lineStream = new Transform({
        transform(chunk, encoding, callback) {
          // Convertir el chunk a una cadena
          const lines = chunk.toString().split("\n");

          lines
            ?.filter((line) => !!line)
            ?.forEach((line) => {
              const regexType =
                /^\[(event|ticksAndRejections|event_loop)\]\s*((?:\w+\s*:\s*(?:"[^"]*"|'[^']*'|\d+)(?:;\s*)?)+)/;
              const typeMatch = line.match(regexType);
              // console.log(line)
              if (typeMatch) {
                let message, type, name, funcId, asyncID, start, end, loopCount, loopEvents, loopEventsWaiting;

                let source = typeMatch[1];
                const match = typeMatch[2]?.trim()?.split(";");

                if (source === "event") {
                  type = getTransformedMessageLine(match[0]);
                  if (
                    type === "ConsoleLog" ||
                    type === "ConsoleWarn" ||
                    type === "ConsoleError"
                  ) {
                    message = getTransformedMessageConsoleLine(match[1]);
                  } else {
                    funcId = getTransformedMessageLine(match[1]);
                    asyncID = getTransformedMessageLine(match[5]);
                  }
                  name = getTransformedMessageLine(match[2]);
                  start = getTransformedMessageLine(match[3]);
                  end = getTransformedMessageLine(match[4]);
                } else if (source === "ticksAndRejections") {
                  type = getTransformedMessageLine(match[0]);
                } else if (source === "event_loop") {
                  const run = getTransformedMessageLine(match[1]);
                  if (run == 2) {
                    type = getTransformedMessageLine(match[2]);
                    loopCount = getTransformedMessageLine(match[4]);
                    loopEvents = getTransformedMessageLine(match[5]);
                    loopEventsWaiting = getTransformedMessageLine(match[6]);
                  }
                }

                const transformedLine = {
                  payload: {
                    message: message,
                    source: source,
                    name: name,
                    funcId: funcId,
                    start: start,
                    end: end,
                    asyncID: asyncID
                  },
                  metrics: {
                    loopCount,
                    loopEvents,
                    loopEventsWaiting,
                  },
                  type: type,
                };

                stdOutput.push(transformedLine);
              } else {
                // console.log(line);
              }
            });

          callback();
        },
      });
      activeChildProcess.stdout.pipe(lineStream);

      activeChildProcess.stderr.on("data", (data) => {
        console.log("STDERR: ", data.toString());
        reject(data.toString());
      });

      activeChildProcess.on("close", () => {
        const reducedEvents = reduceEvents(stdOutput);

        /*
        // adding main function call
        reducedEvents.unshift({
          payload: {
            message: undefined,
            source: "event",
            name: "main",
            funcId: "0",
            start: "0",
            end: "0",
          },
          type: "EnterFunction",
        });
        reducedEvents.push({
          payload: {
            message: undefined,
            source: "event",
            name: "main",
            funcId: "0",
            start: "0",
            end: "0",
          },
          type: "ExitFunction",
        });
        */

        // console.log("events: ", reducedEvents.map(JSON.stringify));        
        const finalEvents = 
        reduceMicrotasksAndPromises(
          reduceEnqueueTasks(
            reduceEventLoopCycles(
              reduceTicksAndRejectionsNonTriggeredByCallbackCycles(reducedEvents)
            )
          )
        );
        resolve(finalEvents);
      });
    } else {
      console.error("Unknown message type:", type);
    }
  })

  
}

app.listen(PORT, () => {
  console.log(`server running on http://localhost:${PORT}`);
});

const reduceTicksAndRejectionsNonTriggeredByCallbackCycles = (reduceEvents) => {
  const finalEvents = [];
  const eventLoopCycles = [
    "EventLoopPoll",
    "EventLoopPendingCallbacks",
    "EventLoopCheck",
    "EventLoopCloseCallbacks",
    "EventLoopTimers",
    "EventLoopPendingCallbacks",
    "EventLoopIdlePrepare",
  ];
  const targetSequence = [
    "TicksAndRejectionsStart",
    "TicksAndRejectionsNextTick",
    "TicksAndRejectionsMicroTasks",
    "TicksAndRejectionsFinish",
  ]

  let i = 0;
  let prevEvent;

  while (i < reduceEvents.length) {
    const currentEvent = reduceEvents[i]?.type;
    if (i > 0) {
      prevEvent = prevEvent ?? reduceEvents[i - 1]?.type;

      if (targetSequence.includes(currentEvent) && eventLoopCycles.includes(prevEvent)) {
        i++;
        continue;
      } 
    } 
    finalEvents.push(reduceEvents[i]);
    prevEvent = null;    
    i++;
  }

  return finalEvents;
}

const reduceEventLoopCycles = (reduceEvents) => {
  const finalEvents = [];
  const targetSequence = [
    "EventLoopPoll",
    "EventLoopCheck",
    "EventLoopCloseCallbacks",
    "EventLoopTimers",
    "EventLoopPendingCallbacks",
    "EventLoopIdlePrepare",
  ];

  const allowedCycles = 1;
  let completeCycles = 0;
  let i = 0;
  const numberOfPhases = targetSequence.length;
  while (i < reduceEvents.length) {
    const slice = reduceEvents.slice(i, i + numberOfPhases);
    const events = slice.map((obj) => obj.type);
    if (events.join() === targetSequence.join()) {
      if (completeCycles >= allowedCycles) {
        i += numberOfPhases;
        continue;
      }
      finalEvents.push(...slice);
      completeCycles++;
    } else {
      completeCycles = 1;
      finalEvents.push(reduceEvents[i]);
      i++;
    }

  }

  return finalEvents;
}

const reduceEnqueueTasks = (reduceEvents => {

  const BOUNDARY_TYPES = new Set([
    "EventLoopPoll",
    "EventLoopPendingCallbacks",
    "EventLoopCheck",
    "EventLoopCloseCallbacks",
    "EventLoopTimers",
    "EventLoopIdlePrepare"
  ]);

  let prevBoundary = -1;
  const toDelete = new Set();

  function processSegment(start, end) {
    if (start < 0 || end < start) return;
    const enqueueIdxs = [];
    for (let k = start; k <= end; k++) {
      if (reduceEvents[k]?.type === "EnqueueTask") enqueueIdxs.push(k);
    }
    if (enqueueIdxs.length > 0) {
      const payloads = enqueueIdxs.map(idx => reduceEvents[idx].payload);
      const first = enqueueIdxs[0];
      // Reemplaza el primer EnqueueTask por EnqueueTasks con todos los payloads
      reduceEvents[first] = { type: "EnqueueTasks", payloads: payloads };
      // Elimina los EnqueueTask restantes del segmento
      for (let m = 1; m < enqueueIdxs.length; m++) toDelete.add(enqueueIdxs[m]);
    }
  }

  // Recorremos y procesamos segmentos entre límites
  for (let i = 0; i < reduceEvents.length; i++) {
    if (BOUNDARY_TYPES.has(reduceEvents[i].type)) {
      if (prevBoundary >= 0) processSegment(prevBoundary + 1, i - 1);
      prevBoundary = i;
    }
  }

  // 🔚 También procesamos el segmento final (desde el último límite hasta el final del array)
  if (prevBoundary >= 0) processSegment(prevBoundary + 1, reduceEvents.length - 1);

  // Devolvemos filtrando los EnqueueTask marcados para eliminar
  return reduceEvents.filter((_, idx) => !toDelete.has(idx));
  
});

function reduceMicrotasksAndPromises(reduceEvents) {
  function processBlock({
    input,
    startBoundary,
    endBoundary,
    initType,
    enqueueType,
    combinedType
  }) {
    const initTypes = Array.isArray(initType) ? initType : [initType];

    let result = [...input];
    let boundaries = [];

    // Buscar todos los pares de boundaries
    for (let i = 0; i < result.length; i++) {
      if (result[i].type === startBoundary) {
        for (let j = i + 1; j < result.length; j++) {
          if (result[j].type === endBoundary) {
            boundaries.push([i, j]);
            i = j;
            break;
          }
        }
      }
    }

    // Procesar bloques de derecha a izquierda para no invalidar índices
    for (let b = boundaries.length - 1; b >= 0; b--) {
      const [startIdx, endIdx] = boundaries[b];

      const before = result.slice(0, startIdx + 1);
      const block = result.slice(startIdx + 1, endIdx);
      const after = result.slice(endIdx);

      const toRemoveIndices = new Set();

      // Paso 1: Agrupar Enqueue que NO tienen Init correspondiente
      const enqueueList = [];
      const enqueueIndicesToDelete = [];
      const initAsyncIDs = new Set(
        block
          .filter(e => initTypes.includes(e.type))
          .map(e => e.payload?.asyncID)
      );

      for (let i = 0; i < block.length; i++) {
        const item = block[i];
        if (item.type === enqueueType) {
          const asyncID = item.payload?.asyncID;
          if (!initAsyncIDs.has(asyncID)) {
            enqueueList.push({ idx: i, payload: item.payload });
            enqueueIndicesToDelete.push(i);
          }
        }
      }

      if (enqueueList.length > 0) {
        const firstIdx = enqueueList[0].idx;

        const combined = {
          type: combinedType,
          payloads: enqueueList.map(e => e.payload),
        };

        block[firstIdx] = combined;

        enqueueIndicesToDelete.forEach(i => {
          if (i !== firstIdx) toRemoveIndices.add(i);
        });
      }

      // Paso 2: Reemplazar InitX por Enqueue con mismo asyncID
      for (let i = 0; i < block.length; i++) {
        const item = block[i];
        if (initTypes.includes(item.type)) {
          const asyncID = item.payload?.asyncID;
          if (!asyncID) continue;

          const matchIdx = block.findIndex((e, j) =>
            j !== i &&
            e.type === enqueueType &&
            e.payload?.asyncID === asyncID
          );

          if (matchIdx !== -1) {
            block[i] = block[matchIdx];
            toRemoveIndices.add(matchIdx);
          }
        }
      }

      const cleanedBlock = block.filter((_, idx) => !toRemoveIndices.has(idx));
      result = [...before, ...cleanedBlock, ...after];
    }

    // Ya no eliminamos initTypes aquí
    return result;
  }

  // Paso 1: Procesar solo InitMicrotask
  const afterMicrotask = processBlock({
    input: reduceEvents,
    startBoundary: "TicksAndRejectionsNextTick",
    endBoundary: "TicksAndRejectionsMicroTasks",
    initType: "InitMicrotask",
    enqueueType: "EnqueueMicrotask",
    combinedType: "EnqueueMicrotasks"
  });

  // Paso 2: Procesar InitPromise y InitMicrotask
  const afterPromise = processBlock({
    input: afterMicrotask,
    startBoundary: "TicksAndRejectionsMicroTasks",
    endBoundary: "TicksAndRejectionsNextTick",
    initType: ["InitPromise", "InitMicrotask"],
    enqueueType: "EnqueueMicrotask",
    combinedType: "EnqueueMicrotasks"
  });

  // ✅ Finalmente, eliminamos todos los InitPromise e InitMicrotask
  const finalResult = afterPromise.filter(
    e => e.type !== "InitPromise" && e.type !== "InitMicrotask"
  );

  return finalResult;
}

