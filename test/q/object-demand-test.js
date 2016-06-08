var Promise = require('q');

var demand = require('../../').object.demand;

require('should');

describe('Q: object.demand', function(){
    before(function() {
        require('../../').setPromiseImpl(Promise);
    });

    it('should return a Q promise', function() {
        var promise = demand(['x', 'y'], {
            x: Promise.reject('foo'),
            y: Promise.resolve('bar'),
            z: Promise.resolve('quux')
        });
        promise.should.have.property('fail');
    });

    it('should fail if any of the promises it demands doesn\'t resolve', function(done){
        demand(['x', 'y'], {
            x: Promise.reject('foo'),
            y: Promise.resolve('bar'),
            z: Promise.resolve('quux')
        })
        .then(Promise.reject.bind(Promise), function(o){
            o.should.eql({
                x: 'foo'
            })
        })
        .then(done, done);
    });

    it('should succeed by passing through the object if all demanded promises are fulfilled', function(done){
        var promises = {
            x: Promise.resolve('foo'),
            y: Promise.resolve('bar'),
            z: Promise.reject('quux')
        };

        demand(['x', 'y'], promises)
        .then(function(o){
            o.should.eql(promises);
        })
        .then(done, done);
    });
});
