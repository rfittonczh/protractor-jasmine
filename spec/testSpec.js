'use strict';

const chai   = require('chai');
chai.use(require('chai-as-promised'));
chai.should();
const expect = chai.expect;

require('./lib/test-helper');

const until = protractor.ExpectedConditions;

describe('App', function() {
  
  //I'd want to call this section below from it's own page object file
  //for organization/code maintenance purposes. This seperates what we're testing from
  //how we're testing it.
  var JsInputTxt = element(by.id("jsinput"));
  var EvalBtn = element(by.id("evaluate"));
  var ResultNum = element(by.id("result-number"));
  var HistoryHeader = element(by.id("history-title"));
  var ClearHistoryBtn = element(by.id("clear-history"));
  var complexity1 = `// Expected Complexity: 1
                        function x(){return true;} // Single Path Only`;
  //This string here is pretty terrible; in the future, something like this belongs in a helper function
  //we can require, or maybe a random snippet generator-helper.
  var complexity8 = 
        `// Expected Complexity: 8(7 plus 1 default case)
        function a(x)
        {
        switch(true){
                case 1:
                    break;
                case 2:
                    break;
                case 3:
                    break;
                case 4:
                    break;
                case 5:
                    break;
                case 6:
                    break;
                case 7:
                    break;
                default:
                    break;
            }
        }`;
  
  var nonJSSnip = "NonJavaScriptFunction";

  it('should bring up components on load', function(done) {
    browser.get(`http://localhost:${process.env.PORT}`);
    browser.wait(until.titleContains('JS Complexity'), 500);
    browser.wait(until.presenceOf(browser.element(by.id('js-complexity-app'))), 500);
    done();
  });

  it('should present a text box on load', function()
  {
    expect(JsInputTxt).to.be.present;
  });

  it('should present an Evaluate button on load', function()
  {
    expect(EvalBtn).to.be.present;
  });

  it('should accept a JavaScript function successfully', function()
  {
    JsInputTxt.clear();

    JsInputTxt.sendKeys(complexity1);

    EvalBtn.click();

    expect(browser.wait(until.presenceOf(ResultNum && HistoryHeader))).to.be.present;

    ResultNum.getText().then(function (x) {
      expect(ResultNum.getText()).to.eventually.equal('1');
    });
  });

  it('should return the correct Result number given a snippet with 8 paths of complexity', function()
  {
    JsInputTxt.clear();

    JsInputTxt.sendKeys(complexity8).then(function () {
      EvalBtn.click();
    }).then(function () {
      expect(browser.wait(until.presenceOf(ResultNum && HistoryHeader))).to.be.present;
    });

    ResultNum.getText().then(function () {

      expect(ResultNum.getText()).to.eventually.equal('8');
    });
  });
  
  //NEGATIVE TEST: Submit empty string, assert on the warning message returned after EvalBtn.Click();
  it('should report an error on submitting an empty string', function()
  {
    //In this test I would've preferred to use the built-in .clear() method on the input, 
    //but using it within the testing env still kept the placeholder text ("//Expected Complexity=3")
    //upon clicking EvalBtn. 
    JsInputTxt.click().sendKeys(protractor.Key.chord(protractor.Key.CONTROL, "a")).then(function () {
      JsInputTxt.sendKeys(protractor.Key.BACK_SPACE);
    });

    EvalBtn.click().then(function () {
      expect(browser.wait(until.presenceOf(ResultNum && HistoryHeader))).to.be.present;

      ResultNum.getText().then(function () {
        expect(ResultNum.getText()).to.eventually.equal('Please input a JavaScript function');
      });
    });
  });

  //NEGATIVE TEST: Inject non Javascript, assert on the warning message returned after EvalBtn.Click();
  it('should report an error on injecting a non JS function snippet', function()
  {
    ClearHistoryBtn.click();

    JsInputTxt.clear();

    JsInputTxt.sendKeys(nonJSSnip).then(function () {
      EvalBtn.click();
    }).then(function () {
      expect(browser.wait(until.presenceOf(ResultNum && HistoryHeader))).to.be.present;

      ResultNum.getText().then(function () {
        expect(ResultNum.getText()).to.eventually.equal('Only function declarations are supported (e.g., function hello() { return \'world\'; })');
      });
    });
  });

  it('should Clear the posted history when Clear History button is pushed', function()
  {
    if (ClearHistoryBtn.isElementPresent)
    {
      ClearHistoryBtn.click();

      expect(ClearHistoryBtn).to.not.be.present;
    }
  });

  //Possible UX issues in application:
  //Blank entry still posts to history
  //non js code inside a function still compiles with syntax error, does not calculate as 'path'
});

