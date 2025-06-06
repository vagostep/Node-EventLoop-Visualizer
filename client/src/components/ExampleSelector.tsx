import { Portal, Select, SelectValueChangeDetails, Separator, createListCollection } from "@chakra-ui/react";
import { groupBy } from "es-toolkit";
import { useEffect, useState } from "react";
import { useColorModeValue } from "./ui/color-mode";

const examples = createListCollection({
  items: [
    {
      label: "Default",
      value: `
// Click the "RUN" button to learn how this works!
console.log('log 1');
setTimeout(() => {
  console.log('Timeout executed 1');
}, 200);
console.log('log 2');

// NOTE:
//   This is an interactive vizualization. So try 
//   editing this code and see what happens. You
//   can also try playing with some of the examples 
//   from the dropdown!
`.trim(),
      level: "Easy",
      id: 0,
    },
    {
      label: "Call Stack",
      value: `
function tenth() { 
  console.log("tenth");
}

function ninth() { 
  tenth(); 
  console.log("ninth")
}

function eigth() { 
  ninth();
  console.log("eigth");
}

function seventh() { 
  eigth();
  console.log("seventh");
}

function sixth() { 
  seventh(); 
  console.log("sixth");
}

function fifth() { 
  sixth(); 
  console.log("fifth");
}

function fourth() { 
  fifth(); 
  console.log("fourth");
}

function third() { 
  fourth(); 
  console.log("third");
}

function second() { 
  third(); 
  console.log("second");
}

function first() { 
  second(); 
  console.log("first");
}

first();
`.trim(),
      level: "Easy",
      id: 1,
    },
    {
      label: "Timeouts",
      value: `
setTimeout(function a() {}, 1000);

setTimeout(function b() {}, 500);

setTimeout(function c() {}, 0);

function d() {}

d();
`.trim(),
      level: "Easy",
      id: 2,
    },
    {
      label: "Intervals",
      value: `
console.log('start');
let i = 1;
const interval = setInterval(function a() {
  console.log('Interval ', i++);
  
  if (i > 4) {
    clearInterval(interval);
  }
}, 100);
console.log('end');
`.trim(),
      level: "Easy",
      id: 3,
    },
    {
      label: "File System",
      value: `
fs.readFile(function readFile1(data, error) {
  console.log('readFile 1');
});

console.log('log 1');
fs.readFileSync();
console.log('log 2');
`.trim(),
      level: "Intermediate",
      id: 4,
    },
    {
      label: "Immediate",
      value: `
setImmediate(function immediate1() {
  console.log('Immediate 1');
});
`.trim(),
      level: "Easy",
      id: 5,
    },
    {
      label: "Micro Tasks",
      value: `
function microTaskQueued() {
  console.log('microTaskQueued');
}

function promiseResolved() {
  console.log('promiseResolved');
}

function nextTickExecuted() {
  console.log('nextTickExecuted');
}

function promiseRejected() {
  console.log('promiseRejected');
}

Promise.resolve().then(promiseResolved);

process.nextTick(nextTickExecuted);
  
queueMicrotask(microTaskQueued);

Promise.reject().catch(promiseRejected);
`.trim(),
      level: "Intermediate",
      id: 6,
    },
    {
      label: "Nested Ticks",
      value: `
setImmediate(function immediate1() {
  console.log('this is set immediate 1');
});
setImmediate(function immediate2() {
  console.log('this is set immediate 2');
});
console.log('1');
setTimeout(function timeout1() {
  console.log('this is set timeout 1');
}, 0);
setTimeout(function timeout2() {
  console.log('this is set timeout 2');
  process.nextTick(function timeout2NextTick() {
    console.log('this is process.nextTick added inside setTimeout');
  });
}, 0);
setTimeout(function timeout3() {
  console.log('this is set timeout 3');
}, 100);
console.log('2');
process.nextTick(function nextTick1() {
  console.log('this is process.nextTick 1');
});
process.nextTick(function nextTick2() {
  console.log('this is process.nextTick 2');
  process.nextTick(() =>
    console.log('this is the inner next tick inside next tick')
  );
});
`.trim(),
      level: "Intermediate",
      id: 7,
    },
    {
      label: "Sockets",
      value: `
// Creating a server
const server = net.createServer((socket) => {
  console.log('Client connected.');

  socket.on('close', () => {
    console.log('Socket closed.');
  });

  setTimeout(() => {
    console.log('Destroying socket...');
    socket.destroy();
  }, 1000);
});

server.listen(() => {
  console.log('Server listening...');

  // Creating a client
  const client = net.createConnection(() => {
    console.log('Connection stablished.');
  });
  
  client.on('close', () => {
    console.log('Connection closed.');
    server.close();
  });
});
`.trim(),
      level: "Advanced",
      id: 8,
    },
    {
      label: "Http Server",
      value: `
const server = http.createServer((req, res) => {
  console.log('Server received a request:', req.method, req.url);
  res.writeHead(200, { 'Content-Type': 'text/plain' });
  res.end('Hello world!');
  
  setTimeout(() => {
    server.close();
  }, 1000);
});

server.on('close', () => {
  console.log('Closing server.');
});

server.listen(() => {
  console.log('Server listening...');

  setTimeout(() => {
  
    const req = http.request((res) => {
      console.log('Client received a response');
  
      res.on('end', () => {
        console.log('Client disconnected.')
      });
    });
  
    req.end();
  }, 10);
});
`.trim(),
      level: "Advanced",
      id: 9,
    },
  ],
});

