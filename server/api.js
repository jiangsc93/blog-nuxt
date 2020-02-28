var express = require('express');
var router = express.Router();
var moment = require('moment');
var request = require('request');
const _ = require('lodash');
// 引入模型
var listModel = require('./list_model');
var userModel = require('./user_model');
var messageModel = require('./model/message');
var { responseClient } = require('./util/util');

// 极验api
var session = require('express-session');
router.use(session({
  secret: 'my-secret',
  resave: false,
  saveUninitialized: true
}));

var slide = require('./slide');

// CORS解决跨域问题
router.all('*', (req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*"); // 最核心的
  res.header("Access-Control-Allow-Headers", "X-Requested-With");
  res.header("Access-Control-Allow-Methods","PUT,POST,GET,DELETE,OPTIONS");
  res.header("X-Powered-By",' 3.2.1')
  res.header("Content-Type", "application/json;charset=utf-8");
  next();
});
// 前台：按类型-分页读取文章列表
router.post('/api/articlelist', (req, res, next) => {

  var reqBody = req.body;
  if (reqBody.pageIndex == null) {
    reqBody.pageIndex = 1;
  }
  if (reqBody.pageSize == null) {
    reqBody.pageSize = 10;
  }

  var responseData = {
    msg: '请求成功',
    pageIndex: parseInt(reqBody.pageIndex),
    pageSize: parseInt(reqBody.pageSize),
    tag: reqBody.tag
  }
  let pageIndex = parseInt(reqBody.pageIndex) || 1;
  let pageSize = parseInt(reqBody.pageSize) || 10;
  let skip = pageIndex - 1 < 0 ? 0 : (pageIndex - 1) * pageSize;
  let conditions = {};
  
  // responseClient(res, 200, 0, 'success', responseData);
  listModel.count().then(count => {
    console.log(count, 'out');
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
      wordage: 1,
      lastDate: 1,
      beginDate: 1,
    };
    if(reqBody.type === '2'){
      fields = {
        title: 1,
        beginDate: 1,
      };
    }
    let options = {
      skip: skip,
      limit: pageSize,
      sort: { beginDate: -1 },
    };
    // Article.find(conditions, fields, options, (error, result) => {
    // 如果请求类型为1 =>文章 
    if (reqBody.type === '1' ) {
      // 则按照tag字段查询
      fields = {
        _id: 1,
        title: 1,
        tag: 1,
        visit: 1,
        summary: 1,
        beginDate: 1
      };
      if (reqBody.tag === '全部') {
        options.limit = 1000;
        conditions = {title: { $exists: true }};
      } else {
        let reg = new RegExp(reqBody.tag, "i"); // 不区分大小写
        conditions = { tag: { $regex: reg } };
      }
      // 只需查找tag标签存在就行 {tag: {$exists: true}, 以浏览量最大的靠前
      // listModel.find(conditions, fields, options)
    } else if (reqBody.type === '2') {
      fields = {
        title: 1,
        beginDate: 1
      };
      options.limit = 1000;
    }
    listModel.find(conditions, fields, options)
    // listModel.find({tag: {$exists: true}}).sort({visit: -1}).limit(20)
      .then((result) => {
        // console.log(result, 'result');
        responseData.count = result.length;
        responseData.list = result; // 数据包
        if (reqBody.type === '2') {
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
        }
        responseClient(res, 200, 0, 'success', responseData);
      }).catch((err => {
        responseClient(res);
        console.log('error:', err);
      }))
  }).catch((err) => {
    responseClient(res);
    console.log('error:', err);
  })
  // // 方法一, 此方法查询参数条件下的数据并返回 
  // listModel.count().then(count => {
  //   // resDatas.records = count; // 数据条数
  //   // resDatas.total = Math.ceil(count/resDatas.pageSize); // 总页数

  //   // if (resDatas.pageIndex > resDatas.total) resDatas.pageIndex = resDatas.total;
  //   // var limit = resDatas.pageSize;
  //   // var skip = (resDatas.pageIndex - 1) * resDatas.pageSize;
  //   // var findObj = reqBody.tag === '' ? {} : {tag: `${reqBody.tag}`}
  //   if (reqBody.tag === '全部') {
  //     // 只需查找tag标签存在就行 {tag: {$exists: true}, 以浏览量最大的靠前
  //     listModel.find({tag: {$exists: true}}).sort({visit: -1}).limit(20)
  //       .then((data) => {
  //         responseData.rows = data; // 数据包
  //         res.send(responseData);
  //       })
  //   } else if (reqBody.tag === '归档') {

  //   } else {
  //     let reg = new RegExp(reqBody.tag, "g");
  //     listModel.find({tag: reg}).sort({_id: -1})
  //       .then((data) => {
  //         responseData.rows = data; // 数据包
  //         res.send(responseData);
  //       })
  //   }
  // });

});

