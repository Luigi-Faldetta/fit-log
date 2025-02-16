// jest.setup.js
process.env.VITE_API_BASE_URL = 'http://localhost';
global.ResizeObserver = require('resize-observer-polyfill');