const levels = Object.entries(groupBy(examples.items, (example) => example.level));

export interface ExampleSelectorValueChangeDetails {
  label: string;
  value: string;
  level: string;
}

interface ExampleSelectorProps {
  onValueChange: (code: string | undefined) => void;
  disabled: boolean;
}

const ExampleSelector: React.FC<ExampleSelectorProps> = ({
  onValueChange,
  disabled,
}) => {
  const [value, setValue] = useState<Array<string>>([]);
  const backgroundIndicatorColor = useColorModeValue('#fbf1d3', '#151513');
  const backgroundColor = useColorModeValue('#fdf6e3', '#151513');
  const fontColor = useColorModeValue('#1a1a1a', '#ffffff');

  const _onValueChange = (
    details: SelectValueChangeDetails<ExampleSelectorValueChangeDetails>
  ) => {
    setValue(details.value);
    onValueChange(details?.value?.[0]);
  };

  useEffect(() => {
    if (examples.firstValue) {
      setValue([examples.firstValue]);
      onValueChange(examples.firstValue);
    }
  }, []);

  return (
    <Select.Root
      collection={examples}
      size={{ base: "xs", lg: "sm" }}
      width="71%"
      shadow="sm"
      borderRadius="0px"
      value={value}
      disabled={disabled}
      onValueChange={_onValueChange}
      textStyle={{ base: "xs", lg: "md" }}
    >
      <Select.HiddenSelect />
      <Select.Control>
        <Select.Trigger bg={backgroundColor}  _hover={{
            border: "none"
          }} _focus={{
            border: "none",
            outline: "none",
            borderRadius: "0px"
          }}
          color={fontColor}>
          <Select.ValueText placeholder="Choose an Example" />
        </Select.Trigger>
        <Select.IndicatorGroup bg={backgroundIndicatorColor} _hover={{
            borderColor: "#e4e4e7"
          }} _focus={{
            outline: "none",
            borderRadius: "0px"
          }}>
          <Select.Indicator />
        </Select.IndicatorGroup>
      </Select.Control>
      <Portal>
        <Select.Positioner>
          <Select.Content bg={backgroundColor} _hover={{
            borderColor: "#e4e4e7"
          }}>
            {levels.map(([level, items]) => (
              <div key={level}>
                <Select.ItemGroup key={level}>
                  {items.map((item) => (
                    <Select.Item item={item} key={item.id} textStyle={{ base: "xs", lg: "md" }} color={fontColor}>
                      {item.label}
                      <Select.ItemIndicator />
                    </Select.Item>
                  ))}
                </Select.ItemGroup>
                <Separator />
              </div>
            ))}
          </Select.Content>
        </Select.Positioner>
      </Portal>
    </Select.Root>
  );
};

export default ExampleSelector;