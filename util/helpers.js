var test = require('selenium-webdriver/testing'),
    firefox = require('selenium-webdriver/firefox'),
    webdriver = require('selenium-webdriver'),
    request = require('request');
var username,
    accessKey,
    seRelayHost,
    seRelayPort,
    buildTag,
    sauceSeUri,
    tunnelId,
    remoteHub = 'http://hub.crossbrowsertesting.com:80/wd/hub';

function setSauceEnv() {
    username = process.env.USERNAME;
    accessKey = process.env.ACCESS_KEY;
    if (username == undefined || accessKey == undefined) {
        console.error("Sauce username and password is not defined!");
        process.exit(1);
    }
}

function beforeEachExample() {
    var browser = process.env.BROWSER,
        resolution = process.env.RESOLUTION,
        version = process.env.VERSION,
        platform = process.env.PLATFORM;

    var profile = new firefox.Profile();
    profile.setPreference('reader.parse-on-load.enabled', false);
    var caps = {
        name: this.currentTest.title,
        build: '1.0',
        browser_api_name: version,
        os_api_name: platform,
        screen_resolution: '1366x768',
        record_video: 'true',
        record_network: 'true',
        browserName: browser,
        username: username,
        password: accessKey,
        firefox_profile: profile
    };

    driver = new webdriver.Builder().
    withCapabilities(caps).
    usingServer(remoteHub).
    build();

    driver.getSession().then(function(sessionid) {
        driver.sessionID = sessionid.id_;
    });
};

function afterEachExample(done) {
    var passed = (this.currentTest.state === 'passed') ? 'pass' : 'fail';
    driver.call(setScore, null, passed)
        .then(function(result) {
            console.log('set score to ' + passed)

        }).then(done);
    console.log("SauceOnDemandSessionID=" + driver.sessionID + " job-name=" + this.currentTest.title);
    driver.quit();
};

function makeSuite(desc, cb) {
    test.describe(desc, function() {
        this.timeout(60000);
        setSauceEnv();
        test.beforeEach(beforeEachExample);
        cb();
        test.afterEach(afterEachExample);
    });
};

function setScore(score) {

    //webdriver has built-in promise to use
    var deferred = webdriver.promise.defer();
    var result = {
        error: false,
        message: null
    }

    if (driver.sessionID) {

        request({
                    method: 'PUT',
                    uri: 'https://crossbrowsertesting.com/api/v3/selenium/' + driver.sessionID,
                    body: {
                        'action': 'set_score',
                        'score': score
                    },
                    json: true
                },
                function(error, response, body) {
                    if (error) {
                        result.error = true;
                        result.message = error;
                    } else if (response.statusCode !== 200) {
                        result.error = true;
                        result.message = body;
                    } else {
                        result.error = false;
                        result.message = 'success';
                    }

                    deferred.fulfill(result);
                })
            .auth(username, accessKey);
    } else {
        result.error = true;
        result.message = 'Session Id was not defined';
        deferred.fulfill(result);
    }

    return deferred.promise;
}
exports.makeSuite = makeSuite;
