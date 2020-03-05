const _ = require('lodash');
const moment = require('moment');
let util = require('../util/util');
let UserModel = require('../model/user_model');
let TokenModel = require('../model/token_model');
let { responseClient, md5, MD5_SALT } = util;

// 登录
exports.login = ({ res, body }) => {
  let { password, email } = body;
  UserModel.findOne(
    {
      email,
      password: md5(password + MD5_SALT),
    }
  ).then(userInfo => {
    if (userInfo) { // 用户存在
      let tokenString = '1234567890www.jscwwd.com';
      let token = md5(tokenString + MD5_SALT + '18810926125');
      let tokenModel = new TokenModel({
        token
      })
      tokenModel.save();
      let responseData = {
        token: token,
        userInfo: userInfo
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

  let { userName, email, password, create_time } = body;
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
  UserModel.findOne(
    {
      email: email
    }
  ).then(userInfo => {
    if (userInfo) { // 用户存在
      responseClient(res, 200, '用户邮箱已存在');
    } else {
      let userModel = new UserModel({
        userName: userName,
        email: email,
        password: md5(password + MD5_SALT),
        create_time: create_time || moment(Date.now()).format('YYYY-MM-DD HH:mm:ss')
      })
      userModel.save().then(data => {
        responseClient(res, 200, '注册成功', data);
      }).catch(err => {
        responseClient(res, 400, 'error', err);
      });
    }
  }).catch(err => {
    responseClient(res, 400, 'error', err);
  })
};

// 验证token是否正确and是否过期
exports.vertifyToken = (params) => {
  TokenModel.find().then(result => {
    let { token, create_time } = result;
    if (params === token) {
      let current_time = moment(Date.now()).valueOf();4
      if (current_time - create_time >= 2 * 60 * 60 ) {
        responseClient(res, 400, 'token已过期');
      } else {
        next();
      }
    } else {
      responseClient(res, 400, 'token不一致');
      return;
    }
  })

};