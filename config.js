'use strict';

module.exports = {
    PORT: process.env.PORT || 8080,
    DATABASE_URL: process.env.DATABASE_URL || 'mongodb://localhost/Food',
    TEST_DATABASE_URL: process.env.TEST_DATABASE_URL || 'mongodb://localhost/test-Food',
    API_BASE_URL: process.env.REACT_APP_API_BASE_URL || 'http://localhost:3000/api'
};