//引用mongoose模块
const mongoose = require('mongoose');
const connection = require('../connection');
// 创建对象定义集合结构类型(其实就是表结构)
const tagSchema = new mongoose.Schema({
  tag: String,
});

// 标签列表
module.exports = connection.model('Tag', tagSchema);
