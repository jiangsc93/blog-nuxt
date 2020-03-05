//引用mongoose模块
const mongoose = require('mongoose');
const moment = require('moment');
const connection = require('../connection');
// 创建对象定义集合结构类型(其实就是表结构)
const projectSchema = new mongoose.Schema({
  title: String,
  description: String,
  imgSrc: String,
  start_time: {
    type: String,
    default: moment(Date.now()).format('YYYY-MM-DD HH:mm:ss')
  },
  end_time: {
    type: String,
    default: moment(Date.now()).format('YYYY-MM-DD HH:mm:ss')
  }
});

// 标签列表
module.exports = connection.model('Project', projectSchema);

