# node-q-combinators

functions to combine (q) promises.


## Installing

Add the following to your package.json dependencies:

```json
{
	"dependencies": {
		"q-combinators": "git+ssh://git@github.com:zeebox/node-q-combinators.git#v0.0.1"
	}
}
```

## API

### .chain

Sequentially executes an array of promises.  The equivalent of a lot of `.then` chains:

```
var inc = function(a){ return a + 1 };
var promise1 = function(){ return Q(1) };

qCombinators.chain([promise1, inc, inc, inc])
	.then(function(val){
		// val === 4
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

### .retry

Returns a function that acts the same as the original supplied function, but will retry n times. If it doesn't get a successful result, it will reject the promise it returns with the latest rejection reason.


```javascript
var getUsers = function(){ /* return promise of users */ };
var getUsersWithRetry = qCombinators.retry(5, getUsers);

getUsers(/* original args here */).then(/* handle as normal here */)

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
	})
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
	})
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
	})
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
    })
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
    })

```


## Contributing

Pull request to this repo, and get a code-review :D.
