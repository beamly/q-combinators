var Promise = require('q');

var sinon = require('sinon');
var fallback = require('../../').fallback;

require('should');

describe('Q: fallback', function(){
    before(function() {
        require('../../').setPromiseImpl(Promise);
    });

    it('should return a Q promise', function() {
        var promise = fallback([
            function() { return Promise.reject('foo') },
            function() { return Promise.resolve('bar') }
        ]);
        promise.should.have.property('fail');
    });

    it('should resolve the when first promise is resolved', function(done) {
        fallback([
            function() { return Promise.reject('foo') },
            function() { return Promise.resolve('bar') }
        ])
        .then(function(o){
            o.should.eql('bar');
        })
        .then(done, done);
    });

    it('should reject when all promises are rejected', function(done) {
        fallback([
            function() { return Promise.reject('foo') },
            function() { return Promise.reject('bar') }
        ])
        .catch(function(o){
            o.should.eql([
                'foo',
                'bar'
            ]);
        })
        .then(done, done);
    });

    it('should only execute functions up to the point a promise is resolved', function(done) {
        var fn1 = sinon.spy(function() { return Promise.reject('foo'); });
        var fn2 = sinon.spy(function() { return Promise.resolve('bar'); });
        var fn3 = sinon.spy(function() { return Promise.resolve('baz'); });

        fallback([
            fn1,
            fn2,
            fn3
        ])
        .then(function(){
            fn1.called.should.be.true;
            fn2.called.should.be.true;
            fn3.called.should.be.false;

        })
        .then(done, done);
    });
});
