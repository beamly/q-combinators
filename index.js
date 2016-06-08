var promise = require('./src/promise');

'use strict';

// VarArgs[N -> Promise[N+1]] -> (N -> Promise[N+n])
var compose = function(){
    var steps = Array.prototype.slice.call(arguments);
    return steps.reduceRight(function(accFn, promiseFn){
        return function(input){ return accFn(input).then(promiseFn) }
    }, function(input) { return promise.Promise.resolve(input) });
}

// Array[fn() -> Promise[T]] -> Promise[T]
var chain = function(promiseFns){
    return promiseFns.reduce(function(promise, fn){ return promise.then(fn)}, promise.Promise.resolve());
}

// Array[fn() -> Promise[T]] -> Promise[T]
var fallback = function(promiseFns) {
    var deferred = promise.defer();
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
    return accumulatedPromise.catch(function(errorsSoFar){
        return nextPromise.catch(function(error) {
            return promise.Promise.reject(errorsSoFar.concat([error]));
        })
    });
}

// Array[Promise[T]] -> Promise[T]
var fallbackParallel = function(promises){
    return promises.reduce(fallbackParallelStep, promise.Promise.reject([]));
}

module.exports = {
    setPromiseImpl: promise.setPromiseImpl.bind(promise),
    object: require('./src/object'),
    array: require('./src/array'),
    fallbackParallel: fallbackParallel,
    fallback: fallback,
    chain: chain,
    compose: compose
};
