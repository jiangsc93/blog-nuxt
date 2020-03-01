//引用mongoose模块
const mongoose = require('mongoose');
const consola = require('consola');
mongoose.Promise = global.Promise;

//连接数据库
mongoose.connect('mongodb://localhost/blogdata', {useMongoClient: true})
const db = mongoose.connection;
db.once('error',() => consola.warn('Mongo 连接失败!'));
db.once('open',() => consola.ready('mongodb 连接成功!'));
module.exports = db;