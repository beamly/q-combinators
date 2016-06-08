var Promise = require('bluebird');

var fulfilled = require('../../').array.fulfilled;

require('should');

describe('bluebird: array.fulfilled', function(){
    before(function() {
        require('../../').setPromiseImpl(Promise);
    });

    it('should return a Bluebird promise', function() {
        var promise = fulfilled([
            Promise.reject('foo'),
            Promise.resolve('bar'),
            Promise.resolve('quux')
        ]);
        promise.then.should.eql(Promise.resolve().then);
    });

    it('should resolve with only promises resolved', function(done){
        fulfilled([
            Promise.reject('foo'),
            Promise.resolve('bar'),
            Promise.resolve('quux')
        ])
        .then(function(o){ 
            o.should.eql([
                'bar',
                'quux'
            ])
        })
        .then(done, done);
    });
});
