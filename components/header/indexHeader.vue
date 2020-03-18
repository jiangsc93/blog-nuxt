<template>
  <header>
    <div>
      <div v-if="!isMobile" class="pc-header">
        <div class="__lt">
          <div class="logo">
            <img src="../../assets/images/user_logo11.png" alt="">
          </div>
          <!-- <el-menu ref="menu" :default-active="activeIndex" :router="true" class="el-menu-demo" mode="horizontal">
            <el-menu-item
              v-for="(item, index) in navList"
              :key="index"
              :route="item.link"
              :index="index.toString()">{{item.title}}</el-menu-item>
          </el-menu> -->
          <el-menu :default-active="activeIndex"
            active-text-color="#409EFF"
            class="el-menu-demo" mode="horizontal">
            <el-menu-item
              v-for="(item, index) in navList"
              :key="index"
              :index="index.toString()">
              <a :href="item.link">{{item.title}}</a></el-menu-item>
          </el-menu>
        </div>
        <div class="__rt">
          <el-dropdown @command="handleCommand" trigger="click">
            <span class="el-dropdown-link">
              <div class="img" v-if="avatorSrc"><img :src="avatorSrc"></div>
              {{ loginTitle }}<i class="el-icon-arrow-down el-icon--right"></i>
            </span>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item :command="avatorSrc?'customerLogout':'customerLogin'">{{avatorSrc? '游客退出' : '游客登录'}}</el-dropdown-item>
              <el-dropdown-item command="customerRegister" v-if="!avatorSrc">游客注册</el-dropdown-item>
              <el-dropdown-item command="administratorLogin">管理员登录</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </div>
      </div>
      <div v-else class="mobile-header">
        <div class="logo">
          <img src="../../assets/images/user_logo11.png" alt="">
        </div>
        <div class="title">{{ title }}</div>
        <div class="m__rt"><i @click="isShowSide = !isShowSide" class="iconfont icon-zhankai4"></i></div>
      </div>
    </div>
    <div v-show="isShowSide" class="side">
      <ul class="nav">
        <li class="list-item"
          v-for="(item, index) in navList"
          :key="index">
          <a :href="item.link" @click="goLink(item.title)">{{item.title}}</a></li>
          <li class="list-item" @click="handleCommand(avatorSrc ? 'customerLogout' : 'customerLogin')">{{avatorSrc? '退出' : '登录'}}</li>
          <li class="list-item" @click="handleCommand('customerRegister')">注册</li>
      </ul>
    </div>
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
    // watch: {
    //   '$route' (to, from){
      //   _.forEach(this.navList, item => {
      //     if(to.path.includes(item.link.substr(0, 8))) {
      //       this.activeIndex = item.activeIndex;
      //     }
      //   })
        // _.forEach(this.navList, (item)=>{
        //   this.activeIndex = this.$route.path.includes(item.link.substr(0, 8)) ? item.activeIndex : this.activeIndex;
        //   this.title = this.$route.path.includes(item.link.substr(0, 8)) ? item.title : this.title;
        // })
      // }
    // },
    computed: {
      ...mapState(['isMobile']),
      ...mapGetters(['getCustomerInfo']),
    },
    created() {
      _.filter(this.navList, item =>{
        this.activeIndex = this.$route.path.includes(item.link.substr(0, 8)) ? item.activeIndex : this.activeIndex;
        this.title = this.$route.path.includes(item.link.substr(0, 8)) ? item.title : this.title;
      })
    },
    mounted() {
      this.loginTitle = this.getCustomerInfo.customerName || '登录';
      this.avatorSrc = this.getCustomerInfo.avatorSrc;
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
          li {
            padding: 0 40px;
            position: relative;
            text-align: center;
          a {
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
          }
          }
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
        line-height: 60px;
      }
      .m__rt {
        margin: 10px;
        .icon-zhankai4 {
          font-size: 32px;
          padding: 4px 0 4px 4px;
          color:#001529;
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
      ul {
        padding: 0!important;
      }
      .nav {
        .list-item {
          padding: 7px 0;
        }
      }
    }
  }
</style>