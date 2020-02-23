/*
*所有的路由接口
*/
const tag = require('./tag');
var express = require('express');
var router = express.Router();

module.exports = () => {
	router.get('/api/getTagList', tag.getTagList);
};
