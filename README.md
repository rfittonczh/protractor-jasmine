# QA Candidate Test

## Overview

A test for QA candidates. The web app is written in React, node.js backend, no database (all in front-end memory). It's just a dumb app to facilitate writing a test or two with Selenium WebDriver.

The actual web app is pre-compiled so you cannot look at the source code and it's being served statically via node.

## Prerequisites

You will need git, node.js, and npm installed (node.js and npm are usually installed together). All other dependencies will be handled by npm.

## Run It

Clone this repository, `git clone https://github.com/ExecThread/YOURNAME-qa-candidate-test.git`.

Change directory to the newly cloned directory, `cd YOURNAME-qa-candidate-test`.

Run `npm install` to download and install all dependencies.

Next, run `./node_modules/.bin/webdriver-manager update`.

Finally, run `npm start`. This will start the web app on localhost, port 3031.

## Play With It

Open a browser and type `localhost:3031`. You should see the app come up ("Cyclomatic Complexity").

## Test It

A `grunt` script was set up to run the tests. Open a terminal, navigate to the cloned directory (eg, `~/YOURNAME-qa-candidate-test`), and run `grunt protractor` to trigger the tests.

Note: the tests bring up and use their own, clean environment, so they will not run against `localhost:3031`. That endpoint is just for you to familiarize yourself with the app and anything you do therein will have no effect on the unit tests (ie, you can play with it and put it in any state you want, you can close the browser, you can kill the node process running it, etc).

## Write Some Tests

To begin, create a branch off of `master` using `git checkout -b my-branch-name`. When you are finished, please make sure you've committed all of your changes to this branch (`git add .` and `git commit -m "my-comment"`) and create a Pull Request. This will indicate that you are done and that we should check your work.

A sample test case is located in `spec/testSpec.js`. You can simply add to this file to create new test cases for the application. You are expected to write several automated feature tests for this application.

The tests are inside `describe` and `it` blocks. This is [jasmine](https://jasmine.github.io/) syntax. The important part here is that each test will be in its own `it` block within the `describe`.

To make writing tests a bit easier, we've included [protractor](http://www.protractortest.org/#/api). Protractor extends Selenium WebDriver so all of that functionality is included (and more). `selenium-webdriver` is also included in the package.json so you can `require('selenium-webdriver')` or `require('selenium-webdriver/chrome')` in the test specification to use it directly.

[Chai](http://chaijs.com/) is included for assertions (eg, `should` and `expect`) but it does not have to be used.
