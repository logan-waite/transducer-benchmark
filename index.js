const Benchmark = require('benchmark');
const fp = require('lodash/fp');
const transducer = require('./rx-transducer.js');
const {map, filter, reduce} = require('rxjs/operators');
const t = require('transducers-js');

console.log('creating test list')
const testList = Array(1000000).fill(1).map((_) => Math.random());
console.log('test list created')

var suite = new Benchmark.Suite;

// add tests
suite.add('lodash pipe', function() {
    const result = fp.pipe(
        fp.map(n => n * 2),
        fp.filter(n => n > 0.5),
        fp.reduce((m, c) => Math.max(m, c), 0)
    )(testList);
})
.add('native chain', function() {
  const result = testList
        .map(n => n * 2)
        .filter(n => n > 0.5)
        .reduce((m, c) => Math.max(m, c), 0);
})
.add('rxjs "transducer"', function() {
  const result = transducer(testList)(
        map(n => n * 2),
        filter(n => n > 0.5),
        reduce((m, c) => Math.max(m, c), 0)
  )
})
.add('clojure-style transducer', () => {
  const result = t.transduce(
    t.comp(
      t.map(n => n * 2),
      t.filter(n => n > 0.5),
    ),
    (m,c) => Math.max(m,c),
    0,
    testList
  )
})
.add('for loop', () => {
  let result = 0;
  for (let i = 0; i < testList.length; i++) {
    const doubled = i * 2;
    if (doubled > 0.5) {
      result = Math.max(result, doubled)
    }
  }
})
// add listeners
.on('start', function(event) {
    console.log('starting testing suite')
})
.on('cycle', function(event) {
  console.log(String(event.target));
})
.on('complete', function() {
  setTimeout(() => {
    console.log('Fastest is ' + this.filter('fastest').map('name'));
  }, 1000)
})
// run async
.run({ 'async': true });