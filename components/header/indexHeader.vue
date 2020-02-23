<template>
  <header>
      <div v-if="!isMobile" class="pc-header">
        <div class="logo">
          <img :style="backgColor" src="./images/ympc.png" alt="">
        </div>
        <div class="__rt">
          <ul class="nav">
            <li class="list-item"
              v-for="(item, index) in navList" :key="index">
              <a :class="activeIndex === index ? 'active' : ''" :href="item.link">{{item.title}}</a></li>
          </ul>
          <nuxt-link to="/login" class="login">登录</nuxt-link>
        </div>
      </div>
      <div v-else class="mobile-header">
        <div class="logo">
          <img :style="backgColor" src="./images/ympc.png" alt="">
        </div>
        <div class="title">{{ title }}</div>
        <div class="__rt"><i @click="isShowSide = true" class="iconfont icon-zhankai1"></i></div>
      </div>
      <div v-show="isShowSide" class="side">
        <ul class="nav">
          <li class="list-item"
            v-for="(item, index) in navList" :key="index">
            <a :class="activeIndex === index ? 'active' : ''" :href="item.link" @click="goLink(item.title)">{{item.title}}</a></li>
        </ul>
      </div>
  </header>
</template>

<script>
  import { mapState } from 'vuex'
  import _ from 'lodash'
  export default {

    data(){
      return {
        title: '文章',
        isShowSide: false,
        navList: [
          {
            title: '首页',
            link: '/',
            activeIndex: 0
          },
          {
            title: '文章',
            link: '/article/list/全部',
            activeIndex: 1
          },
          {
            title: '关于',
            link: '/about',
            activeIndex: 2
          },
        ],
        activeIndex: 0
      }
    },
    created() {
      _.filter(this.navList, (item)=>{
        this.activeIndex = this.$route.path.includes(item.link.substr(0, 8)) ? item.activeIndex : this.activeIndex;
        this.title = this.$route.path.includes(item.link.substr(0, 8)) ? item.title : this.title;
      })
    },
    computed: {
      ...mapState(['isMobile']),
      backgColor() {
        return `background:${this.randomColor()};`
      }
    },
    mounted() {
      if (this.isMobile) {
        // width * 100 / 750 = width / 7.5
        // 1rem = 100px
        let width = window.screen.width;
        window.document.getElementsByTagName("html")[0].style.fontSize =
          width / 7.5 + "px";
      }
    },
    methods: {
      randomColor() { // rgb颜色随机
        let r = Math.floor(Math.random()*256);
        let g = Math.floor(Math.random()*256);
        let b = Math.floor(Math.random()*256);
        var rgba = 'rgba('+r+','+g+','+b+', .6)';
        // let color = '#'+r.toString(16)+g.toString(16)+b.toString(16); // 转成16进制
        return rgba;
      },
      goLink(val) {
        this.title = val;
      }
    }
  }
</script>

<style scoped lang="scss">
  header {
    width: 100%;
    position: fixed;
    top: 0;
    left: 0;
    z-index: 1000;
    background: #222;
    .pc-header {
      height: 80px;
      line-height: 80px;
      padding: 0 25px;
      max-width: 1200px;
      margin: 0 auto;
      display: flex;
      justify-content: space-between;
      .logo {
        width: 130px;
        height: 60px;
        margin-top: 10px;
        img {
          width: 100%;
          height: 100%;
          border-radius: 2px;
        }
      }
      .__rt {
        .nav {
          display: inline-block;
          .list-item {
            display: inline-block;
            cursor: pointer;
            a {
              display: inline-block;
              width: 100px;
              height: 40px;
              line-height: 40px;
              margin-left: 10px;
              border-radius: 4px;
              text-align: center;
              color: #fff;
              font-size: 16px;
              &.active {
                background: #404040;
              }
              &:hover {
                background: #404040;
              }
            }
          }
        }
        .login {
          display: inline-block;
          color: #fff!important;
          margin-left: 100px;
        }
      }
    }
    .mobile-header {
      display: flex;
      justify-content: space-between;
      .logo {
        width: 70px;
        height: 40px;
        margin: 10px;
        img {
          width: 100%;
          height: 100%;
          border-radius: 2px;
        }
      }
      .title {
        font-size: 20px;
        color: #fff;
        line-height: 60px;
      }
      .__rt {
        .icon-zhankai1 {
          font-size: 40px;
          margin-right: 10px;
          position: relative;
          top: 5px;
          color:#409eff;
        }
      }
    }
    .side {
      width: 20%;
      position: fixed;
      top: 60px;
      right: 0;
      text-align: center;
      background: #fff;
      border: 1px solid #eee;
      .nav {
        .list-item {
          padding: 5px 0;
        }
      }
    }
  }
</style>