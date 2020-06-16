import Vue from 'vue';
import VueScrollTo from 'vue-scrollto';
import VueCookie from 'vue-cookie';
import VueLazyload from 'vue-lazyload';
import 'element-ui/lib/theme-chalk/rate.css';


Vue.use(VueLazyload, {
  // loading: 'http://localhost:3000/upload/qing_202005022237.png',
  // error: 'http://localhost:3000/upload/qing_202005022237.png',
  loading: 'http://www.jscwwd.com:3000/upload/lazy-img_202006131337.png',
  error: 'http://www.jscwwd.com:3000/upload/lazy-img_202006131337.png',
  attempt: 1
});

Vue.use(VueCookie);
Vue.use(VueScrollTo);


