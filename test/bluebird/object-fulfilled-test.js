var Promise = require('bluebird');

var fulfilled = require('../../').object.fulfilled;

require('should');

describe('bluebird: object.fulfilled', function(){
    before(function() {
        require('../../').setPromiseImpl(Promise);
    });

    it('should return a Bluebird promise', function() {
        var promise = fulfilled({
            x: Promise.reject('foo'),
            y: Promise.resolve('bar'),
            z: Promise.resolve('quux')
        });
        promise.then.should.eql(Promise.resolve().then);
    });

    it('should resolve with only the keys whose promises resolved', function(done){
        fulfilled({ 
            x: Promise.reject('foo'),
            y: Promise.resolve('bar'),
            z: Promise.resolve('quux')
        })
        .then(function(o){ 
            o.should.eql({
                y: 'bar',
                z: 'quux'
            })
        })
        .then(done, done);
    });
});