// 前台：读取单个文章详情
router.get('/api/articleone/:id', (req, res, next) => {
  listModel.findById(req.params.id, (err, data) => {
    // 保存浏览次数，每请求一次加一次
    data.visit += 1;
    data.save(function(err, data) {
      if (err) {
        res.send(err);
      } else {
        res.send(data);
      }
    })
  });
});
// 获取标签列表
router.get('/api/getTagList/', (req, res, next) => {
  // 只查找含tag字段的数据,结果为tag内容的数组
  listModel.distinct('tag', (error, result) => {
    // 先把标签全部打乱成一个一个，然后单个单个装进数组
    let tags = result.join(',').split(',');
    let tagList = tags.map((item)=>{
        if (item) {
          return item.toLowerCase();
        }
      }
    )
    // Set用法
    let noRepetTagList = [...new Set(tagList)];
    if (error) {
      console.error('Error:' + error);
      // throw error;
    } else {
      let responseData = {};
      responseData.count = noRepetTagList.length;
      responseData.list = noRepetTagList;
      responseClient(res, 200, 0, 'success', responseData);
    }
  });
});

// 后台：分页读取文章列表
router.post('/api/newslist', (req, res, next) => {
  var reqBody = req.body;
  if (reqBody.pageIndex == null) {
    reqBody.pageIndex = 1;
  }
  if (reqBody.pageSize == null) {
    reqBody.pageSize = 5;
  }

  var resDatas = {
    msg: '请求成功',
    pageIndex: parseInt(reqBody.pageIndex),
    pageSize: parseInt(reqBody.pageSize)
  }


  // 方法一, 此方法查询参数条件下的数据并返回
  listModel.count().then(count => {
    resDatas.records = count; // 数据条数
    resDatas.total = Math.ceil(count/resDatas.pageSize); // 总页数

    if (resDatas.pageIndex > resDatas.total) resDatas.pageIndex = resDatas.total;
    var limit = resDatas.pageSize;
    var skip = (resDatas.pageIndex - 1) * resDatas.pageSize;

    listModel.find().sort({_id: -1}).limit(limit).skip(skip)
    // listModel.find().sort({_id: -1}).limit(limit)
      .then((data) => {
        resDatas.rows = data; // 数据包
        res.send(resDatas);
      })
  });

});

// 提交留言
router.post('/api/submitMessage', (req, res, next) => {
   
  let messageList = new messageModel({
    name: req.body.name,
    phone: req.body.phone,
    email: req.body.email,
    content: req.body.content,
    createTime: moment(Date.now()).format('YYYY-MM-DD HH:mm:ss'),
    sourceStr: req.body.sourceStr
  });
  messageList.save((err, data) => {
    if (err) {
        res.send(err);
    } else {
      // res.send(data);
      let responseData = {};
      responseData.msg = "留言成功！";
      responseClient(res, 200, 0, 'success', responseData);
    }
  });

});

// 后台：读取单个文章详情
router.get('/api/newsone/:id', (req, res, next) => {
  listModel.findById(req.params.id, (err, data) => {
        if (err) {
            res.send(err);
        } else {
            res.send(data);
        }
    });
});

