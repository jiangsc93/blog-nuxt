const moment = require('moment');
let util = require('../util/util');
let MessageModel = require('../model/message');
let { responseClient } = util;

// 提交留言
exports.submitMessage = ({ res, body }) => {
  let { name, phone, email, content, sourceStr} = body;
  let messageList = new MessageModel({
    name,
    phone,
    email,
    content,
    create_time: moment(Date.now()).format('YYYY-MM-DD HH:mm:ss'),
    sourceStr
  });
  messageList.save((err, data) => {
    if (err) {
      responseClient(res, 404, '失败', err);
    } else {
      data.msg = "留言成功！";
      responseClient(res, 200, '留言成功！', data);
    }
  });
};

// 获取留言列表
exports.getMessageListAdmin = ({ res, body }) => {
  MessageModel.find().sort({createTime: -1}).then(result => {
    let responseData = {};
    responseData.count = result.length;
    responseData.list = result;
    responseClient(res, 200, 'success', responseData);
  }).catch(err => {
    responseClient(res, 404, '失败', err);
  })
};