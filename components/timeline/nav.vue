<template>
  <div :class="isFixed ? 'page-timeline-nav fixed-top' : 'page-timeline-nav'">
    <ul class="nav-ul" id="mobile-ul" :class="{'mobile-ul': isMobile}">
      <li class="tag-item" :class="{ 'active': isActive(item.eng) }" v-for="(item, index) in categoryList" :key="index">
        <a :href="`/timeline/${item.eng}`">
          {{item.name}}
        </a>
      </li>
    </ul>
  </div>
</template>

<script>
import Api from '~/utils/api'
import { mapState } from 'vuex';

export default {
  data() {
    return {
      list: [
        {
          name: '推荐',
          eng: 'recommend'
        },
        // 后期添加
        // {
        //   name: '关注',
        //   eng: 'follow'
        // },
      ], 
      list2: [
        {
          name: '前端',
          eng: 'frontend'
        },
        {
          name: '后端',
          eng: 'backend'
        },
        {
          name: 'Android',
          eng: 'android'
        },
        {
          name: 'iOS',
          eng: 'ios'
        },
        {
          name: '运维',
          eng: 'operation'
        },
        {
          name: '工具',
          eng: 'tool'
        },
        {
          name: '其他',
          eng: 'other'
        },
      ],
      isFixed: false
    }
  },
  computed: {
    ...mapState(['isMobile','showHeader']),
    categoryList() {
      return this.list.concat(this.list2);
    }
  },
  mounted() {
    window.addEventListener('scroll', () => {
      let scroll = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop;
      if (scroll > 100) {
        this.isFixed = true;
        this.$store.commit('setHeaderIsShow', false)
      } else {
        this.isFixed = false;
        this.$store.commit('setHeaderIsShow', true)
      }
    })
    if (this.isMobile) {
      this.categoryList.forEach((navitem, index) => {
        if (navitem.eng === this.$route.params.id) {
          document.getElementById('mobile-ul').scrollLeft += 62 * index;
        }
      });
    }
  },
  methods: {
    isActive(val) {
      if (this.$route.params.id && this.$route.params.id === val) {
        return true;
      } else if (!this.$route.params.id && val === 'recommend') {
        return true;
      } else {
        return false;
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.page-timeline-nav {
  box-sizing: border-box;
  width: 100%;
  background: #fff;
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
      line-height: 50px;
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
    &.mobile-ul {
      margin: 0;
      padding: 0 20px;
      width: 100%;
      display: block;
      white-space: nowrap;
      overflow-x: auto;
      .tag-item {
        line-height: 50px;
        font-size: 16px;
        padding-right: 30px;
      }
    }
  }
}
</style>
