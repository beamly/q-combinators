var Promise = require('q');

var rejected = require('../../').array.rejected;

require('should');

describe('Q: array.rejected', function(){
    before(function() {
        require('../../').setPromiseImpl(Promise);
    });

    it('should return a Q promise', function() {
        var promise = rejected([
            Promise.reject('foo'),
            Promise.resolve('bar'),
            Promise.resolve('quux')
        ]);
        promise.should.have.property('fail');
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
