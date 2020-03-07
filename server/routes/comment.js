const _ = require('lodash');
let moment = require('moment');
let util = require('../util/util');
let ArticleModel = require('../model/article');
let { responseClient } = util;


// 添加一级评论
exports.commentOne = ({res, body}) => {
  let { type, id, userName, owner, avatar, content, floor, index } = body;
  let saveData = {
    userName, owner, avatar, content, floor,
    create_time: moment(Date.now()).format('YYYY-MM-DD HH:mm:ss')
  }
  if (!userName || !owner || !avatar || !content) {
    responseClient(res, 400, '插入参数错误');
  }

  if (type === '1') { // 一级评论
    saveData.like = 0;
    ArticleModel.findById(id, (err, data) => {
      data.comments.push(saveData);
      data.save().then(() => {
        responseClient(res, 200, 'success', data);
      })
    })
    
  } else { // 二级或三级评论
    ArticleModel.findById(id, (err, data) => {
      _.cloneDeep(data);
      
      if (data.comments[index].floor = floor) {
        if (!data.comments[index].children) { // 如果没有二级评论列表 则初始化为数组
          data.comments[index].children = [];
        }
        data.comments[index].children.push(saveData);
      }
      ArticleModel.update(
          {_id: id},
          {comments: data.comments}
        ).then(result => {
          responseClient(res, 200, 'success', result);
        }).catch(err => {
          responseClient(res, 200, 'error', err);
        })
    }).catch(err => {
      responseClient(res, 200, 'error', err);
    })
  }
};

// 对一级评论点赞
exports.commentLike = ({res, body}) => {
  let { id, index } = body;
  ArticleModel.findById(id, (err, data) => {
    if (err) {
      responseClient(res, 200, 'error', err);
      return;
    }
    _.cloneDeep(data);
    data.comments[index].like = Number(data.comments[index].like);
    data.comments[index].like += 1;
    ArticleModel.update(
        {_id: id},
        {comments: data.comments}
      ).then(result => {
        responseClient(res, 200, 'success', result);
      }).catch(err => {
        responseClient(res, 200, 'error', err);
      })
  }).catch(err => {
    responseClient(res, 200, 'error', err);
  })
}



