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
        customerInfo: customerInfo
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
      customerModel.save().then(data => {
      let responseData = {
        customerInfo: data
      }
        responseClient(res, 200, '注册成功', responseData);
      }).catch(err => {
        responseClient(res, 400, 'error', err);
      });
    }
  }).catch(err => {
    responseClient(res, 400, 'error', err);
  })
};

// admin获取分页游客列表
exports.getCustomerList = ({ res, body }) => {
  if (body.pageIndex == null) {
    body.pageIndex = 1;
  }
  if (body.pageSize == null) {
    body.pageSize = 5;
  }

  var resDatas = {
    msg: '请求成功',
    pageIndex: parseInt(body.pageIndex),
    pageSize: parseInt(body.pageSize)
  }

  // 方法一, 此方法查询参数条件下的数据并返回
  CustomerModel.count().then(count => {
    resDatas.records = count; // 数据条数
    resDatas.total = Math.ceil(count/resDatas.pageSize); // 总页数

    if (resDatas.pageIndex > resDatas.total) resDatas.pageIndex = resDatas.total;
    var limit = resDatas.pageSize;
    var skip = (resDatas.pageIndex - 1) * resDatas.pageSize;

    CustomerModel.find().sort({_id: -1}).limit(limit).skip(skip)
      .then((data) => {
        resDatas.list = data; // 数据包
        responseClient(res, 200, 'success', resDatas);
      }).catch(err => {
        responseClient(res, 400, '获取失败', err);
      })
  });
};

// admin删除单个游客
exports.deleteCustomer = ({ body, res }) => {
  CustomerModel.findById(body.id, (err, data) => {
    if (err) {
      responseClient(res, 404, '没有找到这个游客', err);
    } else {
      data.remove((err, result) => {
        if (err) {
          responseClient(res, 404, '删除失败', err);
        } else {
          responseClient(res, 200, '你很叼哦,删除成功了!', result);
        }
      });
    }
  });
};