<template>
  <header>
      <div class="pc-header">
        <div class="__lt">
          <div class="logo">
            <img :style="backgColor" src="../../assets/images/user_logo11.png" alt="">
          </div>
          <el-menu :default-active="activeIndex" :router="true" class="el-menu-demo" mode="horizontal">
            <el-menu-item
              :route="item.link"
              :index="index.toString()"
              v-for="(item, index) in navList"
              :key="index">
              {{item.title}}
              </el-menu-item>
          </el-menu>
        </div>
        <div class="__rt">
          <!-- <el-menu :default-active="activeIndex" class="el-menu-demo" mode="horizontal" @select="handleSelect"> -->
          <el-dropdown @command="handleCommand" trigger="click">
            <span class="el-dropdown-link">
              <div class="img" v-if="avatorSrc"><img :src="avatorSrc"></div>
              {{ loginTitle }}<i class="el-icon-arrow-down el-icon--right"></i>
            </span>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item :command="avatorSrc?'customerLogout':'customerLogin'">{{avatorSrc? '游客退出' : '游客登录'}}</el-dropdown-item>
              <el-dropdown-item command="customerRegister">游客注册</el-dropdown-item>
              <el-dropdown-item command="administratorLogin">管理员登录</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </div>
      </div>
      <!-- <div v-else class="mobile-header">
        <div class="logo">
          <img :style="backgColor" src="./images/ympc.png" alt="">
        </div>
        <div class="title">{{ title }}</div>
        <div class="__rt"><i @click="isShowSide = true" class="iconfont icon-zhankai1"></i></div>
      </div>
      <div v-show="isShowSide" class="side">
        <ul class="nav">
          <li class="list-item"
            v-for="(item, index) in navList"
            :key="index"
            :class="activeIndex === index ? 'active' : ''">
            <a :href="item.link" @click="goLink(item.title)">{{item.title}}</a></li>
        </ul>
      </div> -->
      <LoginRegister
        :visible="visible"
        :handleFlag="handleFlag"
        :isMobile="isMobile"
        @feedback="feedback"></LoginRegister>
  </header>
</template>

<script>
  import { Menu, MenuItem } from 'element-ui' 
  import { mapState, mapGetters } from 'vuex'
  import _ from 'lodash'
  import LoginRegister from '../common/loginRegister'
  import Cookie from 'js-cookie'
  export default {

    data(){
      return {
        title: '文章',
        isShowSide: false,
        navList: [
          {
            title: '首页',
            link: '/',
            activeIndex: '0'
          },
          {
            title: '文章',
            link: '/article/list/全部',
            activeIndex: '1'
          },
          {
            title: '归档',
            link: '/archive',
            activeIndex: '2'
          },
          {
            title: '项目',
            link: '/project',
            activeIndex: '3'
          },
          {
            title: '历程',
            link: '/experience',
            activeIndex: '4'
          },
          {
            title: '留言',
            link: '/message',
            activeIndex: '5'
          },
          // {
          //   title: '关于',
          //   link: '/about',
          //   activeIndex: '6'
          // }
        ],
        activeIndex: '',
        loginTitle: '登录',
        visible: false,
        handleFlag: 'login',
        avatorSrc: ''
      }
    },
    components: {
      Menu,
      MenuItem,
      LoginRegister
    },
    watch: {
      // '$route' (to, from){
      //   _.forEach(this.navList, item => {
      //     if(to.path.includes(item.link.substr(0, 8))) {
      //       this.activeIndex = item.activeIndex;
      //     }
      //   })
        // _.filter(this.navList, (item)=>{
        // this.activeIndex = this.$route.path.includes(item.link.substr(0, 8)) ? item.activeIndex : this.activeIndex;
        // this.title = this.$route.path.includes(item.link.substr(0, 8)) ? item.title : this.title;
      // })
      // }
    },
    computed: {
      ...mapState(['isMobile']),
      ...mapGetters(['getCustomerInfo']),
      backgColor() {
        return `background:${this.randomColor()};`
      }
    },
    mounted() {
      // 路由识别菜单状态
      _.filter(this.navList, (item)=>{
        this.activeIndex = this.$route.path.includes(item.link.substr(0, 8)) ? item.activeIndex : this.activeIndex;
        this.title = this.$route.path.includes(item.link.substr(0, 8)) ? item.title : this.title;
      })
      this.loginTitle = this.getCustomerInfo.customerName || '登录';
      this.avatorSrc = this.getCustomerInfo.avatorSrc;
      // this.avatorSrc = this.getCustomerInfo()
      // if (this.isMobile) {
        // width * 100 / 750 = width / 7.5
        // 1rem = 100px
      //   let width = window.screen.width;
      //   window.document.getElementsByTagName("html")[0].style.fontSize =
      //     width / 7.5 + "px";
      // }
    },
    methods: {
      feedback(val) {
        this.visible = val;
      },
      handleCommand(command) {
        switch(command){
          case 'customerLogin':
            this.visible = true;
            this.handleFlag = 'login';
            return;
          case 'customerLogout':
            Cookie.remove('avatorSrc');
            Cookie.remove('customerName');
            this.loginTitle = '登录';
            this.avatorSrc = '';
            return;
          case 'customerRegister':
            this.visible = true;
            this.handleFlag = 'register';
            return;
          case 'administratorLogin':
            window.location.href = '/admin/login/'
            return;
        }
      },
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
    
  .el-dropdown-link {
    outline: none;
    cursor: pointer;
  }
  .el-menu.el-menu--horizontal {
    border-bottom: none;
  }
  .el-menu--horizontal>.el-menu-item.is-active {
    color: #409EFF;
  }
  .el-menu--horizontal>.el-menu-item {
    color: #303133;
  }
  .el-menu-item {
    font-size: 16px;
    padding: 0 24px;
  }
  header {
    width: 100%;
    position: fixed;
    top: 0;
    left: 0;
    z-index: 1000;
    background: #fff;
    color: #000;
    // padding-top: 10px;
    border-bottom: 1px solid #eee;
    .pc-header {
      display: flex;
      justify-content: space-between;
      height: 60px;
      line-height: 60px;
      max-width: 1200px;
      margin: 0 auto;
      .__lt {
        .el-menu-demo {
          display: inline-block;
        }
        .logo {
          display: inline-block;
          width: 55px;
          height: 55px;
          position: relative;
          top: -3px;
          margin-right: 30px;
          img {
            width: 100%;
            height: 100%;
            border-radius: 50%;
          }
        }
      }
      .__rt {
        vertical-align: top;
        margin-left: 30px;
        font-size: 18px!important;
        .img {
          display: inline-block;
          width: 30px;
          height: 30px;
          position: relative;
          top: 10px;
          right: 3px;;
          img {
            border: 1px solid #ddd;
            border-radius: 50%;
            width: 100%;
            height: 100%;
          }
        }
      }
    }
    .mobile-header {
      display: flex;
      justify-content: space-between;
      .logo {
        width: 40px;
        height: 40px;
        margin: 10px;
        img {
          width: 100%;
          height: 100%;
          border-radius: 50%;
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