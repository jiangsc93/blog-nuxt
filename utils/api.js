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
  static getArticleList(params){
    return Net.postJSON(Checkenv.url.api + "/getArticleList/", {}, params);
  }
  // static articlelist(params){
  //   return Net.postJSON(Checkenv.url.api + "/articlelist/", {}, params);
  // }

  /**
   * 提交留言
   */
  static submitMessage(params){
    return Net.postJSON(Checkenv.url.api + "/submitMessage/", {}, params);
  }
  /**
   * 添加项目
   */
  static addProject(params){
    return Net.postJSON(Checkenv.url.api + "/addProject/", {}, params);
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
   * 获取项目列表
   */
  static getExperienceList(data){

    return Net.getJSON(Checkenv.url.api + "/getExperienceList/", {}, data);
  }

  /**
   * 获取单个文章
   */
  static getArticleOne(Id){
    return Net.postJSON(Checkenv.url.api + "/getArticleOne/" + Id);
  }
  
  /**
   * 文章列表
   */
  static getArticleListAdmin(pageIndex, pageSize){
    return Net.postJSON(Checkenv.url.api + "/getArticleListAdmin/", {}, {pageIndex, pageSize});
  }

  /**
   * 删除文章
   */
  static deleteArticleAdmin(Id){
    return Net.postJSON(Checkenv.url.api + "/deleteArticleAdmin/" + Id);
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
  static ModifyArticleAdmin(Id, data){

    return Net.postJSON(Checkenv.url.api + "/ModifyArticleAdmin/" + Id, {}, data);
  }

  /**
   * 获取标签列表
   */
  static getTagList(){

    return Net.getJSON(Checkenv.url.api + "/getTagList/");
  }

  /**
   * 获取单个文章
   */
  static getArticleOneAdmin(Id){
    return Net.postJSON(Checkenv.url.api + "/getArticleOneAdmin/" + Id);
  }

  /**
   * 登录页面
   */
  static login(data){
    return Net.postJSON(Checkenv.url.api + "/login", {}, data);
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



}
