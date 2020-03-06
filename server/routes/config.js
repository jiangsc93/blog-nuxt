let util = require('../util/util');
let ConfigModel = require('../model/config_model');
let { responseClient } = util;

//获取配置列表
exports.getConfigList = ({ res }) => {
  ConfigModel.count().then(count => {
    let responseData = {};
    responseData.count = count;
    ConfigModel.find().then(result => {
      responseData.list = result;
      responseClient(res, 200, 'success', responseData);
    })
  }).catch(err => {
    responseClient(res, 404, 'err', err);
  }).catch(err => {
    responseClient(res, 404, 'err', err);
  })
};

//添加配置
exports.addConfig = ({ body, res }) => {
  let { title, imgSrc, _id } = body;
  if (_id) { // 为修改
    ConfigModel.findById(_id).then(result => {
      result.title = title;
      result.imgSrc = imgSrc;
      result.save((err, data) => {
        if (err) {
          responseClient(res, 404, '添加或修改失败', err);
        } else {
          responseClient(res, 200, '成功添加项目', data);
        }
      });
    })
  } else { // 新添加
    ConfigModel.findOne({
      title
    }).then(result => {
      if (!result) { 
        let configModel = new ConfigModel({
          title,
          imgSrc
        }); 
        configModel.save((err, data) => {
          if (err) {
            responseClient(res, 404, '失败', err);
          } else {
            responseClient(res, 200, '成功添加配置', data);
          }
        });
      } else {
        responseClient(res, 200, '该配置内容已存在');
      }
    })
  }
};
// admin删除单个配置
exports.deleteConfig = ({ body, res }) => {
  let { title } = body;
  ConfigModel.findOne({
    title
  }).then(data => {
    if (data) {
      data.remove((err, result) => {
        if (err) {
          responseClient(res, 404, '删除失败', err);
        } else {
          responseClient(res, 200, '你很叼哦,删除成功了!', result);
          res.end();
        }
      });
    } else {
      responseClient(res, 404, '没有找到', err);
    }
  })
};