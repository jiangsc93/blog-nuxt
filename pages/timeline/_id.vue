<template>
  <div class="page-timeline">
    <Index-header :isFixed="true"></Index-header>
    <Nav></Nav>
    <div class="common-container" ref="timeline">
      <Content
        :articleData="articleData"
        :tagList="tagList"
        :authorList="authorList"
        :hasNextPage="hasNextPage"></Content>
    </div>
  </div>
</template>

<script>
import Api from '~/utils/api'
import { mapState } from 'vuex';
import Nav from '~/components/timeline/nav';
import Content from '~/components/timeline/content';
import IndexHeader from '~/components/header/indexHeader';
export default {
  middleware: 'checkMobile',
  head() {
    return {
      title: '知否 - 一个开发者分享的平台',
      meta: [
        { hid: 'keywords', name: 'keywords', content: 'Html, Css, Javascript, Nuxt, Next,Vue.js,微信小程序,React Native,敏捷开发,Bootstrap,正则表达式,WebGL,Webpack,Docker,MVVM'},
        { hid: 'description', name: 'description', content: '是一个开发者集聚地，分享技术带给我们的收获和快乐' }
      ],
    }
  },
  components: {
    IndexHeader,
    Nav,
    Content
  },
  async asyncData({ params, query }) {
    let reqParams = {
      variables: {
        order: query.order,
        category: params.id,
        tag: query.tag,
        query: '',
        type: '',
        pageSize: 20,
        pageIndex: 1,
      },
    }
    let { list } = await Api.getUserList({order: ''});
    let { articleList, tagList } = await Api.queryByArea(reqParams);
    tagList.unshift('全部');
    let handleTagList = [];
    tagList.forEach((item, index) => {
      let arr = item.split(',');
      handleTagList = handleTagList.concat(arr);
    })
    return { 
      authorList: list,
      articleData: articleList, 
      tagList: handleTagList
      };
  },
  data() {
    return {
      articleData: [],
      tagList: [],
      authorList: [],
      pageIndex: 1,
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
      let inner = this.$refs.timeline;
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
        variables: {
          order: this.$route.query.order,
          category: this.$route.params.id,
          tag: this.$route.query.tag,
          query: '',
          type: '',
          pageSize: 20,
          pageIndex: this.pageIndex,
        },
      }
      Api.queryByArea(reqParams)
        .then(res => {
          if (res.articleList) {
            let articleData = res.articleList;
            let tagList = res.tagList;
            tagList.unshift('全部');
            this.tagList = tagList;
            this.articleData = this.articleData.concat(articleData);
            this.hasNextPage = res.hasNextPage;
            this.queryStatus = true;
            // tagList.unshift('全部');
            // let handleTagList = [];
            // tagList.forEach((item, index) => {
            //   let arr = item.split(',');
            //   handleTagList = handleTagList.concat(arr);
            // })
            // this.tagList = handleTagList;
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
.page-bottom {
  padding: 20px;
  text-align: center;
}
</style>
