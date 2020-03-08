var express = require('express');
var router = express.Router();
const _ = require('lodash');
// 引入模型
var project = require('./routes/project');
var article = require('./routes/article');
var message = require('./routes/message');
var tag = require('./routes/tag');
var experience = require('./routes/experience');
var user = require('./routes/user');
var customer = require('./routes/customer');
var comment = require('./routes/comment');
var config = require('./routes/config');

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
router.post('/api/getArticleList/', article.getArticleList);
// 前台：读取单个文章详情
router.post('/api/getArticleOne/', article.getArticleOne);
// admin 删除文章
router.post('/api/deleteArticleAdmin/', article.deleteArticleAdmin);
// admin 编辑新文章
router.post('/api/editNewArticleAdmin/', article.editNewArticleAdmin);
// admin 修改原文章
router.post('/api/modifyArticleAdmin/', article.modifyArticleAdmin);
// admin 分页获取文章列表
router.post('/api/getArticleListAdmin/', article.getArticleListAdmin);
// admin 获取单个文章
router.post('/api/getArticleOneAdmin/', article.getArticleOneAdmin);

// 获取项目列表
router.get('/api/getProjectList/', project.getProjectList);
// 添加项目
router.post('/api/addProject/', project.addProject);
// 删除项目
router.post('/api/deleteProject/', project.deleteProject);

// 获取标签列表
router.get('/api/getTagList/', tag.getTagList);


// 提交留言
router.post('/api/submitMessage', message.submitMessage);
// 获取留言列表
router.get('/api/getMessageListAdmin', message.getMessageListAdmin);

// 添加历程
router.post('/api/addExperience', experience.addExperience);
// 删除历程
router.post('/api/deleteExperience', experience.deleteExperience);
// 获取历程列表
router.get('/api/getExperienceList', experience.getExperienceList);

// 添加配置
router.post('/api/addConfig', config.addConfig);
// 删除配置
router.post('/api/deleteConfig', config.deleteConfig);
// 获取配置列表
router.get('/api/getConfigList', config.getConfigList);


// 管理员注册
router.post('/api/register', user.register);
// 管理员登录
router.post('/api/login', user.login);

// 游客注册
router.post('/api/customerRegister', customer.register);
// 游客登录
router.post('/api/customerLogin', customer.login);


// 文章评论
router.post('/api/commentOne', comment.commentOne);
// 对一级评论点赞
router.post('/api/commentLike', comment.commentLike);

// 对文章点赞
router.post('/api/likeArticle', article.likeArticle);


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
