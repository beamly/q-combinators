var promiseImpl = require('./promise');
var _ = require('lodash');

'use strict';

// Object[String, Promise] -> Promise[Object]
var allSettled = function(objectOfPromises){
    var keys = _.keys(objectOfPromises);
    var promiseImpls = _.values(objectOfPromises);

    return promiseImpl.allSettled(promiseImpls)
        .then(function(vals){
            return _.zipObject(keys, vals) ;
        });
};

// Object[String, Promise] -> Promise[Object]
var all = function(obj){
    var objectOfPromises = _.mapValues(obj, function(value, key){
        if (isPromise(value)) {
            return value;
        }
        else if (_.isArray(value)) {
            return promiseImpl.Promise.resolve(value);
        }
        else if(_.isObject(value)) {
            return all(value);
        }
        else {
            return promiseImpl.Promise.resolve(value);
        }
    });

    var keys = _.keys(objectOfPromises);
    var promiseImpls = _.values(objectOfPromises);

    return promiseImpl.Promise.all(promiseImpls).then(function(vals){
        return _.zipObject(keys, vals) ;
    });
};

// Object[String, Promise] -> Promise[Object]
var fulfilled = function(objectOfPromises){
    return allSettled(objectOfPromises)
        .then(function(o){
            var fulfilled = _.pickBy(o, function(res){ return res.state === 'fulfilled' });
            return _.mapValues(fulfilled, function(res){ return res.value });
        });
}

// Object[String, Promise] -> Promise[Object]
var rejected = function(objectOfPromises){
    return allSettled(objectOfPromises)
        .then(function(o){
            var rejected = _.pickBy(o, function(res){ return res.state === 'rejected' });
            return _.mapValues(rejected, function(res){ return res.reason });
        });
}

var containsAnyKey = function(obj, keys){
    return keys.some(function(key){ return key in obj });
}

// Array[String], Object[String, Primise] -> Promise[Object[String, Promise]]
var demand = function(keys, objectOfPromises){
    return rejected(objectOfPromises)
        .then(function(rejections){
            if ( containsAnyKey(rejections, keys) ) return promiseImpl.Promise.reject(_.pick(rejections, keys));
            else return objectOfPromises;
        });
}

function isPromise (v) {
    return v && typeof v === 'object' && typeof v.then === 'function'
}


module.exports = {
    all: all,
    allSettled: allSettled,
    fulfilled: fulfilled,
    rejected: rejected,
    demand: demand
};
