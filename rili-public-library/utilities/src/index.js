// NOTE: Only the utility filenames listed here will be available from the final build in `/lib`
// This allows tree-shaking

const utilities = [
    // Constants
    'constants/index',

    // Database Helpers
    'db/index',

    // HTTP/REST Helpers
    'http/index',

    // Utilities
    'calculate-pages',
    'format-sql-join-as-json',
    'http-response',
    'localization',
    'promiser',
    'scroll-to',
    'print-logs',
];

module.exports = utilities;
