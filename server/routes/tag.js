const _ = require('lodash');
let util = require('../util/util');
let ArticleModel = require('../model/article');
let TagModel = require('../model/tag');
let { responseClient } = util;

//获取全部标签
exports.getTagList = ({ res }) => {
  TagModel.find().then(result => {
    let responseData = {};
    responseData.count = result.length;
    responseData.list = result;
    responseClient(res, 200, 'success', responseData);
  }).catch( err => {
    responseClient(res, 404, '获取标签失败', err);
  })
};

// 添加标签
exports.addTag = (params) => {
  
  tagList = params.toLowerCase().split(',');
  // 先获取tag列表
  let conditions = {tag: { $exists: true }};
  let fields = {
    tag: 1,
  }
  TagModel.find(conditions, fields).then(result => {
    // 首先获取数据库中的tag列表，先组装成数组
    let arr = [];
    for (let i = 0; i < result.length; i++) {
      if (result[i]._doc && result[i]._doc.tag) arr.push(result[i]._doc.tag)
    }
    // 遍历我们要添加的tag数组
    _.forEach(tagList, item => {
      // 用数组库的tag列表arr  检测 要添加的tag(即tagList的每一项)  没有检测到，则保存到库
      if (arr.indexOf(item) === -1) {
        let Tag = new TagModel({
          tag: item,
        });
        Tag.save();
      } 
    })
  })
  tagList.indexOf()
};