const _ = require('lodash');
const moment = require('moment');
let util = require('../util/util');
let CustomerModel = require('../model/customer_model');
let { responseClient, md5, MD5_SALT } = util;

// 登录
exports.login = ({ res, body }) => {
  let { password, email } = body;
  CustomerModel.findOne(
    {
      email,
      password: md5(password + MD5_SALT),
    }
  ).then(customerInfo => {
    if (customerInfo) { // 用户存在
      let responseData = {
        customerInfo
      };
      responseClient(res, 200, 'success', responseData);
    } else {
      responseClient(res, 200, '账号或密码错误！');
    }
  }).catch(err => {
    responseClient(res, 400, 'error', err);
  })
};



// 注册
exports.register = ({ res, body }) => {

  let { userName, email, password, avatorSrc, introduction, create_time } = body;
  // 后台需再次对注册信息进行验证
  const reg = new RegExp(
    '^[a-z0-9]+([._\\-]*[a-z0-9])*@([a-z0-9]+[-a-z0-9]*[a-z0-9]+.){1,63}[a-z0-9]+$',
  );
  if (!reg.test(email)) {
    responseClient(res, 400, '邮箱格式错误，无法通过！');
    return;
  }
  if (!userName) {
    responseClient(res, 400, '用户名不可为空');
    return;
  }
  if (!password) {
    responseClient(res, 400, '密码不可为空');
    return;
  }
  console.log('jinlail');
  CustomerModel.findOne(
    {
      email: email
    }
  ).then(customerInfo => {
    if (customerInfo) { // 用户存在
      responseClient(res, 200, '用户邮箱已存在');
    } else {
      let customerModel = new CustomerModel({
        userName: userName,
        email: email,
        password: md5(password + MD5_SALT),
        avatorSrc: avatorSrc,
        introduction: introduction,
        create_time: create_time || moment(Date.now()).format('YYYY-MM-DD HH:mm:ss')
      })
      console.log('准备保存');
      customerModel.save().then(data => {
        responseClient(res, 200, '注册成功', data);
      }).catch(err => {
        responseClient(res, 400, 'error', err);
      });
    }
  }).catch(err => {
    responseClient(res, 400, 'error', err);
  })
};
