const crypto = require('crypto');

module.exports = {
	MD5_SALT: 'jsc1993@#0220*%',
	md5: function(pwd) {
		let md5 = crypto.createHash('md5');
		return md5.update(pwd).digest('hex');
	},
	// 响应客户端
	responseClient(res, httpCode = 500, message = '服务端异常', data = {}) {
		let responseData = {};
		responseData.code = httpCode;
		responseData.message = message;
		responseData.data = data;
		res.status(httpCode).send(responseData);
	},
};
