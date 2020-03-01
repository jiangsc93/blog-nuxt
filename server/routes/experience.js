const moment = require('moment');
let util = require('../util/util');
let ExperienceModel = require('../model/experience');
let { responseClient } = util;

// 添加历程
exports.addExperience = ({ res, body }) => {
  let { title, description, start_time, end_time } = body;
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
};

// 获取历程列表
exports.getExperienceList = ({ res, body }) => {
  ExperienceModel.find().then(result => {
    let responseData = {};
    responseData.list = result;
    console.log(responseData, '111111111223343');
    responseClient(res, 200, 'success', responseData);
  }).catch(err => {
    responseClient(res, 404, '获取失败', err);
  })
};