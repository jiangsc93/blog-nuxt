//引用mongoose模块
const mongoose = require('mongoose');
const moment = require('moment');
const connection = require('../connection');
// 创建对象定义集合结构类型(其实就是表结构)
const tokenSchema = new mongoose.Schema({
  token: String,
  create_time: {
    type: String,
    default: moment(Date.now()).valueOf()
  }
});

// 用户
module.exports = connection.model('Token', tokenSchema);

