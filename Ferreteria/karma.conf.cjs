module.exports = function (config) {
    config.set({
        hostname: 'localhost',
        port: 9876,
        autoWatch: true,
        singleRun: false,
        restartOnFileChange: true,
        browsers: ['Firefox'],
        frameworks: ['jasmine'],

        files: [
            { pattern: 'test-main.ts', watched: false },
        ],

        preprocessors: {
            'test-main.ts': ['webpack'],
        },

        webpack: require('./webpack.config.cjs'),

        reporters: ['progress', 'coverage', 'spec'],

        coverageReporter: {
            dir: 'coverage',
            includeAllSources: true,
            reporters: [
                { type: 'html', subdir: 'html' },
                { type: 'text' },
                { type: 'text-summary' },
                { type: 'lcovonly', subdir: '.', file: 'lcov.info' },
            ],
        },

        client: {
            jasmine: {
                random: false,
            },
        },
    });
};