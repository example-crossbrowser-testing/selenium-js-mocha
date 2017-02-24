var assert = require('assert'),
    webdriver = require('selenium-webdriver'),
    By = webdriver.By,
    makeSuite = require('../util/helpers').makeSuite;
var waitTime = 1000;
var timeout = 5000;

makeSuite('Check Menu Site', function() {

    it('should not error', function(done) {
        driver.controlFlow().on('uncaughtException', function(err) {
            console.log('There was an uncaught exception: ' + err);
        });
        driver.get('https://iglu.net').then(function() {
                console.log('loaded URL');
                return driver.wait(webdriver.until.elementLocated(By.linkText("Outsource")), timeout).click()
            }).then(waiting)
            .then(() => {
                console.log('Outsource clicked');
                return driver.wait(webdriver.until.elementLocated(By.linkText("Relocate")), timeout).click()
            }).then(waiting)
            .then(() => {
                console.log('Relocate clicked');
                return driver.wait(webdriver.until.elementLocated(By.linkText("Blog")), timeout).click()
            }).then(waiting)
            .then(() => {
                console.log('Blog clicked');
                return driver.wait(webdriver.until.elementLocated(By.linkText("FAQ")), timeout).click()
            })
            .then(() => {
                console.log('FAQ clicked');
                return driver.wait(webdriver.until.elementLocated(By.xpath("//div[@id='learn_more']//a[.='Close']")), timeout).click()
            })
            .then(() => {
                console.log('Close clicked');
                return driver.wait(webdriver.until.elementLocated(By.linkText("Contact")), timeout).click()
            })
            .then(() => {
                console.log('Contact clicked');
                return driver.wait(webdriver.until.elementLocated(By.xpath("//a[@id='closeContact']/i")), timeout).click()
            })
            .then(() => {
                console.log('closeContact clicked');
                done();
            })
    });

});

var waiting = function() {
    return driver.sleep(waitTime);
}
