<template>
  <div class="page-search">
    <Index-header :isFixed="true"></Index-header>
    <Nav :navList="navList" :linkUrl="'/search'" :queryFirstPro="'type'" :queryObject="{query: $route.query.query}"></Nav>
    <div class="common-container content" ref="search">
      <!-- 文章 -->
      <div class="__lt" :class="{'m__lt': isMobile}" v-if="$route.query.type === 'article'">
        <ArticelList :articleData="list" v-if="list.length > 0"></ArticelList>
        <div v-else class="no-data">
          <div class="no-data-icon"><i class="iconfont icon-wushuju"></i></div>
          <div class="no-data-text">暂无数据！</div>
        </div>
      </div>
      <!-- 作者 -->
      <div class="__lt" :class="{'m__lt': isMobile}" v-if="$route.query.type === 'author'">
        <AuthorsItem :authorsList="list"></AuthorsItem>
      </div>
    </div>
  </div>
</template>

<script>
import Api from '~/utils/api'
import { mapState } from 'vuex';
import Nav from '~/components/common/nav';
import IndexHeader from '~/components/header/indexHeader';
import AuthorsItem from '~/components/authors/authorsItem';
import ArticelList from '~/components/common/articleList';
export default {
  middleware: 'checkMobile',
  head() {
    return {
      title: `搜索`,
      meta: [
        { hid: 'keywords', name: 'keywords', content: 'Html, Css, Javascript, Nuxt, Next,Vue.js,微信小程序,React Native,敏捷开发,Bootstrap,正则表达式,WebGL,Webpack,Docker,MVVM'},
        { hid: 'description', name: 'description', content: '是一个开发者集聚地，分享技术带给我们的收获和快乐' }
      ],
    }
  },
  components: {
    IndexHeader,
    Nav,
    AuthorsItem,
    ArticelList,
  },
  async asyncData({ params, query, store }) {
    let reqParams = {
      type: query.type,
      keywords: query.query,
      userId: store.state.userId
    }
    let { list } =  await Api.search(reqParams);
    return { list };
  },
  data() {
    return {
      list: [],
      pageIndex: 0,
      hasNextPage: true,
      queryStatus: true,
      navList: [
        {
          name: '文章',
          eng: 'article'
        },
        {
          name: '作者',
          eng: 'author'
        },
      ],
    }
  },
  computed: {
    ...mapState(['isMobile']),
   
  },
  mounted() {
    window.addEventListener('scroll', () => {
      let scroll = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop;
      let inner = this.$refs.search;
      let innerHeight = window.innerHeight;
      if (scroll + innerHeight >= inner.clientHeight && this.hasNextPage && this.queryStatus) {
        this.queryStatus = false;
        this.pageIndex += 1;
      }
    })
  },
  methods: {
  }
}
</script>

<style lang="scss" scoped>
.page-search {
  .content {
    display: flex;
    justify-content: flex-start;
    .__lt {
      width: 72%;
      margin: 124px 0 50px;
      &.m__lt {
        width: 100%;
      }
      .no-data {
        padding: 20px;
        text-align: center;
        background: #fff;
        .no-data-icon {
          margin-bottom: 5px;
          .iconfont {
            font-size: 40px;
            color: #999;
          }
        }
      }
    }

  }
}
</style>
