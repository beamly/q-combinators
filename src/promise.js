var Q = require('q');
var defer = require('./defer');
var allSettled = require('./allSettled');

module.exports = {
	Promise: Q,
	setPromiseImpl: function(promiseImpl) {
		module.exports.Promise = promiseImpl;
	},
	allSettled: function(promises) {
		return module.exports.Promise.allSettled ? module.exports.Promise.allSettled(promises) : allSettled(module.exports.Promise).bind(module.exports.Promise)(promises);
	},
	defer: function() {
		return module.exports.Promise.defer ? module.exports.Promise.defer() : defer.bind(module.exports.Promise)();
	}
};
