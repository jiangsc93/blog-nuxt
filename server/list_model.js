//引用mongoose模块
var mongoose = require('mongoose');
var moment = require('moment');
var connection = require('./connection');

// 创建对象定义集合结构类型(其实就是表结构)
var testSchema = new mongoose.Schema({
  title: String,
  author: String,
  type: String,
  tag: String,
  visit: Number,
  beginDate: {
    type: String,
    default: moment(Date.now()).format('YYYY-MM-DD HH:mm:ss')
  },
  lastDate: {
    type: String,
    default: moment(Date.now()).format('YYYY-MM-DD HH:mm:ss')
  },
  summary: String,
  content: String,
  wordage: String,
});

// 列表
var ListModel = connection.model('List',testSchema);

module.exports = ListModel;
