/*eslint-env node */

var defineSupportCode = require("cucumber").defineSupportCode;
var assert = require("cucumber-assert");
var webdriver = require("selenium-webdriver");

defineSupportCode(function(context) {
    var then = context.Then;
    var when = context.When;
    when(/^I open site$/, function (next) {
        this.driver.get("http://127.0.0.1/");
        next();
    });

    then(/^I should see title "([^"]*)"$/, function (titleMatch, next) {
        this.driver.getTitle().then(function(title) {
            assert.equal(title, titleMatch, next, "Expected title to be " + titleMatch);
        });
    });

});