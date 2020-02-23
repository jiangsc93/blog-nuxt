
/**
 * 环境检查
 * @param localEnv
 */


var checkCurrentEnv = function (localEnv, rt) {
  var SERVER = {
    url: {
      api : "/api"
    },
    env: ""
  };

  var root = "";

  if(typeof window != 'undefined'){
    root = window.location.origin;
  }
  else{
    root = rt;
  }

  var env, localEnv, port;
  if (localEnv) {
    env = localEnv == "formal" ? "" : localEnv;
  } else {
    // localEnv = "dev";
    localEnv = "";
    //当前加载环境 dev：开发环境 test：测试环境 "": 生产环境或本地  pre 预发布
    
    // env = root.indexOf("localhost") != -1 ? "localhost" : root.indexOf("dev") != -1 ? "dev" : root.indexOf("test")  != -1 ? "test" : root.indexOf("pre") != -1 ? "pre" : "";
    env = "localhost"; // 上线更改
    // env = "";
  }
  SERVER.env = env;
  //端口检查
  for (var obj in SERVER.url) {
    var envTemp = env == "" ? "" : env == "localhost" ? "localhost" : (env + ".");
    // port = envTemp != '' ? '' : ":3333";
    port = ":3000";
    //服务地址
    if(envTemp == "localhost") {
      SERVER.url[obj] = "http://localhost"+port+ SERVER.url[obj]; // 上线更改
      // SERVER.url[obj] = "http://39.96.10.130:3000"+ SERVER.url[obj];
    } else {
      SERVER.url[obj] = "http://" +envTemp+ "www.jscwwd.com"+port+ SERVER.url[obj];
    }
  }
  return SERVER;
}


//当前加载环境 dev：开发环境 test：测试环境 "": 生产环境或本地  pre 预发布
let SERVER = checkCurrentEnv("");

console.log('当前服务器地址....',SERVER);


export default SERVER;
