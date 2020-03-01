//引用mongoose模块
const mongoose = require('mongoose');
const moment = require('moment');
const connection = require('../connection');

// 创建对象定义集合结构类型(其实就是表结构)
const messageSchema = new mongoose.Schema({
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
module.exports = connection.model('Message', messageSchema);
