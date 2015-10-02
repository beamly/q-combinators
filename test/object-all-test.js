var Q = require('q');
var objectAll = require('../').object.all;

require('should');

describe('object.all', function(){
	it('should reject if any of the values reject', function(done){
		objectAll({ 
			x: Q.reject('foo'),
			y: Q(),
			z: Q()
		})
		.then(Q.reject, function(err){ err.should.eql('foo'); })
		.then(done, done);
	});

	it('should resolve with an object of values if all promises resolve', function(done){
		objectAll({
			x: Q('foo'),
			y: Q('bar'),
			z: Q('quux')
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
			x: Q('foo'),
			y: Q(),
			z: {
				a: Q.reject('la'),
				b: Q('la'),
				c: Q('la')
			}
		})
		.then(Q.reject, function(err){ err.should.eql('la'); })
		.then(done, done);
	});

	it('should resolve the full object tree values if all promises resolve', function(done){
		objectAll({
			x: Q('moo'),
			y: Q('baa'),
			z: {
				a: Q('la'),
				b: Q('la'),
				c: Q('la')
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
			y: Q('baa'),
			z: {
				a: Q('la'),
				b: Q('la'),
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
				a: Q('la'),
				b: Q('la'),
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