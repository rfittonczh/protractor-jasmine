/* eslint-disable */
'use strict';

exports.config = {

  onPrepare: function() {
    browser.manage().timeouts().implicitlyWait(15000);
    browser.manage().window().setSize(1280, 1024);
    browser.driver.getCapabilities().then(function(caps) {
      browser.browserName = caps.get('browserName');
      browser.isPhantomJs = browser.browserName == 'phantomjs';
    });
  },

  //onComplete: function() {
  //},

  specs: ['spec/*Spec.js'],

  framework: 'mocha',
  mochaOpts: {
    reporter: 'xunit-file',
    slow:     3000,
    retries:  5
  },

  //restartBrowserBetweenTests: true,
  directConnect: true,
  capabilities:  {
    browserName: 'chrome'
  }

};
