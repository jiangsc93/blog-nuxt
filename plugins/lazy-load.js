import Vue from 'vue';
import VueScrollTo from 'vue-scrollto';
import VueCookie from 'vue-cookie';
import VueLazyload from 'vue-lazyload';
import 'element-ui/lib/theme-chalk/rate.css';


Vue.use(VueLazyload, {
  loading: 'http://www.jscwwd.com:3000/upload/lazy_ympc_202003290028.png',
  error: 'http://www.jscwwd.com:3000/upload/lazy_ympc_202003290028.png',
  attempt: 1
});

Vue.use(VueCookie);
Vue.use(VueScrollTo);
