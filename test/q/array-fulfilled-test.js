var Promise = require('q');

var fulfilled = require('../../').array.fulfilled;

require('should');

describe('Q: array.fulfilled', function(){
    before(function() {
        require('../../').setPromiseImpl(Promise);
    });

    it('should return a Q promise', function() {
        var promise = fulfilled([
            Promise.reject('foo'),
            Promise.resolve('bar'),
            Promise.resolve('quux')
        ]);
        promise.should.have.property('fail');
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
