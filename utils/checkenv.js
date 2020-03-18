
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
      SERVER.httpUrl = "http://localhost" + port; 
      SERVER.imgurlhttp = "http://localhost" + port; 

    } else {
      SERVER.url[obj] = "https://" + envTemp + "www.jscwwd.com" + SERVER.url[obj];
      SERVER.httpUrl = "https://" + envTemp + "www.jscwwd.com";
      SERVER.imgurlhttp = "http://" + envTemp + "www.jscwwd.com" + port;
    }
  }
  return SERVER;
}


//当前加载环境 dev：开发环境 test：测试环境 "": 生产环境或本地  pre 预发布
let SERVER = checkCurrentEnv("");

// console.log('当前服务器地址....',SERVER);


export default SERVER;
