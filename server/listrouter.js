// 引入编写好的api
const api = require('./api');
// const route = require('./routes/index');
// 引入文件模块
const fs = require('fs');
// 引入处理路径的模块
const path = require('path');
// 引入处理post数据的模块
const bodyParser = require('body-parser')
// 引入Express
const express = require('express');

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(api);

// app.use('upload', express.static(__dirname + '/upload'));

// 加载图片资源
app.get('/upload/*', function (req, res) {
  console.log(req.url, 'app');
  let file_path = __dirname + req.url;
  console.log(file_path, 'path');

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


// app.use(route);
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
