<template>
  <div class="page-notification">
    <Index-header :isFixed="true"></Index-header>
    <Nav :navList="navList" :linkUrl="`/notification/${$store.state.userId}`" :queryFirstPro="'type'"></Nav>
    <div class="common-container content" ref="notification">
      <!-- 文章 -->
      <div class="__lt" :class="{'m__lt': isMobile}">
        <NotificationList :notificationList="notificationList"></NotificationList>
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
import ArticleItem from '~/components/user/articleItem';
import NotificationList from '~/components/notification/item';
export default {
  middleware: 'checkMobile',
  head() {
    return {
      title: `通知`,
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
    ArticleItem,
    NotificationList
  },
  async asyncData({ params, query, store }) {
    let reqParams = {
      type: query.type,
      userId: params.id,
    }
    let { list } =  await Api.getUserNotification(reqParams);
    return { notificationList: list };
  },
  data() {
    return {
      notificationList: [],
      pageIndex: 0,
      hasNextPage: true,
      queryStatus: true,
      navList: [
        {
          name: '用户消息',
          eng: 'user'
        },
        {
          name: '系统消息',
          eng: 'system'
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
      let inner = this.$refs.notification;
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
.page-notification {
  .content {
    display: flex;
    justify-content: flex-start;
    .__lt {
      width: 72%;
      margin: 124px 0 50px;
      &.m__lt {
        width: 100%;
      }
    }

  }
}
</style>
