// Protractor configuration
// https://github.com/angular/protractor/blob/master/referenceConf.js

'use strict';

var config = {
  // The timeout for each script run on the browser. This should be longer
  // than the maximum time your application needs to stabilize between tasks.
  allScriptsTimeout: 110000,
  // A base URL for your application under test. Calls to protractor.get()
  // with relative paths will be prepended with this.
  baseUrl: 'http://localhost:' + (process.env.PORT || '9000'),
 // chromeDriver: './node_modules/protractor/node_modules/webdriver-manager/selenium/chromedriver_2.46',
  // If true, only chromedriver will be started, not a standalone selenium.
  // Tests for browsers other than chrome will not run.
  directConnect: true,

  // list of files / patterns to load in the browser
  specs: [
    'e2e/**/*.spec.js'
  ],

  // Patterns to exclude.
  exclude: [],

  // ----- Capabilities to be passed to the webdriver instance ----
  //
  // For a full list of available capabilities, see
  // https://code.google.com/p/selenium/wiki/DesiredCapabilities
  // and
  // https://code.google.com/p/selenium/source/browse/javascript/webdriver/capabilities.js
  multiCapabilities: [{
    'browserName': 'firefox',
    'moz:firefoxOptions': {
      'args': ["--disable-gpu",'--safe-mode'], // "--headless"
      prefs: {
        "media.navigator.permission.disabled": true,
        "media.navigator.streams.fake": true
      }
    }
  },  {
    'browserName': 'chrome',
    'unexpectedAlertBehaviour': 'accept',
    'chromeOptions': { 
      args: [  
        "--disable-gpu", 
        "--window-size=800,600", 
        "--use-fake-ui-media-stream", 
        "--use-fake-device-for-media-stream", 
        "--disable-web-security", 
        "--disable-infobars", 
        "start-maximized", 
        "--disable-extensions",
        "disable-infobars"
      ],
      prefs: {
        'VideoCaptureAllowedUrls': ['http://localhost'],
        "profile.default_content_setting_values.media_stream_mic": 1, 
        "profile.default_content_setting_values.media_stream_camera": 1,
        "profile.default_content_setting_values.geolocation": 1, 
        "profile.default_content_setting_values.notifications": 1 
      }
  }
  }],

  // ----- The test framework -----
  //
  // Jasmine and Cucumber are fully supported as a test and assertion framework.
  // Mocha has limited beta support. You will need to include your own
  // assertion framework if working with mocha.
  framework: 'jasmine',

  // ----- Options to be passed to minijasminenode -----
  //
  // See the full list at https://github.com/juliemr/minijasminenode
  jasmineNodeOpts: {
    defaultTimeoutInterval: 30000
  },
  onPrepare: function() {
    browser.driver.sleep(1000);
  }
};
// exports.config.capabilities.chromeOptions.binary = __dirname + '/chrome-linux/chrome';
if (process.env.TRAVIS) {
    config.multiCapabilities = [{
      'browserName': 'firefox',
      'moz:firefoxOptions': {
        'args': [
          "--disable-gpu",
          '--safe-mode',
        	"--headless"
        ], 
        prefs: {
          "media.navigator.permission.disabled": true,
          "media.navigator.streams.fake": true
        }
      }
    },  {
      'browserName': 'chrome',
      'unexpectedAlertBehaviour': 'accept',
      'chromeOptions': { 
        args: [
          "--headless",
          "--disable-gpu", 
          "--window-size=800,600", 
          "--use-fake-ui-media-stream", 
          "--use-fake-device-for-media-stream", 
          "--disable-web-security", 
          "--disable-infobars", 
          "start-maximized", 
          "--disable-extensions",
          "disable-infobars"
        ],
        prefs: {
          'VideoCaptureAllowedUrls': ['http://localhost'],
          "profile.default_content_setting_values.media_stream_mic": 1, 
          "profile.default_content_setting_values.media_stream_camera": 1,
          "profile.default_content_setting_values.geolocation": 1, 
          "profile.default_content_setting_values.notifications": 1 
        }
    }
    }]
}
exports.config = config;
