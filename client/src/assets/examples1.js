export default [
{
  name: 'Call Stack',
  value:`
function tenth() { }

function ninth() { tenth() }

function eigth() { ninth() }

function seventh() { eigth() }

function sixth() { seventh() }

function fifth() { sixth() }

function fourth() { fifth() }

function third() { fourth() }

function second() { third() }

function first() { second() }

first();
`.trim(),
},
{
  name: 'Timers (Macro Tasks Queue)',
  value: `
setTimeout(function a() {}, 1000);

setTimeout(function b() {}, 500);

setTimeout(function c() {}, 0);

function d() {}

d();
`.trim(),
},
{
  name: 'Pending callbacks (Macro Tasks Queue)',
  value: `
fs.readFile('file.js', 'utf-8', function readFile1(data, error) {
  console.log('readFile 1');
});
`.trim(),
},
{
  name: 'Checks (Macro Tasks Queue)',
  value: `
setImmediate(function immediate1() {
  console.log('Immediate 1');
});
`.trim(),
},
{
  name: 'Microtask Queue',
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
},
{
  name: 'Tasks vs Microtasks (challenge)',
  value: `
setTimeout(function timeout1() {
  console.log('timeout 1');
}, 500);

let i = 1;
const interval = setInterval(function interval() {
  console.log('interval ', i);
  if (i > 2) {
    clearInterval(interval);
  }
  
  i++;
}, 100);

Promise.resolve().then(function promise1() {
  console.log('promise 1');
});

queueMicrotask(function microtask1() {
  console.log('microtask 1');
});
process.nextTick(function tick1() {
  console.log('tick 1');
});

fs.readFile('file.js', 'utf-8', function readFile1(data, error) {
  console.log('readFile 1');
});

setImmediate(function immediate1() {
  console.log('immediate 1');
});
`.trim(),
},
{
  name: 'Complex example',
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
  process.nextTick(
    console.log.bind(console, 'this is the inner next tick inside next tick')
  );
});
`.trim(),
},
{
  name: 'Infinite microtask loop',
  value: `
setTimeout(function timeout1() {
  console.log('timeout 1');
  process.nextTick(function nextTick1() {
    console.log('nextTick 1');
  });
  Promise.resolve().then(function promise1() {
    console.log('nextTick 2');
    process.nextTick(function childTick1() {
      console.log('childTick 1');
    });
  });
  process.nextTick(function nextTick3() {
    console.log('nextTick 3');
    process.nextTick(function childTick1() {
      console.log('childTick 2');
    });
    process.nextTick(function childTick1() {
      console.log('childTick 3');
    });
  });
  process.nextTick(function nextTick4() {
    console.log('nextTick 4');
  });
}, 0);
setTimeout(function timeout2() {
  console.log('timeout 2');
}, 0);
`.trim(),
},
];