// 新建写入文章
router.post('/api/newsedit', (req, res, next) => {
   
    let editList = new listModel({
      title: req.body.title,
      author: req.body.author,
      type: req.body.type,
      tag: req.body.tag,
      visit: req.body.visit || 0,
      beginDate: moment(Date.now()).format('YYYY-MM-DD HH:mm:ss'),
      lastDate: moment(Date.now()).format('YYYY-MM-DD HH:mm:ss'),
      summary: req.body.summary,
      content: req.body.content,
      wordage: req.body.wordage
    });
    editList.save((err, data) => {

      if (err) {
          res.send(err);
      } else {
          res.send(data);
      }
    });

});

// 删除文章
router.get('/api/newsdelet/:id',(req, res, next) => {

    listModel.findById(req.params.id, (err, data) => {
        data.remove((err, data) => {
            res.send({
                msg: '你很叼哦,请求成功了!'
            });
            res.end();
        });
    });

});

// 编辑修改文章
router.post("/api/newsedit/:id", (req, res, next) => {

    listModel.findById(req.params.id, (err, data) => {
      // if (req.body.visit) {
      //   data.visit = req.body.visit || 0;
      // } else {
        data.wordage = req.body.wordage;
        data.content = req.body.content;
        data.summary = req.body.summary;
        data.lastDate = moment(Date.now()).format('YYYY-MM-DD HH:mm:ss');
        data.author = req.body.author;
        data.type = req.body.type;
        data.tag = req.body.tag;
        data.title = req.body.title;
      // }
      data.save(function(err, data) {
        if (err) {
          res.send(err);
        } else {
          res.send(data);
        }
      })
    });
        
});

// 增加浏览量
router.post("/api/addvisit/:id", (req, res, next) => {

    listModel.findById(req.params.id, (err, data) => {
        data.visit = req.body.visit || 0;
        
        data.save(function(err, data) {
          if (err) {
            res.send(err);
          } else {
            res.send(data);
          }
        })
    });
        
});


// 登录操作
router.post('/api/login', function (req, res) {
  if (req.body.userName !== '' && req.body.passWord === '123456') {
    let addUser = new userModel({
      userName: req.body.userName,
      password: req.body.passWord,
      date: req.body.date ? req.body.date : moment(Date.now()).format('YYYY-MM-DD HH:mm:ss')
    });
    addUser.save((err, data) => {

      if (err) {
        console.log(err, 'err');
      } else {
        console.log(data, '登录成功！');
      }
    });
    return res.json({ userName: req.body.userName })
  }
  res.status(401).json({ error: '账号或密码不正确!' })
})


// 极验接口
router.get("/api/gt/register-slide", function (req, res) {

  // 向极验申请每次验证所需的challenge
  slide.register(null, function (err, data) {

    if (err) {
      res.status(500);
      res.send(err);
      return;
    }

    if (!data.success) {
      // 进入 failback，如果一直进入此模式，请检查服务器到极验服务器是否可访问
      // 可以通过修改 hosts 把极验服务器 api.geetest.com 指到不可访问的地址

      // 为以防万一，你可以选择以下两种方式之一：

      // 1. 继续使用极验提供的failback备用方案
      req.session.fallback = true;
      res.send(data);

      // 2. 使用自己提供的备用方案
      // todo

    } else {
      // 正常模式
      req.session.fallback = false;
      res.send(data);
    }
  });
});

router.post("/api/gt/validate-slide", function (req, res) {

  // 对ajax提供的验证凭证进行二次验证
  slide.validate(req.session.fallback, {
    geetest_challenge: req.body.geetest_challenge,
    geetest_validate: req.body.geetest_validate,
    geetest_seccode: req.body.geetest_seccode
  }, function (err, success) {

    if (err) {
      // 网络错误
      res.send({
        status: "error",
        info: err
      });

    } else if (!success) {

      // 二次验证失败
      res.send({
        status: "fail",
        info: '登录失败'
      });
    } else {

      res.send({
        status: "success",
        info: '登录成功'
      });
    }
  });
});


module.exports = router;
