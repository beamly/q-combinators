if(global.Promise) {
    var objectAll = require('../../').object.all;

    require('should');

    describe('native: object.all', function(){
        before(function() {
            require('../../').setPromiseImpl(Promise);
        });

        it('should return a Native promise', function() {
            var promise = objectAll({ 
                x: Promise.reject('foo'),
                y: Promise.resolve('bar'),
                z: Promise.resolve('quux')
            });
            promise.then.should.eql(Promise.resolve().then);
        });

        it('should reject if any of the values reject', function(done){
            objectAll({ 
                x: Promise.reject('foo'),
                y: Promise.resolve(),
                z: Promise.resolve()
            })
            .then(Promise.reject.bind(Promise), function(err){ err.should.eql('foo'); })
            .then(done, done);
        });

        it('should resolve with an object of values if all promises resolve', function(done){
            objectAll({
                x: Promise.resolve('foo'),
                y: Promise.resolve('bar'),
                z: Promise.resolve('quux')
            })
            .then(function(o){
                o.should.eql({ 
                    x: 'foo',
                    y: 'bar',
                    z: 'quux'
                });
            })
            .then(done, done);
        });

        it('should reject if any of the nested values reject', function(done){
            objectAll({ 
                x: Promise.resolve('foo'),
                y: Promise.resolve(),
                z: {
                    a: Promise.reject('la'),
                    b: Promise.resolve('la'),
                    c: Promise.resolve('la')
                }
            })
            .then(Promise.reject.bind(Promise), function(err){ err.should.eql('la'); })
            .then(done, done);
        });

        it('should resolve the full object tree values if all promises resolve', function(done){
            objectAll({
                x: Promise.resolve('moo'),
                y: Promise.resolve('baa'),
                z: {
                    a: Promise.resolve('la'),
                    b: Promise.resolve('la'),
                    c: Promise.resolve('la')
                }
            })
            .then(function(o){
                o.should.eql({ 
                    x: 'moo',
                    y: 'baa',
                    z: {
                        a: 'la',
                        b: 'la',
                        c: 'la'
                    }
                });
            })
            .then(done, done);
        });

        it('should resolve the full object tree including none promise values if all promises resolve', function(done){
            objectAll({
                x: 'moo',
                y: Promise.resolve('baa'),
                z: {
                    a: Promise.resolve('la'),
                    b: Promise.resolve('la'),
                    c: 'la'
                }
            })
            .then(function(o){
                o.should.eql({ 
                    x: 'moo',
                    y: 'baa',
                    z: {
                        a: 'la',
                        b: 'la',
                        c: 'la'
                    }
                });
            })
            .then(done, done);
        });

        it('should ignore array that is part of promise containing object', function(done){
            objectAll({
                x: 'moo',
                y: [
                    {
                        'foo': 'bar'
                    },
                    {
                        'foo': 'la'
                    }
                ],
                z: {
                    a: Promise.resolve('la'),
                    b: Promise.resolve('la'),
                    c: 'la'
                }
            })
            .then(function(o){
                o.should.eql({ 
                    x: 'moo',
                    y: [
                        {
                            'foo': 'bar'
                        },
                        {
                            'foo': 'la'
                        }
                    ],
                    z: {
                        a: 'la',
                        b: 'la',
                        c: 'la'
                    }
                });
            })
            .then(done, done);
        });
    });
} else {
    console.warn("No Native Promises - skipping tests.");
}
