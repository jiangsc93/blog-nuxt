import  UI from "./ui";
import axios from 'axios'
import store from '../store/index.js'
import qs from 'qs';
import Cookies from 'js-cookie'
//Axios请求拦截器
axios.interceptors.request.use(config => {
  // let token = Cookies.get("token") || 'token';
  // console.log(token, 'token');
  // if (token) {  // 判断是否存在token，如果存在的话，则每个http header都加上token
  //   config.headers['Authorization'] = token;
  //   console.log('interceptors config=',config);
  // }
  return config;
}, error => {
  return Promise.reject(error)
})

axios.interceptors.response.use(response => {
  return response
}, error => {
  return Promise.resolve(error.response)
})
var Net = {

  getJSON: function (url, params, config) {
    return new Promise(function(resolve, reject){

      axios.get(url, config)
        .then(function(res){
          res && res.status == 200 ? resolve(res.data.data) : reject('错误:');
        })
        .catch(function(err){
          UI.toast("哎呀，网络连接出错啦");
          reject(err);
        })
    });
  },

  postJSON: function (url, params, data, config) {
    var i = 0;
    var isHasPraram;

    //检测url
    if (url.indexOf("?") != -1) {
      isHasPraram = true;
    }

    for (var o in params) {
      if (params[o] == undefined || params[o] == null) {
        continue;
      }
      if (i == 0 && !isHasPraram) {
        url += "?" + o + "=" + params[o];
      }
      else {
        url += "&" + o + "=" + params[o];
      } 
      i++;
    }

    return new Promise(function(resolve, reject){
     
      axios({
        method:"post",
        url:url,
        data:qs.stringify(data),
        headers:{
          "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8",
        }
      })
        .then(function(res){
          res && res.status == 200 ? resolve(res.data.data) : reject('错误:');
        })
        .catch(function(err){

          UI.toast("哎呀，网络连接出错啦");
          reject(err);
        })
    });
  },

  postJSONByToken: function (url, params, data, config) {
    var i = 0;
    var isHasPraram;

    // 检测url
    if (url.indexOf("?") != -1) {
      isHasPraram = true;
    }

    for (var o in params) {
      if (params[o] == undefined || params[o] == null) {
        continue;
      }
      if (i == 0 && !isHasPraram) {
        url += "?" + o + "=" + params[o];
      }
      else {
        url += "&" + o + "=" + params[o];
      }
      i++;
    }
    data.token = localStorage.getItem("token");
    data.user_id_t = localStorage.getItem("userId");
    return new Promise(function(resolve, reject){
      
      axios({
        method:"post",
        url:url,
        data:qs.stringify(data),
        headers:{
          "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8",
        }
      })
        .then(function(res){
          res && res.status == 200 ? resolve(res.data.data) : reject('错误:');
        })
        .catch(function(err){
          UI.toast("哎呀，网络连接出错啦");
          reject(err);
        })
    });
  }

}


export default Net;
