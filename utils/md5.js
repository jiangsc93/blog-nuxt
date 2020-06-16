const crypto = require('crypto');

module.exports = {
	MD5_SALT: 'jsc1993@#0220*%',
	md5: function(pwd) {
		let md5 = crypto.createHash('md5');
		return md5.update(pwd).digest('hex');
	},
};