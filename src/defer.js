module.exports = function() {
	var resolve;
	var reject;
	var promise = new Promise(function(_resolve, _reject) {
		resolve = _resolve;
		reject = _reject;
	});
	return {
		promise,
		resolve,
		reject
	};
}
