let util = require('../util/util');
let ProjectModel = require('../model/project');
let { responseClient } = util;

//获取项目列表
exports.getProjectList = ({ res }) => {
  ProjectModel.count().then(count => {
    let responseData = {};
    responseData.count = count;
    ProjectModel.find().then(result => {
      responseData.list = result;
      responseClient(res, 200, 'success', responseData);
    })
  }).catch(err => {
    responseClient(res, 404, 'err', err);
  }).catch(err => {
    responseClient(res, 404, 'err', err);
  })
};
//添加项目
exports.addProject = ({ body, res }) => {
  let { title, description, start_time, end_time } = body;
  ProjectModel.findOne({
    title
  }).then(result => {
    if (!result) {
      let projectModel = new ProjectModel({
        title,
        description,
        start_time,
        end_time
      });
      projectModel.save((err, data) => {
        if (err) {
          responseClient(res, 404, 'error', err);
          // res.send(err);
        } else {
          responseClient(res, 200, '添加项目成功', data);
          // res.send(data);
        }
      });
    } else {
      responseClient(res, 200, '该项目内容已存在');
    }
  })
};