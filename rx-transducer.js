const { from } = require('rxjs');
const { scan } = require('rxjs/operators');

function transducer(collection) {
  return function pipe(...operators) {
    let result = [];
    const source = from(collection);
    const collect = scan(
      (acc, res) => {
        acc.push(res);
        return acc;
      },
      []
    );
    source.pipe.apply(source, [...operators, collect]).subscribe(res => (result = res));
    return result;
  };
}

module.exports = transducer