/*
  会话表
*/

module.exports = function(sequelize,DataTypes){
  return sequelize.define('dialog',{
    render_id : {
      type : DataTypes.INTEGER,
      allowNull : false,
      references: {
        model : "admin_account"
      },
      comment:'发送者ID'
    },
    receive_id : {
      type : DataTypes.INTEGER,
      allowNull : false,
      references:{
        model:"admin_account"
      },
      comment:'接受者ID'
    },
    category: {
      type:DataTypes.INTEGER(1),
      allowNull:false,
      defaultValue:0,
      comment:'消息类别：0:未分类消息；1:聊天内容；2:意见反馈'
    },
    status: {
      type :DataTypes.INTEGER(1),
      allowNull:false,
      defaultValue:0,
      comment : '会话状态关闭了不能聊天，只能重新创建会话；0:未设置；1:发起者会话已关闭；2:接受者会话已关闭；3:都关闭会话了'
    },
    deleted:{
      type:DataTypes.INTEGER,
      allowNull : false,
      defaultValue:0,
      comment: "删除一个会话，还可以聊天；0：未删除会话聊天；1:会话开启者已删除；2:会话接受者已删除；3:都删除；"
    }
  },{
    comment:"会话表",
    updateAt:'update_at',
    createAt:'create_at',
    // 保持表名不更改
    freezeTableName:true
  })
}