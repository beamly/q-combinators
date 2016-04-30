var Q = require('q');
var demand = require('../').object.demand;

require('should');

describe('object.demand', function(){
    it('should fail if any of the promises it demands doesn\'t resolve', function(done){
        demand(['x', 'y'], {
            x: Q.reject('foo'),
            y: Q('bar'),
            z: Q('quux')
        })
        .then(Q.reject, function(o){
            o.should.eql({
                x: 'foo'
            });
        })
        .then(done)
        .catch(function () {
            done();
        });
    });

    it('should succeed by passing through the object if all demanded promises are fulfilled', function(done){
        var promises = {
            x: Q('foo'),
            y: Q('bar'),
            z: Q.reject('quux')
        };

        demand(['x', 'y'], promises)
        .then(function(o){
            o.should.eql(promises);
        })
        .then(done)
        .catch(function() {
            done();
        });
    });
});
