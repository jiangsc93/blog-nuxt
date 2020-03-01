//引用mongoose模块
const mongoose = require('mongoose');
const moment = require('moment');
const connection = require('../connection');

// 创建对象定义集合结构类型(其实就是表结构)
const listSchema = new mongoose.Schema({
  title: { type: String, required: true, validate: /\S+/ },
  author: { type: String, required: true, validate: /\S+/ },
  type: String,
  tag: String,
  visit: { type: Number, required: true, default: 0 },
  beginDate: {
    type: String,
    default: moment(Date.now()).format('YYYY-MM-DD HH:mm:ss')
  },
  lastDate: {
    type: String,
    default: moment(Date.now()).format('YYYY-MM-DD HH:mm:ss')
  },
  summary: { type: String, required: true, validate: /\S+/ },
  content: { type: String, required: true, validate: /\S+/ },
  wordage: { type: String, default: 0 }
});

// 列表
module.exports = connection.model('Article', listSchema);

