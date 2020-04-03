// 引入编写好的api
const api = require('./api');

// 引入文件模块
const fs = require('fs');
// 引入处理路径的模块
const path = require('path');
// 引入处理post数据的模块
const bodyParser = require('body-parser')
// 引入Express
const express = require('express');
const app = express();
app.use(bodyParser.json({limit: '100mb'}));
app.use(bodyParser.urlencoded({limit: '100mb', extended: false}));
app.use(api);


var session = require('express-session');
app.use(session({
  secret: 'my-secret',
  resave: false,
  saveUninitialized: true
}));


// CORS解决跨域问题
app.all('*', (req, res, next) => {
  if (req.headers.origin === 'http://localhost' || 'https://www.jscwwd.com') {
    res.header("Access-Control-Allow-Origin", req.headers.origin); // 最核心的
  } else {
    res.header("Access-Control-Allow-Origin", "https://www.jscwwd.com"); // 最核心的
  }
  res.header("Access-Control-Allow-Headers", "X-Requested-With");
  res.header("Access-Control-Allow-Methods","PUT,POST,GET,DELETE,OPTIONS");
  res.header("X-Powered-By",' 3.2.1');
  res.header("Content-Type", "application/json;charset=utf-8");
  res.header("Cache-Control", "max-age=3600");
  next();
});

//将路由文件引入
// const route = require('./routes/index');
//初始化所有路由
// route(app.Router());

// app.use('upload', express.static(__dirname + '/upload'));

// 加载图片资源
app.get('/upload/*', function (req, res) {
  let file_path = __dirname + req.url;

  fs.readFile(file_path, 'binary', function (err, data) {
    if (err) {
      console.log(err, 'error');
    } else {
      //不加这句，页面可能会乱码，图片包含中文也会乱码
      res.writeHead(200, {
          'Content-Type': 'image/jpeg'
      });
      res.write(data, 'binary');
      res.end();
    }
  })
})

// error handler
app.use(function(err, req, res, next) {
	// set locals, only providing error in development
	res.locals.message = err.message;
	res.locals.error = req.app.get('env') === 'development' ? err : {};

	// render the error page
	res.status(err.status || 500);
	res.render('error');
});













//
//
// // 访问静态资源文件 这里是访问所有dist目录下的静态资源文件
// app.use(express.static(path.resolve(__dirname, '../pages')))
//
// // 编辑页面
// app.get('/newsedit', (req, res) => {
//     const html = fs.readFileSync(path.resolve(__dirname, '../html/newsedit.html'), 'utf-8')
//     res.send(html)
// })
//
// // 列表页面
// app.get('/newslist', (req, res) => {
//     const html = fs.readFileSync(path.resolve(__dirname, '../html/newslist.html'), 'utf-8')
//     res.send(html)
// })
//
// 详情面
// app.use('/', (req, res) => {
  // console.log(req, 'app  get')
    // const html = fs.readFileSync(path.resolve(__dirname, '../pages/user/one.vue'), 'utf-8')
    // res.send(html)
// })
//
//
// // 爬虫页面
// app.get('/spider/', (req, res) => {
//     const html = fs.readFileSync(path.resolve(__dirname, '../html/spider.html'), 'utf-8')
//     res.send(html)
// })


// 监听3333端口
app.listen(3000);
