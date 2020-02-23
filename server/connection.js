//引用mongoose模块
var mongoose = require('mongoose');
mongoose.Promise = global.Promise;
//连接数据库
mongoose.connect('mongodb://localhost/blogdata', {useMongoClient: true})
var db = mongoose.connection;
db.once('error',() => console.log('Mongo 连接失败!'));
db.once('open',() => console.log('mongodb 连接成功!'));


module.exports = db;
