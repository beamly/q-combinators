var Q = require('q');
var retry = require('../').retry;

require('should');

describe('.retry', function(){

    it('should retry n times when rejected', function(done){
        var counter = 0;

        var retryable = retry(5, function(){
            counter += 1;
            if ( counter !== 5 ) return Q.reject('retry this');
            else return counter;
        });

        retryable()
        .then(function(count){
            count.should.eql(5)
        })
        .then(done, done);
    });

    it('should exit early when successful', function(done){
        var counter = 0;

        var retryable = retry(5, function(){
            counter += 1;
            return 'done';
        });

        retryable()
        .then(function(value){
            counter.should.eql(1);
            value.should.eql('done');
        })
        .then(done, done)
    });

    it('should fail with the last error when retry count has been met', function(done){
        var counter = 0;

        var retryable = retry(5, function(){
            counter +=1;
            return Q.reject('retry this');
        });

        retryable()
        .then(Q.reject, function(value){
            value.should.eql('retry this');
            counter.should.eql(5);
        })
        .then(done, done);
    });

    it('should pass through vals to the wrapped function', function(done){
        var retryable = retry(5, function(val1, val2){
            val1.should.eql('val1');
            val2.should.eql('val2');
        });

        retryable('val1', 'val2').then(done, done);
    });
});
