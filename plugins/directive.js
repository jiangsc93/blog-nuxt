import Vue from 'vue';

Vue.directive('clickoutside', {
  // 初始化指令
  bind(el, binding, vnode) {

    function documentHandler(e) {
        if (el.contains(e.target)) {
            return false;
        }
        if (binding.expression) {
            binding.value(e);
        }
    }
    el.__vueClickOutside__ = documentHandler;
    document.addEventListener('click', documentHandler);
  },
  update() {},
  unbind(el, binding) {
      document.removeEventListener('click', el.__vueClickOutside__);
      delete el.__vueClickOutside__;
  },
})