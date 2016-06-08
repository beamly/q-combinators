if(global.Promise) {
    var rejected = require('../../').array.rejected;

    require('should');

    describe('native: array.rejected', function(){
        before(function() {
            require('../../').setPromiseImpl(Promise);
        });

        it('should return a Native promise', function() {
            var promise = rejected([
                Promise.reject('foo'),
                Promise.resolve('bar'),
                Promise.resolve('quux')
            ]);
            promise.then.should.eql(Promise.resolve().then);
        });

        it('should resolve with only the keys whose promises rejected', function(done){
            rejected([ 
                Promise.reject('foo'),
                Promise.reject('bar'),
                Promise.resolve('quux')
            ])
            .then(function(o){ 
                o.should.eql([
                    'foo',
                    'bar'
                ])
            })
            .then(done, done);
        });
    });
} else {
    console.warn("No Native Promises - skipping tests.");
}
