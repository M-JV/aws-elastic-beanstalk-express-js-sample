const assert = require('assert');
const { getHomeMessage } = require('./app');

assert.strictEqual(
    getHomeMessage(),
    'Hello World!',
    'Home message should return the expected response'
);

console.log('UNIT TEST PASSED: getHomeMessage returned expected value.');
