/*eslint-env node */
var Cucumber = require('cucumber');
var assert = require('cucumber-assert');
var webdriver = require('selenium-webdriver');

Cucumber.defineSupportCode(function({setDefaultTimeout}) {
  setDefaultTimeout(60 * 1000);
});

Cucumber.defineSupportCode(function(context) {
  var When = context.When;
  var Then = context.Then;
  
  function createBrowserStackSession(config, caps){
    return new webdriver.Builder().
      usingServer('http://'+config.server+'/wd/hub').
      withCapabilities(caps).
      build();
  }

  var config = {
    server: 'hub-cloud.browserstack.com',
    capabilities: [{
      browserName: 'chrome',
      build: process.env.CIRCLE_BUILD_NUM,
      project: process.env.CIRCLE_PROJECT_REPONAME + '-' + process.env.CIRCLE_BRANCH,
      'browserstack.local': true
    }]
  };

  var task_id = parseInt(process.env.TASK_ID || 0, 10);
  var caps = config.capabilities[task_id];
  caps['browserstack.user'] = process.env.BS_USERNAME || config.user;
  caps['browserstack.key'] = process.env.BS_AUTHKEY || config.key;

  // Code to start browserstack local before start of test and stop browserstack local after end of test
  var browserstack = require("browserstack-local");
  var driver;
  bs_local = new browserstack.Local();
  bs_local.start({'key': caps['browserstack.key']}, function(error) {
    driver = createBrowserStackSession(config, caps);
  });

  ///// Your step definitions /////
  //
  // use 'Given', 'When' and 'Then' to declare step definitions
  //

  When(/^I open site$/, function (next) {
    driver.get('http://127.0.0.1/').then(next);
  });

  Then(/^I should see title "([^"]*)"$/, function (titleMatch, next) {
    driver.getTitle()
      .then(function(title) {
        assert.equal(title, titleMatch, next, 'Expected title to be ' + titleMatch);
      });
  });
  
  setTimeout(driver.quit, 5000);

});
