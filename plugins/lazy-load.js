import Vue from 'vue';
import Mint from 'mint-ui';
import { Rate } from 'element-ui';
import VueScrollTo from 'vue-scrollto';
import VueCookie from 'vue-cookie';
import VueLazyload from 'vue-lazyload';
import 'element-ui/lib/theme-chalk/rate.css';


Vue.use(VueLazyload, {
  loading: 'https://bgl.zbjimg.com/bgl%2Fbjclound%2Fdefault.png%2Forigine%2Fcab99d5e-fbf9-481f-a444-505f2b219b99?imageMogr2/auto-orient/strip/quality/90',
  error: 'https://bgl.zbjimg.com/bgl%2Fbjclound%2Fdefault.png%2Forigine%2Fcab99d5e-fbf9-481f-a444-505f2b219b99?imageMogr2/auto-orient/strip/quality/90',
  attempt: 1,
  filter: {
    webp(listener, options) {
      if (!options.supportWebp) return;
      const src = listener.src || '';
      const isCDN = src.includes('public-test.zbjimg.com') || src.includes('caishui.zbjimg.com');
      if (isCDN && !/\?/g.test(src)) {
        listener.src += '?imageView2/0/format/webp/q/75|imageslim';
      }
    },
  },
});

Vue.use(VueCookie);
Vue.use(Mint);
Vue.use(Rate);
Vue.use(VueScrollTo);
