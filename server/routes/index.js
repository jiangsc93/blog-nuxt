var project = require('./project');
var article = require('./article');
var message = require('./message');
var tag = require('./tag');
var experience = require('./experience');
var user = require('./user');
var customer = require('./customer');
var comment = require('./comment');
var config = require('./config');
var jiyan = require('./jiyan');
var upload = require('./upload');

var express = 

module.exports = app => {

  app.post('/api/getArticleList/', article.getArticleList);
  // 前台：读取单个文章详情
  app.post('/api/getArticleOne/', article.getArticleOne);
  // admin 删除文章
  app.post('/api/deleteArticleAdmin/', article.deleteArticleAdmin);
  // admin 编辑新文章
  app.post('/api/editNewArticleAdmin/', article.editNewArticleAdmin);
  // admin 修改原文章
  app.post('/api/modifyArticleAdmin/', article.modifyArticleAdmin);
  // admin 分页获取文章列表
  app.post('/api/getArticleListAdmin/', article.getArticleListAdmin);
  // admin 获取单个文章
  app.post('/api/getArticleOneAdmin/', article.getArticleOneAdmin);
  // 搜索文章
  app.post('/api/search/', article.search);

  // 获取项目列表
  app.get('/api/getProjectList/', project.getProjectList);
  // 添加项目
  app.post('/api/addProject/', project.addProject);
  // 删除项目
  app.post('/api/deleteProject/', project.deleteProject);

  // 获取标签列表
  app.get('/api/getTagList/', tag.getTagList);
  // 获取标签分类
  app.get('/api/getTagSort/', article.getTagSort);

  // 提交留言
  app.post('/api/submitMessage', message.submitMessage);
  // 获取留言列表
  app.get('/api/getMessageListAdmin', message.getMessageListAdmin);

  // 添加历程
  app.post('/api/addExperience', experience.addExperience);
  // 删除历程
  app.post('/api/deleteExperience', experience.deleteExperience);
  // 获取历程列表
  app.get('/api/getExperienceList', experience.getExperienceList);

  // 添加配置
  app.post('/api/addConfig', config.addConfig);
  // 删除配置
  app.post('/api/deleteConfig', config.deleteConfig);
  // 获取配置列表
  app.get('/api/getConfigList', config.getConfigList);


  // 管理员注册
  app.post('/api/register', user.register);
  // 管理员登录
  app.post('/api/login', user.login);
  // 获取用户信息
  app.post("/api/getUserInfo", user.getUserInfo);
  // 修改用户信息
  app.post("/api/modifyUserInfo", user.modifyUserInfo);
  // 获取管理员列表
  app.post('/api/getManagerList', user.getManagerList);
  // 删除单个管理员
  app.post('/api/deleteManager', user.deleteManager);

  // 游客注册
  app.post('/api/customerRegister', customer.register);
  // 游客登录
  app.post('/api/customerLogin', customer.login);
  // 获取游客列表
  app.post('/api/getCustomerList', customer.getCustomerList);
  // 删除单个游客
  app.post('/api/deleteCustomer', customer.deleteCustomer);


  // 文章评论
  app.post('/api/commentOne', comment.commentOne);
  // 对一级评论点赞
  app.post('/api/commentLike', comment.commentLike);

  // 对文章点赞
  app.post('/api/likeArticle', article.likeArticle);




  // 极验接口
  app.get("/api/gt/register-slide", jiyan.register);
  app.post("/api/gt/validate-slide", jiyan.validate);
  
  
  // 上传图片
  app.post('/api/upload', upload.upload);

}
