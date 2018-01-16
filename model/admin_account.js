/**
 * 客户表模型
 */
var regExp =require('../utils/regExp')

module.exports = function (sequelize,DataTypes){
  return sequelize.define("admin_account", {
    mobile: {
      type: DataTypes.STRING(11),
      defaultValue: '',
      validate: {
        is: {
          args: regExp.mobile,
          msg: '请输入正确格式的手机号码，如：13990078234'
        }
      },
      unique: { msg: '该手机号用户已存在，请勿重复提交' },
      comment: '手机号'
    },
    password: {
      type: DataTypes.STRING(50),
      comment: '密码',
      defaultValue: '',
      validate: {
        len: { args: [6, 50], msg: '请输入密码，长度为6-50位' }
      }
    },
    name : {
      type :DataTypes.STRING(30),
      allowNull : false,
      defaultValue:'',
      validate : {
        len : { args: [1,30],msg : '请输入客户名称，长度为1-30位' }
      },
      comment : '客户名称'
    },
    email : {
      type : DataTypes.STRING(50),
      allowNull : true,
      validate : {
        isEmail : {
          msg : '请输入正确格式的邮箱,如:service@qq.comg'
        }
      }
    },
    
    wechat: {
      type: DataTypes.STRING(50),
      defaultValue: '',
      validate: {
        len: { args: [0, 50], msg: '请输入客户微信账号，最大长度为50位' }
      },
      comment: '微信'
    },
    status: {
      type: DataTypes.INTEGER(1),
      defaultValue: 0,
      validate: {
        isInt: { msg: '请选择正确的客户状态，如：正常' },
        isIn: { args: [[0, 1, 2]], msg: '请选择正确的客户状态，可选项为[正常，删除，禁用]' }
      },
      comment: '客户状态，0：正常，1：删除，2：禁用'
    },
    create_at : {
      type : DataTypes.DATE,
      get : function (key){
        var value = this.getDataValue(key);
        return value ? new Date(value).toFormat('YYYY/MM/DD HH24:MI:SS') : value
      }
    },
    update_at : {
      type: DataTypes.DATE,
      allowNull: false,
      get: function (key){
        var value = this.getDataValue(key);
        return value ? new Date(value).toFormat('YYYY/MM/DD HH24:MI:SS') : value
      }
    }
  },{
    comment:'用户表',
    updatedAt :'update_at',
    createdAt :'create_at',
    freezeTableName : true
  })
}