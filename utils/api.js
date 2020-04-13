/**
 * 封装前端接口
 */

import Checkenv from "./checkenv";
import Net from "./net";


export default class  {

  /**
   * 文章类型列表  按照类型，页数查找文章列表
   * params类型：{
   *   type: '1',     1 文章 2 归档 
   *   tag: '全部',   各种标签
   *   pageIndex: '1',
   *   pageSize: 10,
   * }
   */
  static getArticleList(data){
    return Net.postJSON(Checkenv.url.api + "/getArticleList/", {}, data);
  }

  /**
   * 搜索文章
   */
  static search(params){
    return Net.postJSON(Checkenv.url.api + "/search/", {}, params);
  }
  /**
   * 提交留言
   */
  static submitMessage(params){
    return Net.postJSON(Checkenv.url.api + "/submitMessage/", {}, params);
  }
  /**
   * 获取留言列表
   */
  static getMessageListAdmin(){
    return Net.getJSON(Checkenv.url.api + "/getMessageListAdmin/");
  }
  /**
   * 添加项目
   */
  static addProject(params){
    return Net.postJSON(Checkenv.url.api + "/addProject/", {}, params);
  }
  /**
   * 删除项目
   */
  static deleteProject(params){
    return Net.postJSON(Checkenv.url.api + "/deleteProject/", {}, params);
  }

    /**
   * 获取项目列表
   */
  static getProjectList(data){
    return Net.getJSON(Checkenv.url.api + "/getProjectList/", {}, data);
  }
  /**
   * 添加历程
   */
  static addExperience(params){
    return Net.postJSON(Checkenv.url.api + "/addExperience/", {}, params);
  }
  /**
   * 删除历程
   */
  static deleteExperience(params){
    return Net.postJSON(Checkenv.url.api + "/deleteExperience/", {}, params);
  }

    /**
   * 获取历程列表
   */
  static getExperienceList(data){

    return Net.getJSON(Checkenv.url.api + "/getExperienceList/", {}, data);
  }


  /**
   * 添加配置
   */
  static addConfig(params){
    return Net.postJSON(Checkenv.url.api + "/addConfig/", {}, params);
  }
  /**
   * 删除配置
   */
  static deleteConfig(params){
    return Net.postJSON(Checkenv.url.api + "/deleteConfig/", {}, params);
  }

    /**
   * 获取配置列表
   */
  static getConfigList(data){

    return Net.getJSON(Checkenv.url.api + "/getConfigList/", {}, data);
  }


  /**
   * 获取单个文章
   */
  static getArticleOne(data){
    return Net.postJSON(Checkenv.url.api + "/getArticleOne/", {}, data);
  }
  
  /**
   * 文章列表
   */
  static getArticleListAdmin(data){
    return Net.postJSON(Checkenv.url.api + "/getArticleListAdmin/", {}, data);
  }

  /**
   * 删除文章
   */
  static deleteArticleAdmin(data){
    return Net.postJSON(Checkenv.url.api + "/deleteArticleAdmin/", {}, data);
  }

  /**
   * 创建文章
   */
  static editNewArticleAdmin(data){
    return Net.postJSON(Checkenv.url.api + "/editNewArticleAdmin/", {}, data);
  }

  /**
   * 修改文章
   */
  static ModifyArticleAdmin(data){

    return Net.postJSON(Checkenv.url.api + "/ModifyArticleAdmin/", {}, data);
  }

  /**
   * 获取标签列表
   */
  static getTagList(){

    return Net.getJSON(Checkenv.url.api + "/getTagList/");
  }

  /**
   * 获取标签分类
   */
  static getTagSort(){

    return Net.getJSON(Checkenv.url.api + "/getTagSort/");
  }

  /**
   * 获取单个文章
   */
  static getArticleOneAdmin(data){
    return Net.postJSON(Checkenv.url.api + "/getArticleOneAdmin/", {}, data);
  }

  /**
   * 管理员注册
   */
  static register(data){
    return Net.postJSON(Checkenv.url.api + "/register", {}, data);
  }

  /**
   * 管理员登录
   */
  static login(data){
    return Net.postJSON(Checkenv.url.api + "/login", {}, data);
  }
  /**
   * 获取管理员信息
   */
  static getUserInfo(data){
    return Net.postJSON(Checkenv.url.api + "/getUserInfo", {}, data);
  }
  /**
   * 修改管理员信息
   */
  static modifyUserInfo(data){
    return Net.postJSON(Checkenv.url.api + "/modifyUserInfo", {}, data);
  }
  /**
   * 获取管理员列表
   */
  static getManagerList(data){
    return Net.postJSON(Checkenv.url.api + "/getManagerList", {}, data);
  }
  /**
   * 删除单个管理员
   */
  static deleteManager(data){
    return Net.postJSON(Checkenv.url.api + "/deleteManager", {}, data);
  }


  /**
   * 游客注册
   */
  static customerRegister(data){
    return Net.postJSON(Checkenv.url.api + "/customerRegister", {}, data);
  }
  /**
   * 游客登录
   */
  static customerLogin(data){
    return Net.postJSON(Checkenv.url.api + "/customerLogin", {}, data);
  }
 /**
   * 获取游客列表
   */
  static getCustomerList(data){
    return Net.postJSON(Checkenv.url.api + "/getCustomerList", {}, data);
  }
  /**
   * 删除单个游客
   */
  static deleteCustomer(data){
    return Net.postJSON(Checkenv.url.api + "/deleteCustomer", {}, data);
  }

  /**
   * 添加文章评论
   */
  static commentOne(data){
    return Net.postJSON(Checkenv.url.api + "/commentOne", {}, data);
  }
  /**
   * 对一级评论点赞
   */
  static commentLike(data){
    return Net.postJSON(Checkenv.url.api + "/commentLike", {}, data);
  }
  /**
   * 对文章点赞
   */
  static likeArticle(data){
    return Net.postJSON(Checkenv.url.api + "/likeArticle", {}, data);
  }


  /**
   * 登出页面
   */
  static logout(){
    return Net.postJSON(Checkenv.url.api + "/logout");
  }


  /**
   * 急眼1
   */
  static JiyanSlide(){
    return Net.getJSON(Checkenv.url.api + "/gt/register-slide?t=" + (new Date()).getTime());
  }

  /**
   * 急眼2
   */
  static JiyanValidate(data){
    return Net.postJSON(Checkenv.url.api + "/gt/validate-slide", {}, data);
  }


  /**
   * 上传图片
   */
  static upload(data){
    return Net.postJSON(Checkenv.url.api + "/upload", {}, data);
  }



}
