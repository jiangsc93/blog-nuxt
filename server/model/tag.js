//引用mongoose模块
var mongoose = require('mongoose');
var connection = require('../connection');

// 创建对象定义集合结构类型(其实就是表结构)
var testSchema = new mongoose.Schema({
  tag: Array,
});

// 标签列表
var Tag = connection.model('Tag',testSchema);

module.exports = Tag;