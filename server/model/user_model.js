//引用mongoose模块
const mongoose = require('mongoose');
const moment = require('moment');
const crypto = require('crypto');
const { argv } = require('yargs');
const connection = require('../connection');
// 创建对象定义集合结构类型(其实就是表结构)
const userSchema = new mongoose.Schema({
  userName: String,
  email: String,
  password: {
    type: String,
    required: true,
    default: crypto
      .createHash('md5')
      .update(argv.auth_default_password || 'root')
      .digest('hex'),
  },
  avatar: String,
  introduce: String,
  create_time: {
    type: String,
    default: moment(Date.now()).format('YYYY-MM-DD HH:mm:ss')
  },
  update_time: {
    type: String,
    default: moment(Date.now()).format('YYYY-MM-DD HH:mm:ss')
  }
});

// 用户
module.exports = connection.model('User', userSchema);

