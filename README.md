# Transducer Benchmarks

Often when running transformations on collections, we want to chain operations together, often with methods such as `map`, `filter`, or `reduce`. In Javascript, the native array methods each return a new array, so every new transformation adds the overhead of creating a new array. For small arrays, this isn't something super noticeable, but as arrays get larger, we begin to see performance decreases.

Transducers allow us to perform a set of operations on each single element of an array, instead of performing a series of separate operations on multiple arrays. For example:

```
// List of chained operations
// for each operation, return a new array
[0,1,2,3,4,5]
.map(mapOperation)
.filter(filterOperation)
.map(mapOperation2) 
.reduce(reducer, []) 

// List of transducer operations
// for each item, run all operations
[0,1,2,3,4,5]
.transduce(
    map(mapOperation),
    filter(filterOperation),
    map(mapOperation2),
    reducer
)
```