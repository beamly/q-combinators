var Bluebird = require('bluebird');
var Q = require('q');

var sinon = require('sinon');

var QC = require('../src/promise');
var compose = QC.compose;

require('should');

describe('q-combinators', function(){
    it('should use Q by default', function(){
        QC.Promise.should.eql(Q);
    });

    it('should use Bluebird when set', function(){
        require('../').setPromiseImpl(Bluebird);
        QC.Promise.should.eql(Bluebird);
    });

    it('should use Q when set', function(){
        require('../').setPromiseImpl(Q);
        QC.Promise.should.eql(Q);
    });

    if(global.Promise) {
        it('should use native Promises when set', function(){
            require('../').setPromiseImpl(global.Promise);
            QC.Promise.should.eql(global.Promise);
        });
    } else {
        console.warn("No Native Promises - skipping test.");
    }
});
