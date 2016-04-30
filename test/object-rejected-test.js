var Q = require('q');
var rejected = require('../').object.rejected;

require('should');

describe('object.rejected', function(){
    it('should resolve with only the keys whose promises rejected', function(done){
        rejected({ 
            x: Q.reject('foo'),
            y: Q.reject('bar'),
            z: Q('quux')
        })
        .then(function(o){ 
            o.should.eql({
                x: 'foo',
                y: 'bar'
            });
        })
        .then(done)
        .catch(function() {
            done();
        });
    });
});