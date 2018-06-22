# q-combinators

**Deprecation warning -** q-combinators is no longer maintained

Functions to combine q promises, capturing lots of useful, real world patterns used across Beamly's node.js services.

## Installing

```bash
npm install q-combinators --save
```

## API

### .setPromiseImpl

All API methods below accept Q promises or any Promise/A+ implementation (e.g. bluebird or Native Promises). For backwards comptability q-combinators will use the 'Q' library internally and return Q promises by default. However if your project uses another promise implementation you can pass it to setPromiseImpl() to change this behaviour.

```javascript
// use native promises
qCombinators.setPromiseImpl(global.Promise);

// use bluebird promises
qCombinators.setPromiseImpl(require('bluebird'));
```

### .object.all

Resolves an object of promises with an object of the resultant values if all promises resolve.  If any promise rejects, it rejects with the same reason

```javascript
// happy path
qCombinators.object.all({
	x: Q('foo'),
	y: Q('bar'),
	z: Q('quux')
})
.then(function(object){
	// object is:
	// {
	//   x: 'foo',
	//   y: 'bar',
	//   z: 'quux'
	// }
});

// sad path
qCombinators.object.all({
	x: Q.reject('foo'),
	y: Q(),
	z: Q()
})
.then(null, function(err){
	// err is 'foo'
});
```

### .object.allSettled

Resolves an object of promises with *all* results, using the same format as Q.allSettled

```javascript
qCombinators.object.allSettled({
	x: Q.reject('foo'),
	y: Q('bar'),
	z: Q('quux')
})
.then(function(object){
	// object is:
	// {
	//	  x: { state: 'rejected', reason: 'foo' },
	//	  y: { state: 'fulfilled', value: 'bar' },
	//	  z: { state: 'fulfilled', value: 'quux' }
	// }
});
```

### .object.fulfilled

Resolves an object of promises with *only* the fulfilled values.  If none of the promises fulfill, it fulfills with an empty object.

```javascript
qCombinators.object.fulfilled({
	x: Q.reject('foo'),
	y: Q('bar'),
	z: Q('quux')
})
.then(function(object){
	// object is:
	// {
	//   y: 'bar',
	//   z: 'quux'
	// }
});
```

### .object.rejected

Resolves an object of promises with *only* the rejected values.  If none of the promises are rejected, it fulfills with an empty object.

```javascript
qCombinators.object.rejected({
	x: Q.reject('foo'),
	y: Q('bar'),
	z: Q('quux')
})
.then(function(object){
	// object is:
	// {
	//   x: 'foo'
	// }
});
```


### .object.demand

Resolves an object of promises when the 'demanded' keys contain successful promises.

If a demanded promise fails, the returned promise will also fail.


```javascript
// happy path
qCombinators.object.demand({
	x: Q('foo'),
	y: Q.reject('bar'),
	z: Q('quux')
})
.then(function(object){
	// object is:
	// {
	//   x: 'foo',
	//   z: 'quux'
	// }
});

// sad path
demand(['x', 'y'], {
	x: Q.reject('foo'),
	y: Q('bar'),
	z: Q('quux')
})
.fail(function(errs){
	// errs is:
	// {
	//   x: 'foo'
	// }
});
```

### .array.fulfilled

Resolves an array of promises with *only* the fulfilled values.  If none of the promises are fulfilled, it fulfills with an empty array.

```javascript
qCombinators.array.fulfilled([
    Q.reject('foo'),
    Q('bar'),
    Q('quux')
])
.then(function(value){
    // value is: ['bar', 'quux']
});
```

### .array.rejected

Resolves an array of promises with *only* the rejected values.  If none of the promises are rejected, it fulfills with an empty array.

```javascript
qCombinators.array.rejected([
    Q.reject('foo'),
    Q.reject('bar'),
    Q('quux')
])
.then(function(value){
    // value is: ['foo', 'bar']
});
```

### .chain

Sequentially executes an array of promise-returning functions.  The equivalent of a lot of `.then` chains:

```javascript
var inc = function(a){ return a + 1 };
var promise1 = function(){ return Q(1) };

qCombinators.chain([promise1, inc, inc, inc])
	.then(function(val){
		// val === 4
	});
```

### .compose

Composes promise-producing functions into a single promise-producing function. Composes conventionally, from right to left.

In case of failure, returns the first failing promise in order of execution.


```javascript
var incP = function(a){ return Q(a + 1) };
var doubleP = function(a){ return Q(a * 2) };

var doubleThenAddTwo = qCombinators.compose(inc, inc, double);

doubleThenAddTwo(5)
	.then(function(val){
		// val === 12
	});
```

### .fallback

Sequentially executes an array of functions which return promises, until the first promise is resolved. If all promises are rejected it itself is rejected with an array of all the failure reasons.

```javascript
// happy path
qCombinators.fallback([
	function() { return Q.reject('foo'); },
	function() { return Q('bar'); },
	function() { return Q.reject('baz'); }
])
.then(function(result){
	// result is 'bar'
});

// sad path
qCombinators.fallback([
	function() { return Q.reject('foo'); },
	function() { return Q.reject('bar'); },
	function() { return Q.reject('baz'); }
])
.fail(function(results) {
	// results is:
	// [
	//   'foo',
	//   'bar',
	//   'baz'
	// ]
});
```

### .fallbackParallel

Same as .fallback, but takes an array of promises, allowing fetching results in parallel, then accepting them in preferential order.

```javascript
// happy path
qCombinators.fallbackParallel([
	Q.reject('foo'),
	Q('bar'),
	Q.reject('baz')
])
.then(function(result){
	// result is 'bar'
});

// sad path
qCombinators.fallbackParallel([
	Q.reject('foo'),
	Q.reject('bar'),
	Q.reject('baz')
])
.fail(function(results) {
	// results is:
	// [
	//   'foo',
	//   'bar',
	//   'baz'
	// ]
});
```


## Contributing

Contributions are currently not being accepted.

## Licensing

This project is licensed under the [BSD 3-Clause license](http://opensource.org/licenses/BSD-3-Clause).
