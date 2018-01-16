var crypto = require('crypto'); // 根据字符串 生产 哈希

module.exports = {
  md5 : function(string){
    if (typeof(string) !== 'string') string +='';
    var md5 = crypto.createHash('md5');
    return md5.update(string).digest('hex');
  }
}