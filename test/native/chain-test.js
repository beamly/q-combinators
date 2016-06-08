if(global.Promise) {
    var sinon = require('sinon');
    var chain = require('../../').chain;

    require('should');

    describe('native: chain', function(){
        before(function() {
            require('../../').setPromiseImpl(Promise);
        });

        var inc = function(a){ return a + 1 };
        var promise1 = function(){ return Promise.resolve(1) };
        var reject1 = function(){ return Promise.reject(1) };

        it('should return a Native promise', function() {
            var promise = chain([promise1, inc, inc, inc, inc]);
            promise.then.should.eql(Promise.resolve().then);
        });

        it('be the equivalent of a promise chain', function(done){
            chain([promise1, inc, inc, inc, inc])
                .then(function(val){ 
                    val.should.eql(5);
                })
                .then(done, done);
        });

        it('should handle failure the same way as a promise chain', function(done){
            chain([reject1, inc, inc, inc, inc])
                .catch(function(val){ 
                    val.should.eql(1);
                })
                .then(done, done);
        });
    });
} else {
    console.warn("No Native Promises - skipping tests.");
}
