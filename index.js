var Q = require('q');
var _ = require('lodash');

'use strict';

// Array[fn() -> Promise[T]] -> Promise[T]
var chain = function(promiseFns){
    return promiseFns.reduce(function(promise, fn){ return promise.then(fn)}, Q());
}

// Array[fn() -> Promise[T]] -> Promise[T]
var fallback = function(promiseFns) {
    var deferred = Q.defer();
	var rejections = [];
    var tryNextPromise = function() {
		if(promiseFns.length > 0) {
			var first = promiseFns.shift();
			first().then(function(result) {
				deferred.resolve(result);
			}, function(reason) {
				rejections.push(reason);
				tryNextPromise();
			});
		} else {
			deferred.reject(rejections);
		}
    }
    tryNextPromise();
    return deferred.promise;
}


module.exports = {
	object: require('./src/object'),
    array: require('./src/array'),
	fallback: fallback,
    chain: chain,
    retry: require('./src/retry')
};
