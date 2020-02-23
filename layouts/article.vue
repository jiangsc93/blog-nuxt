<template>
  <div class="main">
    <index-header></index-header>
    <div class="page-article" :class="isMobile ? 'mobile': ''">
      <div class="__lt">
        <!-- 导航标签 -->
        <nav v-if="!isMobile">
          <i class="iconfont icon-tag"></i>
          <ul class="nav-ul">
            <li class="nav-li cursor"
              :class="activeIndex===index?'active':''"
              v-for="(item, index) in navList"
              :key="index"
              @click="onChoose(item, index)">{{item}}
            </li>
          </ul>
        </nav>
        <nuxt/>
      </div>
      <div v-if="!isMobile" class="__rt">
        <div class="user">
          <img class="user-logo"
               src="../assets/images/user_logo.png"
               alt="yimapingchuan logo" />
          <p class="text">益码凭川</p>
        </div>
        <!-- <div class="item">
          <h2 class="title">关于我</h2>
          <ul>
            <li v-for="(item, index) in aboutList" :key="index">
              <span>{{item.tit}}</span>
              <span>{{item.cont}}</span>
            </li>
          </ul>
        </div> -->
        <div class="item">
          <h2 class="title">标签云</h2>
          <div class="cont">
            <span class="tag" v-for="(item, index) in tagsList" :key="index">{{item}}</span>
          </div>
        </div>
      </div>
    </div>
    <my-footer></my-footer>
  </div>
</template>
<script>
  import IndexHeader from '~/components/header/indexHeader'
  import MyFooter from '~/components/Footer'
  import Api from '~/utils/api'
  import MyPage from '~/components/PageAction'
  import { mapState, mapMutations } from 'vuex'
  
  export default {
    middleware: 'checkMobile',
    data() {
      return {
        navList: ['全部', '前端', '数据库', '微信', '开发工具', '其他'],
        aboutList: [
          {tit: '网名：', cont:'益码凭川'},
          {tit: '职业：', cont:'前端工程师'},
          {tit: '邮箱：', cont:'jiangsc93@163.com'},
          {tit: '现居：', cont:'重庆'},
        ],
        tagsList: ['javascript', 'html', 'css', 'jquery', 'vue', 'react', 'nodejs', 'nuxt', 'next', 'typescript', '正则表达式', '工具', 'git'],
        time: new Date(),
        articleData: {
          records: 0,
          pageSize: 0,
          currentPage: 0,
        },
        loading: false,
        activeIndex: -1,
        records: 0, // 总数据条数
        pageSize: 0, // 分页数
        currentPage: 0, // 当前页
        articleItemData: {}
      }
    },
    components: {
      MyFooter,
      IndexHeader,
    },
    created() {
      this.navList.map((item,index)=>{
        if (this.$route.params.id === item) {
          this.activeIndex = index
        }
      })
    },
    computed: {
      ...mapState(['isMobile'])
    },
    mounted() {
      // 移动端 rem 单位适配
      if (this.isMobile) {
        // width * 100 / 750 = width / 7.5
        // 1rem = 100px
        let width = window.screen.width;
        window.document.getElementsByTagName("html")[0].style.fontSize =
          width / 7.5 + "px";
      }
    },
    methods: {
      onChoose(item, index) {
        if (index === this.activeIndex) return
        this.activeIndex = index
        location.href = `/article/list/${item}`
      },
    }
  }
</script>
<style lang="scss">
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

.button--green {
  display: inline-block;
  border-radius: 4px;
  border: 1px solid #3b8070;
  color: #3b8070;
  text-decoration: none;
  padding: 10px 30px;
}

.button--green:hover {
  color: #fff;
  background-color: #3b8070;
}

.button--grey {
  display: inline-block;
  border-radius: 4px;
  border: 1px solid #35495e;
  color: #35495e;
  text-decoration: none;
  padding: 10px 30px;
  margin-left: 15px;
}

.button--grey:hover {
  color: #fff;
  background-color: #35495e;
}
.main {
  background-color: #f4f4f4;
}

.page-article {
  max-width: 1200px;
  margin: 80px auto 30px;
  min-height: 100vh;
  display: flex;
  justify-content: center;
  &.mobile {
    margin: 60px auto 20px;
  }
  a {
    color: inherit;
  }
  .__lt {
    // width: 860px;
    min-width: 70%;
    max-width: 95%;
    flex-direction: column;
    nav {
      margin-bottom: 20px;
      padding: 20px;
      background: #fff;
      .icon-tag {
        position: relative;
        top: 3px;
        font-size: 25px;
        color: red;
      }
      .nav-ul, .nav-li {
        display: inline-block;
      }
      .nav-li {
        padding: 0 20px;
        font-size: 17px;
        &.active {
          color: $themeColor;
          font-weight: bold;
        }
        &:hover {
          color: $themeColor;
          font-weight: bold;
        }
      }
    }
  }
  .__rt {
    // width: 330px;
    min-width: 28%;
    margin-left: 10px;
    flex-direction: column;
    border-radius: 4px;
    .item {
      background: #fff;
      padding: 10px 15px 20px;
      margin-bottom: 10px;
      border-radius: 4px;
      .title {
        font-size: 20px;
        font-weight: bold;
        line-height: 22px;
        text-align: center;
        padding: 15px 0;
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
          padding: 4px 10px;
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
        }
      }
    }
  }
}
.user {
  text-align: center;
  padding: 20px 0;
  .text {
    text-align: center;
    font-size: 20px;
    color: #2c3e50;
    font-weight: bold;
  }
  .user-logo {
    width: 180px;
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
