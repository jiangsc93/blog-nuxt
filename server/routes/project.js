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
  let { title, description, start_time, end_time, imgSrc, _id } = body;
  if (_id) { // 为修改
    ProjectModel.findById(_id).then(result => {
      result.title = title;
      result.description = description;
      result.start_time = start_time;
      result.end_time = end_time;
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
    ProjectModel.findOne({
      title
    }).then(result => {
      if (!result) { 
        let projectModel = new ProjectModel({
          title,
          description,
          start_time,
          end_time,
          imgSrc
        }); 
        projectModel.save((err, data) => {
          if (err) {
            responseClient(res, 404, '失败', err);
          } else {
            responseClient(res, 200, '成功添加项目', data);
          }
        });
      } else {
        responseClient(res, 200, '该项目内容已存在');
      }
    })
  }
};
// admin删除单个项目
exports.deleteProject = ({ body, res }) => {
  let { title } = body;
  ProjectModel.findOne({
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