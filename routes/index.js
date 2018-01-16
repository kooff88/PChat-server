var admin_account = require('./admin_account');

module.exports = function(app){
  app.use(admin_account);
}