var log4js = require('log4js');

log4js.configure({
  appenders: {
    cheeseLogs: { type: 'file', filename: 'cheese.log' },
    console: { type: 'console' }
  },
  categories: {
    cheese: { appenders: ['cheeseLogs'], level: 'error' },
    another: { appenders: ['console'], level: 'trace' },
    default: { appenders: ['console', 'cheeseLogs'], level: 'trace' }
  },
  level:'INFO',
  replaceConsole: true
});
module.exports = log4js;