import Vue from 'vue';
import moment from 'moment';
import { Toast, MessageBox } from 'mint-ui';
import { Message } from 'element-ui';

/**
 * @param phone 手机号码
 * @returns {boolean}
 */
Vue.prototype.phoneValidate = function (phone) {
  phone = phone || '';
  const phoneReg = /^1\d{2}(\d|\*){4}\d{4}$/;
  return phoneReg.test(phone);
};

/**
 * 手机号码中间4位隐藏
 */
Vue.prototype.mobileDeal = function (mobile = '') {
  const reg = new RegExp('(\\d{3})(\\d{4})(\\d{4})');
  return mobile.replace(reg, '$1****$3');
};
/**
 * 滚动到index
 * @param option = {
 *  parentsDom //父元素 dom
 *  childDom   //子元素 dom
 * }
 */
Vue.prototype.scrollToIndex = function (options = {}) {
  let width = 0;
  const el = document.getElementsByClassName(options.parentsDom),
    defaults = setDefault(options),
    elChild = document.getElementsByClassName(options.childDom);


  if (!judgeOptions(defaults)) {
    return;
  }
  if (defaults.x) {
    width = elChild[0].offsetLeft;
  }
  scrollLeft(el, width);
};

function setDefault(options) {
  const defaults = {
    parentsDom: '',
    childDom: '',
    x: true,
    y: false,
  };
  return Object.assign({}, defaults, options);
}

function judgeOptions(options) {
  console.log(options, 'options');
  if (typeof options.parentsDom !== 'string' || typeof options.childDom !== 'string'
    || document.getElementsByClassName(options.parentsDom).length === 0
    || document.getElementsByClassName(options.childDom).length === 0
  ) {
    console.warn('Dom必须传是className并且存在');
    return false;
  }
  return true;
}

function scrollLeft(el = '', width = 0) {
  if (!el) {
    return;
  }
  el[0].scrollLeft = width;
}

/**
 * img 图片地址
 * @returns {*}
 */
Vue.prototype.img4https = function (img = '') {
  if (runtime === 'product' && img) {
    return img.replace(/^http:\/\//g, 'https://');
  }
  return img;
};

/*
 * 平滑滚动 function
 * */
const scrollTo = (el, from = 0, to = 0, duration = 500, endCallback) => {
  if (!window.requestAnimationFrame) {
    window.requestAnimationFrame = (
      window.webkitRequestAnimationFrame ||
      window.mozRequestAnimationFrame ||
      window.msRequestAnimationFrame ||
      function (callback) {
        return window.setTimeout(callback, 1000 / 60);
      }
    );
  }
  const difference = Math.abs(from - to);
  const step = Math.ceil(difference / duration * 50);

  function scroll(start, end, step) {
    if (start === end) {
      endCallback && endCallback();
      return;
    }

    let d = (start + step > end) ? end : start + step;
    if (start > end) {
      d = (start - step < end) ? end : start - step;
    }

    if (el === window) {
      window.scrollTo(d, d);
    } else {
      el.scrollTop = d;
    }
    window.requestAnimationFrame(() => scroll(d, end, step));
  }

  scroll(from, to, step);
};


/*
 *平滑滚动到某一个位置
 * */
Vue.prototype.scrollTo = (el, from = 0, to = 0, duration = 500, endCallback) => {
  scrollTo(el, from, to, duration, endCallback);
};

/*
 * 平滑滚动到顶部
 * */
Vue.prototype.scrollToTop = (duration, endCallback) => {
  const sTop = document.documentElement.scrollTop || document.body.scrollTop;
  scrollTo(window, sTop, 0, duration, endCallback);
};

/*
 * 判断是否是88 节
 * */
Vue.prototype.validate88Jie = (currentPeriod) => {
  currentPeriod = Number(currentPeriod);
  // 4, 0 和 NaN 不在88节期间
  if (currentPeriod === 4 || currentPeriod === 0 || isNaN(currentPeriod)) {
    return false;
  }
  return true;
};

/*
 * 时间格式化
 * format 参考moment 格式
 * */
Vue.prototype.momentFormat = function (time, format) {
  format = format || 'YYYY-MM-DD HH:mm:ss';
  if (time) {
    return moment(time).format(format);
  }
  return moment().format(format);
};

Vue.prototype.$toast = Toast;

Vue.prototype.$alert = MessageBox.alert;

Vue.prototype.$confirm = MessageBox.confirm;

Vue.prototype.$message = Message;

Vue.prototype.$prompt = MessageBox.prompt;

Vue.prototype.$ga = (...args) => window.__ga_new(...args);

// 百度统计
Vue.prototype.$hmt = ({
  category, action, optLabel = '', optValue = '',
}) => {
  window._hmt.push(['_trackEvent', category, action, optLabel, optValue]);
};

Vue.prototype.$log = function (message, type = 'info') {
  // type: info error
  this.$axios.post('/console', {
    message,
    type,
  }).catch((e) => {
    console.log(e);
  });
};

// 易查帐统计使用情况(google analytics)
Vue.prototype.$easyCheckUsing = (vm) => {
  if (vm.isExp !== 'true') {
    const { userId, selectedCompany } = vm;
    const { cityName, accountBookId, companyId } = selectedCompany || {};
    const {
      protocol, hostname, port, pathname,
    } = document.location;
    const eventLocation = `${protocol}//${hostname}${port ? `:${port}` : ''}${pathname}`;
    const timer = setTimeout(() => {
      const fieldsObject = {
        eventCategory: 'EesyCheckUse',
        eventAction: cityName || '',
        eventLabel: `uid${userId}-cid${companyId}-aid${accountBookId}`,
        location: eventLocation,
      };
      clearTimeout(timer);
      vm.$ga('send', 'event', fieldsObject);
    }, 1000);
  }
};
// 小程序点击容联七陌咨询跳回小程序咨询
Vue.prototype.newAsk = function (link) {
  if (this.isMiniProgram) {
    window.location.href = '/chat?chanceId=117';
  } else {
    window.location.href = link;
  }
};

/**
 * @param idcard 身份证
 * @returns {boolean}
 */
Vue.prototype.idcardValidate = function (idcard) {
  idcard = idcard || '';
  const idcardReg = /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/;
  return idcardReg.test(idcard);
};
