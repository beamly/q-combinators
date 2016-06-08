var Promise = require('bluebird');

var rejected = require('../../').object.rejected;

require('should');

describe('bluebird: object.rejected', function(){
    before(function() {
        require('../../').setPromiseImpl(Promise);
    });

    it('should return a Bluebird promise', function() {
        var promise = rejected({
            x: Promise.reject('foo'),
            y: Promise.resolve('bar'),
            z: Promise.resolve('quux')
        });
        promise.then.should.eql(Promise.resolve().then);
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
