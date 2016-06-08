var Q = require('q');
var defer = require('./defer');
var allSettled = require('./allSettled');

var promiseImpl = module.exports = {
	Promise: Q,
	setPromiseImpl: function(impl) {
		promiseImpl.Promise = impl;
	},
	allSettled: function(promises) {
		return promiseImpl.Promise.allSettled ? promiseImpl.Promise.allSettled(promises) : allSettled(promiseImpl.Promise).bind(promiseImpl.Promise)(promises);
	},
	defer: function() {
		return promiseImpl.Promise.defer ? promiseImpl.Promise.defer() : defer.bind(promiseImpl.Promise)();
	}
};
