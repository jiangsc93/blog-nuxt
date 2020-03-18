const _ = require('lodash');
const moment = require('moment');
let util = require('../util/util');
let UserModel = require('../model/user_model');
let CustomerModel = require('../model/customer_model');
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
        create_time: create_time || moment(Date.now()).format('YYYY-MM-DD HH:mm:ss'),
        update_time: moment(Date.now()).format('YYYY-MM-DD HH:mm:ss')
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

// 获取用户信息
exports.getUserInfo = ({ res, body }) => {
  let { email } = body;
  UserModel.findOne(
    {
      email,
    },
    {
      _id: 1,
      email: 1,
      introduce: 1,
      avatar: 1,
      userName: 1,
    }
  ).then(userInfo => {
    if (userInfo) { // 用户存在
      responseClient(res, 200, 'success', userInfo);
    } else {
      responseClient(res, 200, '此用户不存在');
    }
  }).catch(err => {
    responseClient(res, 400, 'error', err);
  })
};


// 修改用户信息
exports.modifyUserInfo = ({ res, body }) => {
  let { _id, email, userName, newPwd, introduce, avatar } = body;
  UserModel.findOne(
    { _id }
  ).then(userInfo => {
    if (userInfo) { // 用户存在
      UserModel.update(
        { _id },
        {
          userName,
          email,
          introduce,
          avatar,
          update_time: moment(Date.now()).format('YYYY-MM-DD HH:mm:ss')
        }).then(result => {
          if (newPwd) { // 如果要修改密码
            UserModel.update(
              { _id },
              {
                userName,
                email,
                password: md5(newPwd + MD5_SALT),
                introduce,
                avatar,
                update_time: moment(Date.now()).format('YYYY-MM-DD HH:mm:ss')
              }).then(response => {
                CustomerModel.findOne(
                  {
                    email: email
                  }
                ).then(customerInfo => {
                  // 如果游客用户存在
                  if (customerInfo) { // 用户存在  就更新游客数据
                    CustomerModel.update(
                      { email },
                      {
                        introduce,
                        avatar,
                        update_time: moment(Date.now()).format('YYYY-MM-DD HH:mm:ss')
                      }).then(customerRes => {
                        let responseData = {
                          customerInfo: customerRes,
                          managerInfo: result
                        }
                        responseClient(res, 200, '资料修改成功', responseData);
                      })
                  } else { // 否则就重新创建游客数据
                    let customerModel = new CustomerModel({
                      userName: userName,
                      email: email,
                      avatorSrc: avatar,
                      password: userInfo.password,
                      introduction: introduce,
                      update_time: moment(Date.now()).format('YYYY-MM-DD HH:mm:ss')
                    })
                    customerModel.save().then(data => {
                    let responseData = {
                      customerInfo: data,
                      managerInfo: result
                    }
                      responseClient(res, 200, '资料修改成功', responseData);
                    }).catch(err => {
                      responseClient(res, 400, '游客资料修改失败', err);
                    });
                  }
                })
              })
          } else {
            CustomerModel.findOne(
              {
                email: email
              }
            ).then(customerInfo => {
              console.log(customerInfo, 'customerInfocustomerInfo');
              // 如果游客用户存在
              if (customerInfo) { // 用户存在  就更新游客数据
                CustomerModel.update(
                  { email },
                  {
                    introduce,
                    avatar,
                    update_time: moment(Date.now()).format('YYYY-MM-DD HH:mm:ss')
                  }).then(customerRes => {
                    let responseData = {
                      customerInfo: customerRes,
                      managerInfo: result
                    }
                    responseClient(res, 200, '资料修改成功', responseData);
                  })
              } else { // 否则就重新创建游客数据
                let customerModel = new CustomerModel({
                  userName: userName,
                  email: email,
                  avatorSrc: avatar,
                  password: userInfo.password,
                  introduction: introduce,
                  update_time: moment(Date.now()).format('YYYY-MM-DD HH:mm:ss')
                })
                customerModel.save().then(data => {
                let responseData = {
                  customerInfo: data,
                  managerInfo: result
                }
                  responseClient(res, 200, '资料修改成功', responseData);
                }).catch(err => {
                  responseClient(res, 400, '游客资料修改失败', err);
                });
              }
            })
          }
        }).catch( err => {
          console.error(err);
          responseClient(res, 400, '用户资料修改失败');
        })
      
    } else {
      responseClient(res, 200, '此用户不存在');
    }
  }).catch(err => {
    responseClient(res, 400, 'error', err);
  })
};

// admin获取分页管理员列表
exports.getManagerList = ({ res, body }) => {
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
  UserModel.count().then(count => {
    resDatas.records = count; // 数据条数
    resDatas.total = Math.ceil(count/resDatas.pageSize); // 总页数

    if (resDatas.pageIndex > resDatas.total) resDatas.pageIndex = resDatas.total;
    var limit = resDatas.pageSize;
    var skip = (resDatas.pageIndex - 1) * resDatas.pageSize;

    UserModel.find().sort({_id: -1}).limit(limit).skip(skip)
      .then((data) => {
        resDatas.list = data; // 数据包
        responseClient(res, 200, 'success', resDatas);
      }).catch(err => {
        responseClient(res, 400, '获取失败', err);
      })
  });
};

// admin删除单个管理员
exports.deleteManager = ({ body, res }) => {
  UserModel.findById(body.id, (err, data) => {
    if (err) {
      responseClient(res, 404, '没有找到这个管理员', err);
    } else {
      data.remove((err, result) => {
        if (err) {
          responseClient(res, 404, '删除失败', err);
        } else {
          responseClient(res, 200, '你很叼哦,删除成功了!', result);
          // 调用tag的deleteTag接口
          // tagInterface.deleteTag(result.tag);
        }
      });
    }
  });
};