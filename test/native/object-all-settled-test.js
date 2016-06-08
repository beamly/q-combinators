if(global.Promise) {
    var objectAllSettled = require('../../').object.allSettled;

    require('should');

    describe('native: object.allSettled', function(){
        before(function() {
            require('../../').setPromiseImpl(Promise);
        });

        it('should return a Native promise', function() {
            var promise = objectAllSettled({ 
                x: Promise.reject('foo'),
                y: Promise.resolve('bar'),
                z: Promise.resolve('quux')
            });
            promise.then.should.eql(Promise.resolve().then);
        });

        it('should return an object where rejection and success are represented as in Promise.allSettled', function(done){
            objectAllSettled({ 
                x: Promise.reject('foo'),
                y: Promise.resolve('bar'),
                z: Promise.resolve('quux')
            })
            .then(function(object){ 
                object.should.eql({ 
                    x: { state: 'rejected', reason: 'foo' },
                    y: { state: 'fulfilled', value: 'bar' },
                    z: { state: 'fulfilled', value: 'quux' }
                });
            })
            .then(done, done);
        });
    });
} else {
    console.warn("No Native Promises - skipping tests.");
}
