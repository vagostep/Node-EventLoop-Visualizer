# Node.js EventLoop Visualizer Server

Good Read on Node.js Event Loop [here](https://nodejs.org/en/learn/asynchronous-work/event-loop-timers-and-nexttick).

Produces events for code submitted by https://node-event-loop.herokuapp.com/. 

# Dependencies 

* The repo for the client is [here](https://github.com/andresdiaz29/Node-EventLoop-Visualizer-Client).
* The repo for the Node.js modified source code is [here]()

# How to run it?

```
npm install
npm run start
```

# Issues

If you find any issue, please open a new issue

# Feature Requests

If you want to test some functionality that is not supported yet, please open a ticket request.

# Example

For example, upon receiving this input code:

```javascript
function tick1() {
  console.log('tick 1');
}

function promise1() {
  console.log('promise 1');
}

function timeout1() {
  console.log('timeout 1');
}

console.log('log 1');
process.nextTick(tick1);
setTimeout(timeout1, 100);
Promise.resolve().then(promise1);
console.log('log 2');

```

The server returns the following:

```JSON
[
  {"payload":{"source":"event","name":"main","funcId":"0","start":"0","end":"0"},"type":"EnterFunction"},
  {"payload":{"source":"event","name":"console.log","funcId":"0","start":"165","end":"176"},"type":"EnterFunction"},
  {"payload":{"message":"log 1","source":"event"},"type":"ConsoleLog"},
  {"payload":{"source":"event","name":"console.log","funcId":"1","start":"165","end":"176"},"type":"ExitFunction"},
  {"payload":{"source":"event","name":"process.nextTick","funcId":"2","start":"188","end":"204"},"type":"EnterFunction"},
  {"payload":{"source":"event","name":"process.nextTick","funcId":"3","start":"188","end":"204"},"type":"ExitFunction"},
  {"payload":{"source":"event","name":"setTimeout","funcId":"4","start":"214","end":"224"},"type":"EnterFunction"},
  {"payload":{"source":"event","name":"setTimeout","funcId":"5","start":"214","end":"224"},"type":"ExitFunction"},
  {"payload":{"source":"event","name":"Promise.resolve().then","funcId":"6","start":"242","end":"264"},"type":"EnterFunction"},
  {"payload":{"source":"event","name":"Promise.resolve().then","funcId":"7","start":"242","end":"264"},"type":"ExitFunction"},
  {"payload":{"source":"event","name":"console.log","funcId":"8","start":"277","end":"288"},"type":"EnterFunction"},
  {"payload":{"message":"log 2","source":"event"},"type":"ConsoleLog"},
  {"payload":{"source":"event","name":"console.log","funcId":"9","start":"277","end":"288"},"type":"ExitFunction"},
  {"payload":{"source":"ticksAndRejections"},"type":"NextTick"},
  {"type":"EnqueueMicrotask","payload":{"source":"event","name":"tick1","funcId":"10","start":"0","end":"47"}},
  {"type":"DequeueMicrotask","payload":{"source":"event","name":"tick1","funcId":"10","start":"0","end":"47"}},
  {"payload":{"source":"event","name":"tick1","funcId":"10","start":"0","end":"47"},"type":"EnterFunction"},
  {"payload":{"source":"event","name":"console.log","funcId":"11","start":"22","end":"33"},"type":"EnterFunction"},
  {"payload":{"message":"tick 1","source":"event"},"type":"ConsoleLog"},
  {"payload":{"source":"event","name":"console.log","funcId":"12","start":"22","end":"33"},"type":"ExitFunction"},
  {"payload":{"source":"event","name":"tick1","funcId":"13","start":"0","end":"47"},"type":"ExitFunction"},
  {"payload":{"source":"ticksAndRejections"},"type":"MicroTasks"},
  {"type":"EnqueueMicrotask","payload":{"source":"event","name":"promise1","funcId":"14","start":"51","end":"104"}},
  {"type":"DequeueMicrotask","payload":{"source":"event","name":"promise1","funcId":"14","start":"51","end":"104"}},
  {"payload":{"source":"event","name":"promise1","funcId":"14","start":"51","end":"104"},"type":"EnterFunction"},
  {"payload":{"source":"event","name":"console.log","funcId":"15","start":"76","end":"87"},"type":"EnterFunction"},
  {"payload":{"message":"promise 1","source":"event"},"type":"ConsoleLog"},
  {"payload":{"source":"event","name":"console.log","funcId":"16","start":"76","end":"87"},"type":"ExitFunction"},
  {"payload":{"source":"event","name":"promise1","funcId":"17","start":"51","end":"104"},"type":"ExitFunction"},
  {"payload":{"source":"ticksAndRejections"},"type":"NextTick"},
  {"payload":{"source":"ticksAndRejections"},"type":"MicroTasks"},
  {"payload":{"source":"ticksAndRejections"},"type":"EndProcessTicksAndRejections"},
  {"payload":{"source":"event_loop"},"type":"EventLoopStart"},
  {"payload":{"source":"event_loop"},"type":"EventLoopTimers"},
  {"payload":{"source":"event_loop"},"type":"EventLoopPendingCallbacks"},
  {"payload":{"source":"event_loop"},"type":"EventLoopIdlePrepare"},
  {"payload":{"source":"event_loop"},"type":"EventLoopPoll"},
  {"payload":{"source":"event_loop"},"type":"EventLoopPendingCallbacks"},
  {"payload":{"source":"event_loop"},"type":"EventLoopCheck"},
  {"payload":{"source":"event_loop"},"type":"EventLoopCloseCallbacks"},
  {"payload":{"source":"event_loop"},"type":"EventLoopTimers"},
  {"payload":{"source":"event_loop"},"type":"EventLoopPendingCallbacks"},
  {"payload":{"source":"event_loop"},"type":"EventLoopIdlePrepare"},
  {"payload":{"source":"event_loop"},"type":"EventLoopPoll"},
  {"payload":{"source":"event_loop"},"type":"EventLoopPendingCallbacks"},
  {"payload":{"source":"event_loop"},"type":"EventLoopCheck"},
  {"payload":{"source":"event_loop"},"type":"EventLoopCloseCallbacks"},
  {"payload":{"source":"event_loop"},"type":"EventLoopTimers"},
  {"type":"EnqueueTask","payload":{"source":"event","name":"timeout1","funcId":"18","start":"108","end":"161"}},
  {"type":"DequeueTask","payload":{"source":"event","name":"timeout1","funcId":"18","start":"108","end":"161"}},
  {"payload":{"source":"event","name":"timeout1","funcId":"18","start":"108","end":"161"},"type":"EnterFunction"},
  {"payload":{"source":"event","name":"console.log","funcId":"19","start":"133","end":"144"},"type":"EnterFunction"},
  {"payload":{"message":"timeout 1","source":"event"},"type":"ConsoleLog"},
  {"payload":{"source":"event","name":"console.log","funcId":"20","start":"133","end":"144"},"type":"ExitFunction"},
  {"payload":{"source":"event","name":"timeout1","funcId":"21","start":"108","end":"161"},"type":"ExitFunction"},
  {"payload":{"source":"ticksAndRejections"},"type":"NextTick"},
  {"payload":{"source":"ticksAndRejections"},"type":"MicroTasks"},
  {"payload":{"source":"ticksAndRejections"},"type":"EndProcessTicksAndRejections"},
  {"payload":{"source":"event_loop"},"type":"EventLoopFinish"},
  {"payload":{"source":"event","name":"main","funcId":"0","start":"0","end":"0"},"type":"ExitFunction"}
]
```


### Working

```
Promise.resolve().then()
Promise.reject().catch()
new Promise((resolve) => resolve()).then 
process.nextTick()
queueMicrotask()
setTimeout()
setInterval()
fs.readFile()
setImmediate()
Promise.all()
```

### Pending

```
// async/await
async function test() {
  console.log('test 1');
}

async function main2() {
  await test();
}

main2();

on('close', () => {});
crypto
http      
fetch   
```

### Not working
```
Promise.resolve().then(() => {
  return Promise.resolve()
}).then()
```


# Acknowledgments

This repo is an improvement of the wonderful work made by 
<table>
  <tr>
    <td align="center">
      <a href="https://github.com/PhakornKiong">
        <img src="https://github.com/PhakornKiong.png" alt="PhakornKiong" width="100" />
      </a>
      <br />
      <a href="https://github.com/PhakornKiong">PhakornKiong</a>
    </td>
    <td align="center">
      <a href="https://github.com/Hopding">
        <img src="https://github.com/Hopding.png" alt="Hopding" width="100" />
      </a>
      <br />
      <a href="https://github.com/Hopding">Hopding</a>
    </td>
    <td align="center">
      <a href="https://github.com/latentflip">
        <img src="https://github.com/latentflip.png" alt="latentflip" width="100" />
      </a>
      <br />
      <a href="https://github.com/latentflip">latentflip</a>
    </td>
    <td align="center">
      <a href="https://github.com/thedull">
        <img src="https://github.com/thedull.png" alt="thedull" width="100" />
      </a>
      <br />
      <a href="https://github.com/thedull">thedull</a>
    </td>
  </tr>
</table>

### Forked from [PhakornKiong/Node-EventLoop-Visualizer-Server](https://github.com/PhakornKiong/Node-EventLoop-Visualizer-Server)