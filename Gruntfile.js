'use strict';
var os = require('os');
var path = require('path');

module.exports = function (grunt) {
    // configure tasks
    grunt.initConfig({
        mocha_parallel: {
            options: {
                args: function(suiteName) {
                    return [];
                },
                env: function(suiteName) {
                    process.env.BROWSER = grunt.option('browser');
                    process.env.VERSION = grunt.option('version');
                    process.env.PLATFORM = grunt.option('platform');
                    process.env.RESOLUTION = grunt.option('resolution');
                    return process.env;
                },
                report: function(suite, code, stdout, stderr) {
                    if (stdout.length) {
                      process.stdout.write(stdout);
                    }
                    if (stderr.length) {
                      process.stderr.write(stderr);
                    }
                },
                done: function(success, results) {
                },
                mocha: path.join('node_modules', '.bin', 'mocha') + (/win32/.test(os.platform()) ? '.cmd' : ''),
                //this is the default concurrency, change as needed.
                concurrency: os.cpus().length * 1.5
            }
        },

        parallel: {
            assets: {
                options: {
                    grunt: true
                },
                tasks: ['run_windows10_chrome_56','run_windows10_firefox_46']
            }
        }
    });

    // load tasks
    grunt.loadNpmTasks('grunt-mocha-parallel');
    grunt.loadNpmTasks('grunt-parallel');
    grunt.registerTask('Windows10_chrome_56', function(n) {
      grunt.option('browser', 'chrome');
      grunt.option('version', 'Chrome56x64');
      grunt.option('platform', "Win10");
      grunt.option('resolution', "1366x768");
    });
    grunt.registerTask('Windows10_firefox_46', function(n) {
      grunt.option('browser', 'firefox');
      grunt.option('version', 'FF46x64');
      grunt.option('platform', "Win10");
      grunt.option('resolution', "1366x768");
    });
    // register tasks
    grunt.registerTask('default', ['parallel']);
    grunt.registerTask('run_windows10_chrome_56', ['Windows10_chrome_56', 'mocha_parallel']);
    grunt.registerTask('run_windows10_firefox_46', ['Windows10_firefox_46', 'mocha_parallel']);
};
