var Q = require('q');
var timeout = require('../').timeout;

var delay = function(val, delay){
    var def = Q.defer();
    setTimeout(function(){ def.resolve(val) }, delay)
    return def.promise
}

require('should');

describe('timeout', function(){
    it('should fail if promise exceeds the timeout', function(done){
        timeout(delay('success!', 150), { timeout: 100, message: 'operation timed out!' })
            .then(Q.reject, function(err){
                err.should.eql('operation timed out!');
            })
            .then(done, done);
    });

    it('should succeed if promise doesn\'t exceed the timeout', function(done){
        timeout(delay('success!', 50), { timeout: 100, message: 'operation timed out!' })
            .then(function(val){
                val.should.eql('success!');
            })
            .then(done, done);
    });

    it('should propogate a failure from the promise if it fails', function(done){
        timeout(Q.reject('error'), { timeout: 100, message: 'operation timed out!' })
            .then(Q.reject, function(err){
                err.should.eql('error');
            })
            .then(done, done);
    });
});
