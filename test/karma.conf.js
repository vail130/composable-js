module.exports = function (config) {
    var configuration = {
        basePath: '',

        frameworks: ['jasmine'],
        preprocessors: {
            '**/*.html': ['html2js']
        },

        files: ['../composable.js', 'fixture.html', 'spec.js'],

        reporters: ['progress'],

        port: 9876,
        colors: true,
        logLevel: config.LOG_INFO,

        /* Karma can watch the file system for changes and
         * automatically re-run tests. Making karma do it
         * is more efficient than using gulp because karma
         * can re-use the same browser process. Set this to
         * true and `singleRun` to false to run tests
         * continuously */
        autoWatch: false,

        browsers: ['Chrome'],

        // See autoWatch
        singleRun: true,

        // Consider browser as dead if no response for 5 sec
        browserNoActivityTimeout: 5000,

        customLaunchers: {
            Chrome_travis_ci: {
                base: 'Chrome',
                flags: ['--no-sandbox']
            }
        }
    };

    if (process.env.TRAVIS) {
        configuration.browsers = ['Chrome_travis_ci'];
    }

    config.set(configuration);
};
