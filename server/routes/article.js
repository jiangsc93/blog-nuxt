const _ = require('lodash');
let moment = require('moment');
let util = require('../util/util');
let articleModel = require('../model/article');
let tagInterface = require('./tag');
let { responseClient } = util;

//获取文章列表
exports.getArticleList = ({ res, body }) => {
  if (body.pageIndex == null) {
    body.pageIndex = 1;
  }
  if (body.pageSize == null) {
    body.pageSize = 10;
  }

  let responseData = {
    msg: '请求成功',
    pageIndex: parseInt(body.pageIndex),
    pageSize: parseInt(body.pageSize),
    tag: body.tag
  }
  let pageIndex = parseInt(body.pageIndex) || 1;
  let pageSize = parseInt(body.pageSize) || 10;
  let skip = pageIndex - 1 < 0 ? 0 : (pageIndex - 1) * pageSize;
  let conditions = {};
  
  articleModel.count().then(count => {
    // 待返回的字段
    let fields = {
      _id: 1,
      title: 1,
      author: 1,
      type: 1,
      tag: 1,
      visit: 1,
      summary: 1,
      content: 1,
      comments: [],
      like: 1,
      wordage: 1,
      lastDate: 1,
      beginDate: 1,
    };

    let options = {
      skip: skip,
      limit: pageSize,
      sort: { beginDate: -1 },
    };
    // 如果请求类型为1 =>文章 
    if (body.type === '1' ) {
      // 则按照tag字段查询
      fields = {
        _id: 1,
        title: 1,
        tag: 1,
        visit: 1,
        summary: 1,
        comments: [],
        like: 1,
        imgSrc: 1,
        beginDate: 1,
      };
      
      if (body.tag === '全部') {
        options.limit = 1000;
        options.sort = { visit: -1};
        conditions = {title: { $exists: true }};
      } else {
        let reg = new RegExp(body.tag, "i"); // 不区分大小写
        conditions = { tag: { $regex: reg } };
      }
      // 只需查找tag标签存在就行 {tag: {$exists: true}, 以浏览量最大的靠前
      // articleModel.find(conditions, fields, options)
    } else if (body.type === '2') { // 归档
      fields = {
        title: 1,
        beginDate: 1
      };
      options.limit = 1000;
    }
    articleModel.find(conditions, fields, options)
      .then(result => {
        // 若为归档 type = 2
        if (body.type === '2') {
          const archiveList = [];
          let obj = {};
          // 按年份归档 文章数组
          _.forEach(result, (e) => {
            let year = moment(e.beginDate).year();
            if(!obj[year]){
              obj[year] = [];
              obj[year].push(e);
            } else {
              obj[year].push(e);
            }
          })
          for (const key in obj) {
            if (obj.hasOwnProperty(key)) {
              const element = obj[key];
              let item = {};
              item.year = key;
              item.list = element;
              archiveList.push(item);
            }
          }
          // 比较大小，年year数字大的靠前
          archiveList.sort((a, b) => {
            return b.year - a.year;
          });
          responseData.archive = archiveList;
          responseClient(res, 200, 'success', responseData);
        } else { // 文章列表 type = 1
          responseData.count = result.length;
          responseData.list = result; // 数据包
          responseClient(res, 200, 'success', responseData);
        }

      }).catch((err => {
        responseClient(res);
        console.log('error:', err);
      }))
  }).catch((err) => {
    responseClient(res);
    console.log('error:', err);
  })
}

// 前台获取单个文章
exports.getArticleOne = ({body, res}) => {
  if (body.id === 'introduce') {
    let reg = new RegExp('关于博主', "g"); // 不区分大小写
    let conditions = { tag: { $regex: reg } };
    articleModel.findOne(conditions).then(result => {
      // 保存浏览次数，每请求一次加一次
      result = _.cloneDeep(result);
      result.visit += 1;
      result.save();
      responseClient(res, 200, 'success', result);
    }).catch(err => {
      responseClient(res, 404, '没有找到', err);
    })
  } else {
    articleModel.findOne({ _id: body.id }).then( result => {
      // 保存浏览次数，每请求一次加一次
      result.visit += 1;
      result.save(function(err, data) {
        if (err) {
          responseClient(res, 404, '没有找到', err);
        } else {
          responseClient(res, 200, 'success', result);
        }
      })
    }).catch(err => {
      responseClient(res, 404, 'error', err);
    })
  }
};

// admin编辑新文章
exports.editNewArticleAdmin = ({res, body}) => {
  let { title, author, type, tag, summary, beginDate, content, wordage, imgSrc } = body;
  wordage = content.length;
  
  let article = new articleModel({
    title,
    author,
    type,
    tag,
    visit: 12,
    beginDate,
    lastDate: moment(Date.now()).format('YYYY-MM-DD HH:mm:ss'),
    summary,
    content,
    imgSrc,
    wordage
  });
  // 调用tag的addTag接口
  tagInterface.addTag(tag);
  article.save((err, data) => {
    if (err) {
      responseClient(res, 404, 'error', err);
    } else {
      responseClient(res, 200, 'success', data);
    }
  });
};

// admin删除单个文章
exports.deleteArticleAdmin = ({ body, res }) => {
  articleModel.findById(body.id, (err, data) => {
    if (err) {
      responseClient(res, 404, '没有查找这篇文章', err);
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

// admin修改单个文章
exports.modifyArticleAdmin = ({ res, body }) => {
  
  articleModel.findById(body.id, (err, data) => {
    data.wordage = body.content.length;
    data.content = body.content;
    data.summary = body.summary;
    data.beginDate = body.beginDate;
    data.lastDate = moment(Date.now()).format('YYYY-MM-DD HH:mm:ss');
    data.author = body.author;
    data.type = body.type;
    data.tag = body.tag;
    data.title = body.title;
    data.imgSrc = body.imgSrc;
    // 调用tag的addTag接口
    tagInterface.addTag(body.tag);
    data.save(function(err, data) {
      if (err) {
        responseClient(res, 404, '文章修改失败', err);
      } else {
        responseClient(res, 200, '文章修改成功!', data);
      }
    })
  });
};

// admin获取单个文章
exports.getArticleOneAdmin = ({ res, body}) => {
  articleModel.findById(body.id, (err, data) => {
    if (err) {
      responseClient(res, 404, '获取文章失败', err);
    } else {
      responseClient(res, 200, '你很叼哦,请求成功了!', data);
    }
  });
};

// admin获取分页文章列表
exports.getArticleListAdmin = ({ res, body }) => {
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
  articleModel.count().then(count => {
    resDatas.records = count; // 数据条数
    resDatas.total = Math.ceil(count/resDatas.pageSize); // 总页数

    if (resDatas.pageIndex > resDatas.total) resDatas.pageIndex = resDatas.total;
    var limit = resDatas.pageSize;
    var skip = (resDatas.pageIndex - 1) * resDatas.pageSize;

    articleModel.find().sort({_id: -1}).limit(limit).skip(skip)
      .then((data) => {
        resDatas.list = data; // 数据包
        responseClient(res, 200, 'success', resDatas);
      })
  });
};
