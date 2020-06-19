<template>
  <div class="page-authors">
    <Index-header :isFixed="true"></Index-header>
    <div class="common-container content" ref="authors">
      <div class="__lt" :class="{'m__lt': isMobile}">
        <AuthorsItem :authorsList="authorsList"></AuthorsItem>
      </div>
    </div>
  </div>
</template>

<script>
import Api from '~/utils/api'
import { mapState } from 'vuex';
import IndexHeader from '~/components/header/indexHeader';
import AuthorsItem from '~/components/authors/authorsItem';
export default {
  middleware: 'checkMobile',
  head() {
    return {
      title: '作者列表',
      meta: [
        { hid: 'keywords', name: 'keywords', content: 'Html, Css, Javascript, Nuxt, Next,Vue.js,微信小程序,React Native,敏捷开发,Bootstrap,正则表达式,WebGL,Webpack,Docker,MVVM'},
        { hid: 'description', name: 'description', content: '是一个开发者集聚地，分享技术带给我们的收获和快乐' }
      ],
    }
  },
  components: {
    IndexHeader,
    AuthorsItem
  },
  async asyncData({ params, query, store }) {
    let reqParams = {
      // category: params.id || 'recommend',
      userId: store.state.userId,
      pageIndex: 1,
      pageSize: 10,
    }
    let { list } = (await Api.getUserList(reqParams));
    
    return { authorsList: list };
  },
  data() {
    return {
      authorsList: [],
      pageIndex: 0,
      hasNextPage: true,
      queryStatus: true
    }
  },
  computed: {
    ...mapState(['isMobile'])
  },
  mounted() {
    window.addEventListener('scroll', () => {
      let scroll = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop;
      let inner = this.$refs.authors;
      let innerHeight = window.innerHeight;
      if (scroll + innerHeight >= inner.clientHeight && this.hasNextPage && this.queryStatus) {
        this.queryStatus = false;
        this.pageIndex += 1;
        this.queryByArea();
      }
    })
  },
  methods: {
    queryByArea() {
      let reqParams = {
        userId: this.$store.state.userId,
        pageSize: 20,
        pageIndex: this.pageIndex,
      }
      Api.getUserList(reqParams)
        .then(res => {
          if (res.list) {
            let authorsList = res.list;
            this.tagList = tagList;
            this.authorsList = authorsList;
            this.hasNextPage = res.hasNextPage;
            this.queryStatus = true;
            if (!res.hasNextPage) {
              this.queryStatus = false;
              this.overText = '到底啦~';
            }
          }
      }).catch (err => {
        console.log('报错了啊')
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.page-authors {
  .content {
    display: flex;
    justify-content: flex-start;
    .__lt {
      width: 72%;
      margin: 84px 0 50px;
      &.m__lt {
        width: 100%;
        margin: 74px 0 50px;
      }
    }

  }
}
</style>
