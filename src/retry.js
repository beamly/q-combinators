var Q = require('q');
var _ = require('lodash');

var apply = function(fn, args){ return fn.apply(null, args) };

var attempt = function(totalRetryTimes, fn){
    var userArgs = _.toArray(arguments).slice(2);

    return Q(apply(fn, userArgs))
        .fail(function(err){
            var remainingTries = totalRetryTimes - 1;
            if ( remainingTries === 0 ) return Q.reject(err);
            else return apply(attempt, [remainingTries, fn].concat(userArgs));
        });
};

// (Number, fn() -> Promise) -> Promise
var retry = function(totalRetryTimes, fn){
    return attempt.bind(null, totalRetryTimes, fn);
}

module.exports = retry;
