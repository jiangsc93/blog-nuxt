
/**
 * 环境检查
 * @param localEnv
 */


var checkCurrentEnv = function (localEnv, rt) {
  var SERVER = {
    url: {
      api : "/api"
    },
    httpUrl: "",
    httpDomain: "",
    imgurlhttp: "",
    env: ""
  };

  var root = "";

  if(typeof window != 'undefined'){
    root = window.location.origin;
  }
  else{
    root = rt;
  }
  var env, port;
  if (process.env.NODE_ENV === 'development') {
    env = "localhost";
  } else {
    env = "";
  }
  SERVER.env = env;
  //端口检查
  for (var obj in SERVER.url) {

    var envTemp = env == "" ? "" : env == "localhost" ? "localhost" : (env + ".");
    port = ":3000";
    // 服务地址
    if(envTemp == "localhost") {
      SERVER.url[obj] = "http://localhost" + port + SERVER.url[obj];
      SERVER.httpUrl = "http://localhost";
      SERVER.imgurlhttp = "http://localhost" + port;
      SERVER.httpDomain = "http://localhost";
    } else {
      SERVER.url[obj] = "http://www.jscwwd.com" + port + SERVER.url[obj];
      SERVER.httpUrl = "http://www.jscwwd.com";
      SERVER.httpDomain = "http://www.jscwwd.com";
      SERVER.imgurlhttp = "http://www.jscwwd.com" + port;
    }
  }
  return SERVER;
}


//当前加载环境 dev：开发环境 test：测试环境 "": 生产环境或本地  pre 预发布
let SERVER = checkCurrentEnv("");

// console.log('当前服务器地址....',SERVER);


export default SERVER;
