import Vue from 'vue';
import moment from 'moment';

/*
 * webp格式
 * */
const NODE_ENV = process.env.NODE_ENV;
const isWebp = checkWebp();
Vue.filter('isSupportWebp', (imgSrc) => {
  let newSrc = imgSrc.substr(0, imgSrc.lastIndexOf('.'));
  if (isWebp && NODE_ENV === 'production') {
    newSrc += '.webp';
  } else {
    newSrc = imgSrc;
  }
  return newSrc;
});

function checkWebp() {
  try {
    return (document.createElement('canvas').toDataURL('image/webp').indexOf('data:image/webp') === 0);
  } catch (err) {
    return false;
  }
}

/*
 * 格式化金额
 * */
Vue.filter('amountFormat', (numberStr) => {
  const type = typeof numberStr;
  if (type === 'string') {
    if (/%$/.test(numberStr)) {
      return numberStr;
    }
    numberStr = numberStr.replace(/,/g, '');
  }
  if (isNaN(numberStr) || numberStr === '' || type === 'undefined' || numberStr === null) {
    return '--';
  }
  const number = parseFloat(numberStr);
  if (typeof number === 'number') {
    numberStr = number.toFixed(2);
    numberStr = numberStr.replace(/(\d{1,3})(?=(\d{3})+(?:$|\.))/g, '$1,');
  }
  return numberStr;
});

/*
 * 时间格式化
 * format 参考moment 格式
 * */
Vue.filter('momentFormat', (time, format) => {
  format = format || 'YYYY-MM-DD HH:mm:ss';
  if (time) {
    return moment(time).format(format);
  }
  return moment().format(format);
});
/*
 * 图片链接替换成https
 * */
Vue.filter('img4https', (img = '') => {
  if (NODE_ENV === 'production' && (typeof img === 'string')) {
    return img.replace(/^http:\/\//g, 'https://');
  }
  return img;
});

/**
 * 手机号码中间4位隐藏
 */
Vue.filter('hideFourNumber', (phone) => {
  if (phone) {
    return phone.replace(/(\d{3})\d{4}(\d{4})/, '$1****$2');
  }
});
/**
 * 处理文章发布时间
 */
Vue.filter('formatTime', (time) => {
    time = +time * 1000;
    const d = new Date(time);
    const now = Date.now();
  
    const diff = (now - d) / 1000;
  
    if (diff < 30) {
      return '刚刚';
    } else if (diff < 3600) {
      // less 1 hour
      return Math.ceil(diff / 60) + '分钟前';
    } else if (diff < 3600 * 24) {
      return Math.ceil(diff / 3600) + '小时前';
    } else if (diff < 3600 * 24 * 2) {
      return '1天前';
    }
    if (option) {
      // return parseTime(time, option)
    } else {
      return (
        d.getMonth() +
        1 +
        '月' +
        d.getDate() +
        '日' +
        d.getHours() +
        '时' +
        d.getMinutes() +
        '分'
      );
    }
});


