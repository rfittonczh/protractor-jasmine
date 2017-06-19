'use strict';
// This file proxies the app.js from the app server so that we can instrument it with new login code that avoids
// needing linked in.

const path    = require('path');

// Finally launch the app!
process.chdir(path.join(__dirname, '../../'));
require('../../app.js');




