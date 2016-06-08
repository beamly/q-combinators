const allSettled = require('./allSettled');

const Promise = require('bluebird');
const x = Promise.resolve('x');
const y = Promise.reject('y');
const z = Promise.resolve('z');

allSettled([x, y, z]).then(console.log);
