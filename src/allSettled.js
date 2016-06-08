module.exports = function(Promise) {
	return function allSettled(promises) {
		return new Promise(function(resolve, reject) {
			const results = [];
			promises.map(promise => promise.then(value => {
				return {
					state: 'fulfilled',
					value
				}
			}).catch(err => {
				return {
					state: 'rejected',
					reason: err
				}
			}).then(result => {
				results.push(result);
				if(results.length === promises.length) {
					resolve(results);
				}
			}));
		});
	};
};
