var Q = require('q');
var fulfilled = require('../').object.fulfilled;

require('should');

describe('object.fulfilled', function(){
    it('should resolve with only the keys whose promises resolved', function(done){
        fulfilled({
            x: Q.reject('foo'),
            y: Q('bar'),
            z: Q('quux')
        })
        .then(function(o){
            o.should.eql({
                y: 'bar',
                z: 'quux'
            });
        })
        .then(done)
        .catch(function() {
            done();
        });
    });
});