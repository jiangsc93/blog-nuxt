let util = require('../util/util');
let ExperienceModel = require('../model/experience');
let { responseClient } = util;

// 添加历程
exports.addExperience = ({ res, body }) => {
  let { title, description, start_time, end_time, _id } = body;
  if (_id) { // 为修改
    ExperienceModel.findById(_id).then(result => {
      result.title = title;
      result.description = description;
      result.start_time = start_time;
      result.end_time = end_time;
      result.save((err, data) => {
        if (err) {
          responseClient(res, 404, '添加或修改失败', err);
        } else {
          responseClient(res, 200, '成功添加历程', data);
        }
      });
    })
  } else { // 新添加
    let experienceList = new ExperienceModel({
      title,
      description,
      start_time,
      end_time
    }); 
    experienceList.save((err, data) => {
      if (err) {
        responseClient(res, 404, '失败', err);
      } else {
        responseClient(res, 200, '成功添加历程', data);
      }
    });
  }
};

// 获取历程列表
exports.getExperienceList = ({ res, body }) => {
  ExperienceModel.find().sort({start_time: -1}).then(result => {
    let responseData = {};
    responseData.list = result;
    responseClient(res, 200, 'success', responseData);
  }).catch(err => {
    responseClient(res, 404, '获取失败', err);
  })
};

// admin删除单个历程
exports.deleteExperience = ({ body, res }) => {
  ExperienceModel.findById(body._id, (err, data) => {
    if (err) {
      responseClient(res, 404, '没有查找到这个历程', err);
    } else {
      data.remove((err, result) => {
        if (err) {
          responseClient(res, 404, '删除失败', err);
        } else {
          responseClient(res, 200, '你很叼哦,删除成功了!', result);
          res.end();
        }
      });
    }
  });
};