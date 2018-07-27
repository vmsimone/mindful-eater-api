'use strict';

exports.TEST_DATABASE_URL = process.env.TEST_DATABASE_URL || 'mongodb://localhost/test-mindful-eater';
exports.DATABASE_URL = process.env.DATABASE_URL || 'mongodb://localhost/mindful-eater';
exports.PORT = process.env.PORT || 8080;