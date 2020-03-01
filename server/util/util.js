module.exports = {
	// 响应客户端
	responseClient(res, httpCode = 500, message = '服务端异常', data = {}) {
		let responseData = {};
		responseData.code = httpCode;
		responseData.message = message;
		responseData.data = data;
		res.status(httpCode).send(responseData);
	},
};
