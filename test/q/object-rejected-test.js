var Promise = require('q');

var rejected = require('../../').object.rejected;

require('should');

describe('Q: object.rejected', function(){
    before(function() {
        require('../../').setPromiseImpl(Promise);
    });

    it('should return a Q promise', function() {
        var promise = rejected({
            x: Promise.reject('foo'),
            y: Promise.resolve('bar'),
            z: Promise.resolve('quux')
        });
        promise.should.have.property('fail');
    });
    it('should resolve with only the keys whose promises rejected', function(done){
        rejected({ 
            x: Promise.reject('foo'),
            y: Promise.reject('bar'),
            z: Promise.resolve('quux')
        })
        .then(function(o){ 
            o.should.eql({
                x: 'foo',
                y: 'bar'
            })
        })
        .then(done, done);
    });
});
