var promiseImpl = require('./promise');
var _ = require('lodash');

'use strict';

var isFulfilled = function(status){ return status.state === 'fulfilled' };
var isRejected = function(status){ return status.state === 'rejected' };
var get = function(p){ return function(o){ return o[p] } }

// [Promise] -> Promise[Array]
var fulfilled = function(promiseImpls){
    return promiseImpl.allSettled(promiseImpls)
        .then(function(results){ 
            return results.filter(isFulfilled).map(get('value'))
        });
}

// [Promise] -> Promise[Array]
var rejected = function(promiseImpls){
    return promiseImpl.allSettled(promiseImpls)
        .then(function(results){ 
            return results.filter(isRejected).map(get('reason'))
        });
}

module.exports = { 
    fulfilled: fulfilled, 
    rejected: rejected 
};
