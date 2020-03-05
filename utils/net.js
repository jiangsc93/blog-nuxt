import  UI from "./ui";
import axios from 'axios'
import qs from 'qs';

// axios.defaults.headers.common['Authorization'] = '11111token';

var Net = {

  getJSON: function (url, params, config) {
    return new Promise(function(resolve, reject){

      axios.get(url, config)
        .then(function(res){
          res.status == 200 ? resolve(res) : reject('错误:', res.status);
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

    // "Authorization":'token123'
    return new Promise(function(resolve, reject){
      axios({
        method:"post",
        url:url,
        data:qs.stringify(data),
        headers:{
          "Content-Type": "application/x-www-form-urlencoded"
        }
      })
        .then(function(res){
          res.status == 200 ? resolve(res) : reject('错误:', res.status);
        })
        .catch(function(err){
          UI.toast("哎呀，网络连接出错啦");
          reject(err);
        })
    });
  }

}


export default Net;
