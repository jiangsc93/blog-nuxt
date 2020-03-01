//引用mongoose模块
const mongoose = require('mongoose');
const moment = require('moment');
const connection = require('./connection');

// 创建对象定义集合结构类型(其实就是表结构)
const userSchema = new mongoose.Schema({
  userName: String,
  password: String,
  date: {
    type: String,
    default: moment(Date.now()).format('YYYY-MM-DD HH:mm:ss')
  }
});

// 用户
module.exports = connection.model('User', userSchema);
