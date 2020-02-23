//引用mongoose模块
var mongoose = require('mongoose');
var moment = require('moment');
var connection = require('./connection');

// 创建对象定义集合结构类型(其实就是表结构)
var testSchema = new mongoose.Schema({
  userName:String,
  password:String,
  date: {
    type: String,
    default: moment(Date.now()).format('YYYY-MM-DD HH:mm:ss')
  }
});

// 用户
var UserModel = connection.model('User',testSchema);

module.exports = UserModel;
