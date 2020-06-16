<template>
  <div :class="isFixed ? 'page-nav fixed-top' : 'page-nav'">
    <ul class="nav-ul" :class="{'m-ul': isMobile}" v-if="navList.length > 0">
      <li class="tag-item" :class="activeEng === item.eng ? 'active' : ''" v-for="(item, index) in navList" :key="index">
        <a :href="handleHref(item)">{{item.name}}</a>
      </li>
    </ul>
  </div>
</template>

<script>
import Api from '~/utils/api'
import { mapState } from 'vuex';

export default {
  props: {
    navList: { // 导航列表
      type: Array,
      default: () => []
    },
    linkUrl: { // url的头部
      type: String,
      default: () => ''
    },
    queryFirstPro: { // 查询的第一个参数，如果没有则表示navList的是params
      type: String,
      default: () => ''
    },
    queryObject: { // query参数的列表
      type: Object,
      default: () => {}
    },
  },
  data() {
    return {
      isFixed: false,
      activeEng: this.$route.query.type || this.$route.params.id || 'article'
    }
  },
  computed: {
    ...mapState(['isMobile','showHeader']),
  },
  mounted() {
    window.addEventListener('scroll', () => {
      let scroll = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop;
      if (scroll > 60) {
        this.isFixed = true;
        this.$store.commit('setHeaderIsShow', false)
      } else {
        this.isFixed = false;
        this.$store.commit('setHeaderIsShow', true)
      }
    })
  },
  methods: {
    handleHref(item) {
      let url_1 = '';
      let isHasQueryList = this.queryObject ? true : false;
       if (!this.queryFirstPro) { // 表示列表项是params 如 /user/5eiertuyt8387575?
        url_1 = `${this.linkUrl}/${item.eng}${isHasQueryList ? '?' : ''}`;
      } else { // 列表项是query参数的第一个 如 /user?type=articles&
        url_1 = `${this.linkUrl}?${this.queryFirstPro}=${item.eng}${isHasQueryList ? '&' : ''}`;
      }
      let url_2 = '';
      for (var x in this.queryObject) {
        let item = x + '=' + this.queryObject[x] + '&';
        url_2 += item;
      }
      url_2 = url_2.slice(0, url_2.length - 1);
      return url_1 + url_2;
    },
    isActive(val) {
      if (this.$route.params.id && this.$route.params.id === val) {
        return true;
      } else {
        return false;
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.page-nav {
  width: 100%;
  background: #fff;
  padding: 12px 0;
  position: fixed;
  top: 61px;
  left: 0;
  z-index: 9;
  transition: top .2s;
  box-shadow: 0 1px 2px 0 rgba(0,0,0,.05);
  &.fixed-top {
    top: 0;
    transition: top .2s;
  }
  .nav-ul {
    max-width: 960px;
    margin: 0 auto;
    .tag-item {
      display: inline-block;
      padding-right: 30px;
      font-size: 15px;
      color: $font-color4;
      &.active {
        font-weight: bold;
        color: $brand-primary;
      }
      a:hover {
        color: $brand-primary;
      }
    }
    &.m-ul {
      padding: 0 20px;
      .tag-item {
        font-size: 16px;
      }
    }
  }
}
</style>
