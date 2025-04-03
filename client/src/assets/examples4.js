export default [
  {
    name: 'Notify at the end of Microtasks (problem)',
    value:`
 let promise = new Promise(function promise1(resolve) {
  console.log('promise created');
  setTimeout(function timeout1() {
    console.log('promise resolved');
    resolve();
  }, 10)
});

fs.readFile('test.js', 'utf-8', function readFile1() {
  console.log('readFile 1 processing file');
  promise.then(function commonPromise() {
    console.log('promise in readFile 1');
    console.log('complete all promises and notify to some client');
  });
});

fs.readFile('test.js', 'utf-8', function readFile2() {
  console.log('readFile 2 processing file');
  promise.then(function commonPromise() {
    console.log('promise in readFile 2');
  });
});
  `.trim(),
  },
  {
    name: 'Notify at the end of Microtasks (solution)',
    value:`
 let promise = new Promise(function promise1(resolve) {
  console.log('promise created');
  setTimeout(function timeout1() {
    console.log('promise resolved');
    resolve();
  }, 10)
});

fs.readFile('test.js', 'utf-8', function readFile1() {
  console.log('readFile 1 processing file');
  promise.then(function commonPromise() {
    console.log('promise in readFile 1');
    process.nextTick(function nextTick1() {
      console.log('complete all promises and notify to some client');
    });
  });
});

fs.readFile('test.js', 'utf-8', function readFile2() {
  console.log('readFile 2 processing file');
  promise.then(function commonPromise() {
    console.log('promise in readFile 2');
  });
});
  `.trim(),
  },
];