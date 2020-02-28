//引用mongoose模块
var mongoose = require('mongoose');
var connection = require('../connection');
var moment = require('moment');

// 创建对象定义集合结构类型(其实就是表结构)
var messageSchema = new mongoose.Schema({
  name: String,
  phone: String,
  email: String,
  content: String,
  sourceStr: String,
  createTime: {
    type: String,
    default: moment(Date.now()).format('YYYY-MM-DD HH:mm:ss')
  }
});

// 标签列表
var Tag = connection.model('Message',messageSchema);

module.exports = Tag;