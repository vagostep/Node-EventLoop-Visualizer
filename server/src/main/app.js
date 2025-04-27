const { reduceEvents } = require("./eventsReducer");
const path = require("node:path");
const { spawn } = require("node:child_process");
const { Transform } = require("node:stream");
const express = require('express');
const cors = require("cors");

const app = express();
app.use(express.json()); 

const corsOptions = {
  origin: [
    "http://localhost:5173",
    "https://vagostep.github.io",
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

const getTransformedMessageLine = (text) => {
  return text?.split(":")?.[1]?.trim()?.replaceAll("'", "");
};

function processRequest(req) {

  return new Promise((resolve, reject) => {
    const { type, payload } = req?.body;
    if (type === Messages.RunCode) {
      let events = [];
      let stdOutput = [];
      let isFinished = false;
      console.log("worker: ", `${path.join(__dirname, "../worker")}/worker.js`);
      console.log("nodePath: ", nodePath);
      const activeChildProcess = spawn(nodePath, [
        `${path.join(__dirname, "../worker")}/worker.js`,
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
              console.log(typeMatch)
              if (typeMatch) {
                let message, type, name, funcId, start, end;

                let source = typeMatch[1];
                const match = typeMatch[2]?.trim()?.split(";");

                if (source === "event") {
                  type = getTransformedMessageLine(match[0]);
                  if (
                    type === "ConsoleLog" ||
                    type === "ConsoleWarn" ||
                    type === "ConsoleError"
                  ) {
                    message = getTransformedMessageLine(match[1]);
                  } else {
                    funcId = getTransformedMessageLine(match[1]);
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
                  },
                  type: type,
                };

                stdOutput.push(transformedLine);
              }
            });

          callback();
        },
      });
      activeChildProcess.stdout.pipe(lineStream);

      activeChildProcess.stderr.on("data", (data) => {
        // console.log("STDERR: ", data.toString());
      });

      activeChildProcess.on("close", () => {
        const reducedEvents = reduceEvents(stdOutput);

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

        // console.log("events: ", reducedEvents.map(JSON.stringify));        
        const finalEvents = reduceEventLoopCycles(reducedEvents);
        resolve(finalEvents);
      });
    } else {
      console.error("Unknown message type:", type);
    }
  })

  
}

app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});

const reduceEventLoopCycles = (reduceEvents) => {
  const finalEvents = [];
  const targetSequence = [
    "EventLoopPoll",
    "EventLoopPendingCallbacks",
    "EventLoopCheck",
    "EventLoopCloseCallbacks",
    "EventLoopTimers",
    "EventLoopPendingCallbacks",
    "EventLoopIdlePrepare",
  ];

  const allowedCycles = 1;
  let completeCycles = 1;
  let i = 0;
  while (i < reduceEvents.length) {
    const slice = reduceEvents.slice(i, i + 7);
    const events = slice.map((obj) => obj.type);
    if (events.join() === targetSequence.join()) {
      if (completeCycles > allowedCycles) {
        i += 7;
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