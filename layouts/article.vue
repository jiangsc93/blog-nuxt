<template>
  <div class="main">
    <index-header></index-header>
    <div class="page-article">
      <div class="wrap">
        <div :class="isMobile?'__lt_m' : '__lt'">
          <nuxt/>
        </div>
        <div :class="isMobile? '__rt_m article_rt':'__rt article_rt'">
          <div class="user" v-if="!isMobile">
            <img class="user-logo"
                src="../assets/images/user_logo.png"
                alt="yimapingchuan logo" />
            <p class="text">益码凭川</p>
          </div>
          <div class="item">
            <h2 class="title"><span>标</span><span style="color: #409EFF;">签</span>云</h2>
            <div class="cont">
              <span class="tag" v-for="(item, index) in tagsList" :key="index">
                <a :href="`/article/list/${item.tag}`" :alt="item.tag" :title="`查看${item.tag}相关文章`">{{item.tag}}</a>
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
    <index-footer></index-footer>
  </div>
</template>
<script>
  import IndexHeader from '~/components/header/indexHeader'
  import IndexFooter from '~/components/footer/footer'
  import Api from '~/utils/api'
  import MyPage from '~/components/PageAction'
  import { mapState, mapGetters } from 'vuex'
  
  export default {
    middleware: 'getTagList',
    data() {
      return {
        // tagTitle: '',
        showTagTitle: true,
        isArticleDetail: false,
        // tag: {},
        tagsList: [],
        time: new Date(),
        // articleData: {
        //   records: 0,
        //   pageSize: 0,
        //   currentPage: 0,
        // },
        loading: false,
        activeIndex: -1,
        records: 0, // 总数据条数
        pageSize: 0, // 分页数
        currentPage: 0, // 当前页
        articleItemData: {},
        params: {}
      }
    },
    components: {
      IndexHeader,
      IndexFooter,
    },
    computed: {
      ...mapState(['isMobile']),
      ...mapGetters(['getTagsList']),
    },
    mounted() { 
      this.getTagList();
    },
    methods: {
      getTagList() {
        Api.getTagList()
          .then(res => {
            if (res.status === 200 && res.data.data && res.data.data.list) {
              this.tagsList = res.data.data.list
            }
          }, err => {
            console.log('报错啦', err)
          })
      },
    }
  }
</script>
<style lang="scss" scoped>
html {
  font-family: "Source Sans Pro", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
  font-size: 16px;
  word-spacing: 1px;
  -ms-text-size-adjust: 100%;
  -webkit-text-size-adjust: 100%;
  -moz-osx-font-smoothing: grayscale;
  -webkit-font-smoothing: antialiased;
  box-sizing: border-box;
}

*, *:before, *:after {
  box-sizing: border-box;
  margin: 0;
}

.page-article {
  max-width: 1200px;
  margin: 60px auto 0;
  // min-height: 100vh;
  position: relative;
  display: flex;
  &.mobile {
    margin: 60px auto 20px;
  }
  .wrap {
    width: 100%;
    a {
      color: inherit;
    }
    .__lt {
      min-height: 80vh;
      float: left;
      width: 65%;
    }
    .__lt_m {
      padding: 0 12px;
    }
    .__rt_m {
      display: block;
      width: 100%;
    }
    .__rt {
      display: block;
      float: right;
      width: 25%;
      position: sticky;
      top: 100px;
      right: 0;
      width: 350px;
      margin-left: 30px;
      border-radius: 4px;
    }
    .article_rt {
      .item {
        background: #fff;
        padding: 10px 15px 20px;
        margin-bottom: 10px;
        border-radius: 4px;
        position: relative;
        .title {
          font-size: 17px;
          font-weight: bold;
          line-height: 22px;
          text-align: center;
          padding: 10px 0 15px;
          border-bottom: 1px solid #eaeaea;
        }
        ul {
          margin: 10px 0;
          font-size: 13px;
          li {
            line-height: 22px;
          }
        }
        .cont {
          .tag {
            display: inline-block;
            margin: 10px 10px 0 0;
            border-radius: 4px;
            border: 1px solid #ccc;
            font-size: 13px;
            color: #666;
            cursor: pointer;
            &:hover {
              color: #fff;
              background: #000;
              border-color: #000;
            }
            a {
              display: inline-block;
              padding: 4px 10px 4px;
            }
          }
        }
      }
    }
  }
}
.user {
  text-align: center;
  padding: 20px 0;
  .text {
    margin-top: 6px;
    text-align: center;
    font-size: 18px;
    color: #2c3e50;
    font-weight: bold;
  }
  .user-logo {
    width: 150px;
    border-radius: 50%;
    animation: mylogo 3s;
    -moz-animation: mylogo 3s; /* Firefox */
    -webkit-animation: mylogo 3s; /* Safari and Chrome */
    -o-animation: mylogo 3s; /* Opera */
    animation-iteration-count: infinite;
  }
}
@keyframes mylogo {
  0% {
    transform: rotate(0deg) scale(0.8, 0.8);
    opacity: 1;
  }
  25% {
    transform: rotate(0deg) scale(1, 1);
    opacity: 0.8;
  }
  100% {
    transform: rotate(0deg) scale(0.8, 0.8);
    opacity: 1;
  }
}

@-moz-keyframes mylogo {
  0% {
    transform: rotate(0deg) scale(0.8, 0.8);
    opacity: 1;
  }
  25% {
    transform: rotate(0deg) scale(1, 1);
    opacity: 0.8;
  }
  100% {
    transform: rotate(0deg) scale(0.8, 0.8);
    opacity: 1;
  }
}

@-webkit-keyframes mylogo {
  0% {
    transform: rotate(0deg) scale(0.8, 0.8);
    opacity: 1;
  }
  25% {
    transform: rotate(0deg) scale(1, 1);
    opacity: 0.8;
  }
  100% {
    transform: rotate(0deg) scale(0.8, 0.8);
    opacity: 1;
  }
}

@-o-keyframes mylogo {
  0% {
    transform: rotate(0deg) scale(0.8, 0.8);
    opacity: 1;
  }
  25% {
    transform: rotate(0deg) scale(1, 1);
    opacity: 0.8;
  }
  100% {
    transform: rotate(0deg) scale(0.8, 0.8);
    opacity: 1;
  }
}
</style>
