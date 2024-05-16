var reporter = require('cucumber-html-reporter');
const path = require('protractor-multiple-cucumber-html-reporter-plugin');

exports.config = {
  allScriptsTimeout: 11000,
  capabilities: {
    'browserName': 'chrome',
    chromeOptions: { args: ['start-maximized'] }
  },
  directConnect: true,
 // baseUrl: 'http://localhost:4200/',

  // Specs here are the cucumber feature files
  specs: [
    './features/*.feature'
  ],

  // Use a custom framework adapter and set its relative path
  framework: 'custom',
  frameworkPath: require.resolve('protractor-cucumber-framework'),

  // cucumber command line options
  cucumberOpts: {
    // require step definition files before executing features
    require: ['./steps/**/*.ts'],
    // <string[]> (expression) only execute the features or scenarios with tags matching the expression
    tags: [],
    // <boolean> fail if there are any undefined or pending steps
    strict: true,
    // <string[]> (type[:path]) specify the output format, optionally supply PATH to redirect formatter output (repeatable)
    format: 'json:src/automation/results.json',
    // <boolean> invoke formatters without executing steps
    dryRun: false,
    // <string[]> ("extension:module") require files with the given EXTENSION after requiring MODULE (repeatable)
    compiler: []
  },

// Here the magic happens
  plugins: [{
    package: 'protractor-multiple-cucumber-html-reporter-plugin',
    options:{
      // read the options part for more options
      automaticallyGenerateReport: true,
      removeExistingJsonReportFile: true
  }
}],

  // Enable TypeScript for the tests
  onPrepare() { 
    // browser.manage().timeouts().pageLoadTimeout(40000);
    // browser.manage().timeouts().implicitlyWait(25000);

    // for non-angular page
    browser.ignoreSynchronization = true;

    require('ts-node').register({
      project: 'e2e/tsconfig.e2e.json'
    });
   }


};