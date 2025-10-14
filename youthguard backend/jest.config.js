/**
 * Jest Configuration for YouthGuard Platform
 * 
 * This file configures Jest testing framework for the project.
 */

module.exports = {
    // The test environment that will be used for testing
    testEnvironment: 'node',
    
    // The root directory that Jest should scan for tests and modules within
    rootDir: '.',
    
    // A list of paths to directories that Jest should use to search for files in
    roots: [
        '<rootDir>/tests',
        '<rootDir>/src'
    ],
    
    // The glob patterns Jest uses to detect test files
    testMatch: [
        '**/__tests__/**/*.{js,jsx,ts,tsx}',
        '**/?(*.)+(spec|test).{js,jsx,ts,tsx}',
        '**/tests/unit/**/*.test.js'
    ],
    
    // A map from regular expressions to paths to transformers
    transform: {
        '^.+\\.jsx?$': 'babel-jest'
    },
    
    // An array of regexp pattern strings that are matched against all source file paths, matched files will skip transformation
    transformIgnorePatterns: [
        '/node_modules/',
        '\\.pnp\\.[^\\/]+$'
    ],
    
    // A map from regular expressions to module names or to arrays of module names that allow to stub out resources with a single module
    moduleNameMapper: {
        '^@/(.*)$': '<rootDir>/src/$1'
    },
    
    // An array of regexp pattern strings that are matched against all module paths before considered 'visible' to the module loader
    modulePathIgnorePatterns: [
        '<rootDir>/dist/',
        '<rootDir>/build/'
    ],
    
    // A list of paths to modules that run some code to configure or set up the testing environment before each test
    setupFiles: [
        '<rootDir>/tests/setup.js'
    ],
    
    // A list of paths to modules that run some code to configure or set up the testing framework before each test
    setupFilesAfterEnv: [
        '<rootDir>/tests/setupAfterEnv.js'
    ],
    
    // The directory where Jest should output its coverage files
    coverageDirectory: 'coverage',
    
    // An array of glob patterns indicating a set of files for which coverage information should be collected
    collectCoverageFrom: [
        'src/**/*.js',
        '!src/server.js',
        '!src/config/**',
        '!src/middleware/**',
        '!src/routes/**',
        '!src/utils/logger.js'
    ],
    
    // Indicates whether the coverage information should be collected while executing the test
    collectCoverage: true,
    
    // The test environment options that will be passed to the testEnvironment
    testEnvironmentOptions: {
        url: 'http://localhost'
    },
    
    // A number limiting how many tests are allowed to run at the same time
    maxConcurrency: 5,
    
    // A number limiting how many tests can run at the same time when using "jest --runInBand"
    maxWorkers: '50%',
    
    // Use this configuration option to add custom reporters to Jest
    reporters: [
        'default',
        ['jest-junit', {
            outputDirectory: 'reports',
            outputName: 'jest-junit.xml'
        }]
    ]
};