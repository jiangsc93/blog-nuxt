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
  static queryByArea(data){
    return Net.postJSON(Checkenv.url.api + "/queryByArea/", {}, data);
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
    return Net.postJSONByToken(Checkenv.url.api + "/deleteArticleAdmin/", {}, data);
  }

  /**
   * 创建文章
   */
  static editNewArticleAdmin(data){
    return Net.postJSONByToken(Checkenv.url.api + "/editNewArticleAdmin/", {}, data);
  }

  /**
   * 修改文章
   */
  static ModifyArticleAdmin(data){

    return Net.postJSONByToken(Checkenv.url.api + "/ModifyArticleAdmin/", {}, data);
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
   * 获取作者信息
   */
  static getAuthorInfo(data){
    return Net.postJSON(Checkenv.url.api + "/getAuthorInfo", {}, data);
  }
  /**
   * 修改管理员信息
   */
  static modifyUserInfo(data){
    return Net.postJSONByToken(Checkenv.url.api + "/modifyUserInfo", {}, data);
  }
  /**
   * 获取用户列表
   */
  static getUserList(data){
    return Net.postJSON(Checkenv.url.api + "/getUserList", {}, data);
  }
  /**
   * 删除单个用户
   */
  static deleteUser(data){
    return Net.postJSON(Checkenv.url.api + "/deleteUser", {}, data);
  }


  
  /**
   * 查询评论列表
   */
  static queryCommentList(data){
    return Net.postJSON(Checkenv.url.api + "/queryCommentList", {}, data);
  }
  /**
   * 添加文章评论
   */
  static commentOne(data){
    return Net.postJSONByToken(Checkenv.url.api + "/commentOne", {}, data);
  }
  /**
   * 删除评论
   */
  static deleteComment(data){
    return Net.postJSONByToken(Checkenv.url.api + "/deleteComment", {}, data);
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
  static like(data){
    return Net.postJSONByToken(Checkenv.url.api + "/like", {}, data);
  }
  /**
   * 对文章取消点赞
   */
  static unlike(data){
    return Net.postJSONByToken(Checkenv.url.api + "/unlike", {}, data);
  }
  /**
   * 点过赞的文章列表
   */
  static likeList(data){
    return Net.postJSON(Checkenv.url.api + "/likeList", {}, data);
  }
  /**
   * 查询当前用户是否点赞、关注
   */
  static likeAndFollowStatus(data){
    return Net.postJSON(Checkenv.url.api + "/likeAndFollowStatus", {}, data);
  }


  /**
   * 关注
   */
  static follow(data){
    return Net.postJSONByToken(Checkenv.url.api + "/follow", {}, data);
  }
  /**
   * 取关
   */
  static unfollow(data){
    return Net.postJSONByToken(Checkenv.url.api + "/unfollow", {}, data);
  }
  /**
   * 查询用户关注的或被关注列表
   */
  static queryFollowList(data){
    return Net.postJSON(Checkenv.url.api + "/queryFollowList", {}, data);
  }



  /**
   * 收藏
   */
  static collect(data){
    return Net.postJSONByToken(Checkenv.url.api + "/collect", {}, data);
  }
  /**
   * 取消收藏
   */
  static uncollect(data){
    return Net.postJSONByToken(Checkenv.url.api + "/uncollect", {}, data);
  }
  /**
   * 查询收藏列表
   */
  static queryCollectList(data){
    return Net.postJSON(Checkenv.url.api + "/queryCollectList", {}, data);
  }


  /**
   * 查询用户通知
   */
  static getUserNotification(data){
    return Net.postJSON(Checkenv.url.api + "/getUserNotification", {}, data);
  }


  /**
   * 重置密码通过邮箱
   */
  static resetPwdByEmail(data){
    return Net.postJSON(Checkenv.url.api + "/resetPwdByEmail", {}, data);
  }


  /**
   * 通过邮箱token修改密码
   */
  static changePwdByEmailToken(data){
    return Net.postJSON(Checkenv.url.api + "/changePwdByEmailToken", {}, data);
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
