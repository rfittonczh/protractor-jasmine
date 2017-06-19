'use strict';

exports.config = {
  onPrepare: function() {
    // eslint-disable-next-line no-undef
    browser.manage().timeouts().implicitlyWait(5000);
    // eslint-disable-next-line no-undef
    browser.manage().window().setSize(1280, 1024);
  },
  specs:     ['spec/*Spec.js'],

  suites: {
    all:      ['spec/*Spec.js'],
  },

  framework: 'mocha',
  mochaOpts: {
    reporter: 'spec',
    slow:     3000,
    retries:  1
  },

  //restartBrowserBetweenTests: true,

  //  onPrepare: function() {
  //      var caps = browser.getCapabilities()
  //  },

  directConnect: true,
  capabilities:  {
    browserName: 'chrome'
  },

  //onComplete: function() {
  //
  //  var printSessionId = function(jobName) {
  //    browser.getSession().then(function(session) {
  //      console.log('SauceOnDemandSessionID=' + session.getId() + ' job-name=' + jobName);
  //    });
  //  }
  //  printSessionId("Insert Job Name Here");
  //}
};
