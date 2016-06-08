var Promise = require('q');

var objectAllSettled = require('../../').object.allSettled;

require('should');

describe('Q: object.allSettled', function(){
    before(function() {
        require('../../').setPromiseImpl(Promise);
    });

    it('should return a Q promise', function() {
        var promise = objectAllSettled({ 
            x: Promise.reject('foo'),
            y: Promise.resolve('bar'),
            z: Promise.resolve('quux')
        });
        promise.should.have.property('fail');
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
