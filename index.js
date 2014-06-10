var Q = require('q');

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


var fallbackParallelStep = function(accumulatedPromise, nextPromise){
    return accumulatedPromise.fail(function(errorsSoFar){
        return nextPromise.fail(function(error) {
            return Q.reject(errorsSoFar.concat([error]));
        })
    });
}

// Array[Promise[T]] -> Promise[T]
var fallbackParallel = function(promises){
    return promises.reduce(fallbackParallelStep, Q.reject([]));
}

// Promise[T], { timeout: Number, message: String } -> Promise[T]
var timeout = function(promise, opts){
    var def = Q.defer();
    setTimeout(function(){
        def.reject(opts.message);
    }, opts.timeout);
    promise.then(def.resolve, def.reject);
    return def.promise;
}

module.exports = {
	object: require('./src/object'),
    array: require('./src/array'),
    fallbackParallel: fallbackParallel,
	fallback: fallback,
    chain: chain,
    timeout: timeout
};
