//引用mongoose模块
const mongoose = require('mongoose');
const connection = require('../connection');
// 创建对象定义集合结构类型(其实就是表结构)
const configSchema = new mongoose.Schema({
  title: String,
  imgSrc: {
    type: String,
    default: 'http://www.jscwwd.com/_nuxt/img/user_logo.999f74a.png'
  }
});

// 用户
module.exports = connection.model('Config', configSchema);

