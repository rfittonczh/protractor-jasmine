// SEE http://stackoverflow.com/questions/29331499/when-should-we-use-then-with-protractor-promise

'use strict';

const tmp        = require('tmp');
const fs         = require('fs');
const path       = require('path');
const portfinder = require('portfinder');
const promisify  = require('es6-promisify');
const getPort    = promisify(portfinder.getPort, portfinder);
const writeFile  = promisify(fs.writeFile);

let appServerProcess   = null;
const serverStdOutFile = tmp.fileSync({ prefix: 'execthread-test-', postFix: '.out' }).name;
const serverStdErrFile = tmp.fileSync({ prefix: 'execthread-test-', postFix: '.err' }).name;
const serverStdOut     = fs.createWriteStream(serverStdOutFile);
const serverStdErr     = fs.createWriteStream(serverStdErrFile);

console.log('App server console stdout written to ' + serverStdOutFile);
console.log('App server console stderr written to ' + serverStdErrFile);

// Set up an in memory mongo to connect to
before('setup web server', function() {
  this.timeout(30000);
  return startEnvironment();
});

after('shutdown web server', function() {
  this.timeout(30000);
  return stopEnvironment();
});

function startEnvironment(debug) {
  portfinder.basePort = 3000;

  return getPort()
  .then(port => {
    console.log('Will start server on open port', port);
    process.env.PORT = port;
    return Promise.resolve(port);
  })
  .then(() => {
    appServerProcess = launchApp(debug);
    appServerProcess.stdout.pipe(serverStdOut);
    appServerProcess.stderr.pipe(serverStdErr);
    return waitForWebServer();
  });
}

function stopEnvironment() {
  return killApp();
}


function topLevelDescribe(test) {
  let describe = test;
  while(describe.parent.parent.title !== '') {
    describe = describe.parent;
  }
  return describe;
}

function launchApp(mongoPort, debug) {
  var testEnv                                         = Object.create(process.env);
  testEnv.MONGO_URL                                   = 'mongodb://localhost:' + mongoPort;
  testEnv.CLOUDWATCH_LOGGING_ENABLED                  = 'NO';
  testEnv.MONGO_LOGGING                               = 'log';
  testEnv.FAILED_DB_CONNECTION_RETRY_TIMEOUTMS        = '500';
  testEnv.MAX_FAILED_DB_CONNECTION_RETRIES_ON_STARTUP = '100';
  testEnv.DEFERED_QUEUE_ENABLED                       = 'NO';
  testEnv.JOB_MAIL_LISTENER_ENABLED                   = 'NO';
  testEnv.DISABLE_AUTO_DATA_MIGRATION                 = 'YES';

  console.log('Using local mongo Db ' + testEnv.MONGO_URL);

  var spawn = require('child_process').spawn;
  const args = debug ? ['--debug-brk=6000', '--nolazy', 'launch-app.js'] : ['launch-app.js'];
  return spawn('node', args, { cwd: __dirname, env: testEnv });
}

function waitForWebServer() {
  var rp = require('request-promise');
  return rp(`http://localhost:${process.env.PORT}`)
  .then(() => {
    console.log('App server is ready to make requests!');
    return true;
  })
  .catch(err => {
    console.log('Could not connect to testing server...' + err);
    return new Promise(resolve => { setTimeout(resolve, 1000); }).then(waitForWebServer);
  });
}

function killApp() {
  if(appServerProcess) {
    appServerProcess.stdin.pause();
    appServerProcess.kill('SIGKILL');
  }
}

global.conditions = protractor.ExpectedConditions;
global.until = protractor.ExpectedConditions;

// Pass this a *** function *** (not a promise) that will return the Promise you want to create later
global.evalPromiseLater = function(fn) {
  return browser.controlFlow().execute(fn);
};

browser.ignoreSynchronization = true;
