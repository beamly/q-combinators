if(global.Promise) {
    var sinon = require('sinon');
    var fallbackParallel = require('../../').fallbackParallel;

    require('should');

    describe('native: fallbackParallel', function(){
        before(function() {
            require('../../').setPromiseImpl(Promise);
        });

        it('should return a Native promise', function() {
            var promise = fallbackParallel([
                Promise.reject('foo'),
                Promise.resolve('bar')
            ]);
            promise.then.should.eql(Promise.resolve().then);
        });

        it('should resolve the when first promise is resolved', function(done) {
            fallbackParallel([
                Promise.reject('foo'),
                Promise.resolve('bar')
            ])
            .then(function(o){
                o.should.eql('bar');
            })
            .then(done, done);
        });

        it('should reject when all promises are rejected', function(done) {
            fallbackParallel([
                Promise.reject('foo'),
                Promise.reject('bar')
            ])
            .catch(function(o){
                o.should.eql([
                    'foo',
                    'bar'
                ]);
            })
            .then(done, done);
        });
    });
} else {
    console.warn("No Native Promises - skipping tests.");
}
