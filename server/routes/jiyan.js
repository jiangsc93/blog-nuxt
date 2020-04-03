let util = require('../util/util');
let { responseClient } = util;
let slide = require('../slide');

// 急眼注册
exports.register = ({ res, req }) => {
  // 向极验申请每次验证所需的challenge
  slide.register(null, function (err, data) {

    if (err) {
      responseClient(res, 500, 'error', err);
      return;
    }

    if (!data.success) {
      // 进入 failback，如果一直进入此模式，请检查服务器到极验服务器是否可访问
      // 可以通过修改 hosts 把极验服务器 api.geetest.com 指到不可访问的地址

      // 为以防万一，你可以选择以下两种方式之一：

      // 1. 继续使用极验提供的failback备用方案
      // session.fallback = true;
      responseClient(res, 200, 'success', data);
      // 2. 使用自己提供的备用方案
      // todo

    } else {
      // 正常模式
      // session.fallback = false;
      responseClient(res, 200, 'success', data);
    }
  });
};


// 急眼验证
exports.validate = ({ body, res }) => {
  // 对ajax提供的验证凭证进行二次验证
  slide.validate(true, {
    geetest_challenge: body.geetest_challenge,
    geetest_validate: body.geetest_validate,
    geetest_seccode: body.geetest_seccode
  }, function (err, success) {
    if (err) {
      // 网络错误
      responseClient(res, 400, 'error', err);
    } else if (!success) {
      // 二次验证失败
      responseClient(res, 200, 'success', { status: 'success' });
    } else {
      responseClient(res, 200, 'success', { status: 'success' });
    }
  });
};