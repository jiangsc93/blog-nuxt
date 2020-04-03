<template>
  <header id="index-header">
    <div>
      <div v-if="!isMobile" class="pc-header">
        <div class="__lt">
          <div class="logo">
            <img src="../../assets/images/user_logo11.png" alt="">
          </div>
        </div>
        <div class="__rt">
          <div class="search-wrap">
            <i class="iconfont icon-search"></i>
            <el-input class="search-input" size="medium" v-model="keywords" clearable @input="onSearch"></el-input>
            <div class="search" v-show="showSearchList && keywords">
              <ul v-if="searchList.length > 0">
                <li v-for="(item, index) in searchList"
                  :key="index" @click="articleLink(item)">{{item.title}}</li>
              </ul>
              <div v-else class="no-data">没有找到相关文章！</div>
            </div>
          </div>
          <el-menu :default-active="activeIndex"
            active-text-color="#46bd87"
            class="el-menu-demo" mode="horizontal">
            <el-menu-item
              v-for="(item, index) in navList"
              :key="index"
              :index="index.toString()">
              <a :href="item.link">{{item.title}}</a></el-menu-item>
          </el-menu>
          <el-dropdown class="login-wrap" @command="handleCommand" trigger="click">
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
        <div class="m__lt"><i @click="isShowSide = !isShowSide" class="iconfont icon-caidan-zhankai"></i><span class="name">益码凭川</span></div>
        <div :class="isShowInput ? 'show-input' : 'search-wrap'" @click="$refs.input.focus()">
          <i class="iconfont icon-search"></i>
          <el-input
            class="search-input"
            size="medium"
            ref="input"
            v-model="keywords"
            clearable
            @input="onSearch"
            @focus="isShowInput = true"
            @blur="onBlur">
          </el-input>
        </div>
      </div>
    </div>
    <div class="m-search" v-show="isMobile && showSearchList">
      <ul v-if="searchList.length > 0">
        <li class="m-li" v-for="(item, index) in searchList"
          :key="index"
          @click="articleLink(item)">{{item.title}}</li>
      </ul>
      <div v-else class="no-data">没有找到相关文章！</div>
    </div>
    <div :class="isShowSide ? 'side side-in' : 'side side-out' ">
      <el-menu :default-active="activeIndex"
        active-text-color="#46bd87"
        class="el-menu-demo m-el-menu" mode="vertical">
        <el-menu-item
          v-for="(item, index) in navList"
          :key="index"
          :index="index.toString()">
          <a :href="item.link">{{item.title}}</a></el-menu-item>
      </el-menu>
      <ul class="nav">
        <!-- <li class="list-item"
          v-for="(item, index) in navList"
          :key="index">
          <a :href="item.link" @click="goLink(item.title)">{{item.title}}</a></li> -->
          
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
  import Cookie from 'js-cookie'
  import _ from 'lodash'
  import LoginRegister from '../common/loginRegister'
  import Api from '~/utils/api'
  import { Throttle } from '~/utils/utils'
  let throttle = Throttle();
  export default {
    data(){
      return {
        title: '文章',
        isShowSide: false,
        showSearchList: false,
        isShowInput: false,
        keywords: '',
        searchList: [],
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
    computed: {
      ...mapState(['isMobile', 'httpDomain']),
      ...mapGetters(['getCustomerInfo']),
    },
    watch: {
       isShowInput() {
         if (this.isShowInput) {
           this.$refs.input.focus();
         }
       }
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
      document.addEventListener('click', (e) => {
        if (this.isShowSide && !(e.target).closest('.side, .icon-caidan-zhankai')) {
          this.isShowSide = false;
        }
        if (this.showSearchList && !(e.target).closest('.m-li, .show-input, .show-wrap')) {
          this.showSearchList = false;
        }
      })
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
      },
      onBlur() {
        this.isShowInput = false;
        this.keywords = '';
      },
      onSearch() {
        // 3秒节流
        throttle(this.search, 3000);
      },
      search() {
        Api.search({keywords: this.keywords}).then((res => {
          if (res.status === 200 && res.data && res.data.data.list) {
            this.searchList = res.data.data.list;
            this.showSearchList = true;
          } else {
            this.$message({
              message: "没有找到！",
              type: "error"
            })
          }
        })).catch(err => {
          this.$message({
            message: "网络连接失败",
            type: "error"
          })
        })

      },
      articleLink(item) {
        location.href = `${this.httpDomain}/article/${item._id}`;
      }
    }
  }
</script>

<style lang="scss">
  header .pc-header .__rt .search-wrap .el-input .el-input__inner {
    padding-left: 36px;
    border-radius: 18px;
    &:focus {
      border-color: #46bd87;
    }
  }
  header .mobile-header .show-input .el-input .el-input__inner {
    padding-left: 36px;
    border-radius: 18px;
    &:focus {
      border-color: #46bd87;
    }
  }
  header .mobile-header .search-wrap .el-input .el-input__inner {
    padding-left: 36px;
    border: none;
  }
</style>

<style scoped lang="scss">
    
  .el-dropdown-link {
    outline: none;
    cursor: pointer;
  }
  .el-menu.el-menu--horizontal {
    border-bottom: none;
  }
  .el-menu--horizontal>.el-menu-item {
    color: #303133;
  }
  .el-menu-item {
    font-size: 16px;
    padding: 0 24px;
  }
  .m-el-menu>.el-menu-item {
    text-align: left;
    a {
      color: #505d6b;
    }
    &.is-active>a {
      color: #42b983;
      font-weight: bold;
    }
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
        .logo {
          display: inline-block;
          width: 55px;
          height: 55px;
          position: relative;
          top: 2px;
          img {
            width: 100%;
            height: 100%;
            border-radius: 50%;
          }
        }
      }
      .__rt {
        // margin-left: 30px;
        font-size: 18px!important;
        .search-wrap {
          display: inline-block;
          position: relative;
          .icon-search {
            position: absolute;
            top: 3px;
            left: 10px;
            color: #748597;
            font-size: 23px;
            z-index: 1000;
          }
          .search {
            width: 250px;
            max-height: 195px;
            overflow-y: auto;
            position: absolute;
            top: 55px;
            left: 0;
            border: 1px solid #cfd4db;
            border-radius: 10px;
            padding: 10px;
            color: #748597;
            background: #fff;
            font-size: 14px;
            z-index: 1000;
            .no-data {
              height: 35px;
              line-height: 35px;
              text-align: center;
            }
            li {
              box-sizing: border-box;
              width: 100%;
              height: 35px;
              line-height: 35px;
              padding: 0 6px;
              border-radius: 5px;
              font-weight: 600;
              overflow: hidden;
              text-overflow: ellipsis;
              white-space: nowrap;
              &:hover {
                cursor: pointer;
                background: #f2f2f2;
                color: #42b983;
              }
            }
            ul {
              padding: 0;
              margin: 0;
            }
          }
        }
        .search-wrap .el-input {
          display: inline-block;
          width: 200px;
          margin-right: 10px;
        }
        .el-menu-demo {
          vertical-align: top;
          display: inline-block;
          margin-right: 30px;
          li {
            padding: 0 30px;
            position: relative;
            text-align: center;
            &:hover {
              color: rgb(70, 189, 135);
            }
            &.is-active {
              font-weight: bold;
            }
            a {
              position: absolute;
              top: 0;
              left: 0;
              right: 0;
              bottom: 0;
            }
          }
        }
        .login-wrap {
          width: 110px;
        }
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
      // height: 60px;
      .search-wrap {
        display: inline-block;
        position: relative;
        padding-top: 10px;
        .icon-search {
          position: absolute;
          top: 5px;
          left: 10px;
          color: #748597;
          font-size: 23px;
          z-index: 1000;
        }
      }
      .search-wrap .el-input {
        display: inline-block;
        width: 40px;
        margin-right: 10px;
        transition: width 0.2s ease-in-out;
      }
      .show-input {
        display: inline-block;
        position: relative;
        padding-top: 10px;
        .icon-search {
          position: absolute;
          top: 5px;
          left: 10px;
          color: #748597;
          font-size: 23px;
          z-index: 1000;
        }
      }
      .show-input .el-input {
        display: inline-block;
        width: 170px;
        margin-right: 10px;
        transition: width 0.3s ease-in-out;
      }
      .icon-search {
        display: inline-block;
        font-size: 33px;
        padding: 12px 6px 0 0;
        color:#001529;
      }
      .title {
        font-size: 20px;
        line-height: 60px;
      }
      .m__lt {
        overflow: hidden;
        padding-bottom: 10px;
        .icon-caidan-zhankai {
          display: inline-block;
          font-size: 21px;
          padding: 14px 0 8px 12px;
          color:#001529;
        }
        .name {
          display: inline-block;
          padding-left: 15px;
          font-size: 20px;
          font-weight: 600;
        }
      }
    }
    .m-search {
      position: absolute;
      top: 53px;
      left: 50%;
      transform: translateX(-50%);
      width: 80%;
      margin: 0 auto;
      max-height: 195px;
      overflow-y: auto;
      border: 1px solid #cfd4db;
      border-radius: 10px;
      padding: 10px;
      color: #748597;
      background: #fff;
      font-size: 14px;
      z-index: 1000;
      .no-data {
        height: 35px;
        line-height: 35px;
        text-align: center;
      }
      li {
        box-sizing: border-box;
        width: 100%;
        height: 35px;
        line-height: 35px;
        padding: 0 16px;
        border-radius: 5px;
        font-weight: 600;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        &:hover {
          cursor: pointer;
          background: #f2f2f2;
          color: #42b983;
        }
      }
      ul {
        padding: 0;
        margin: 0;
      }
    }
    .side {
      width: 40%;
      height: 95vh;
      overflow-y: auto;
      position: fixed;
      top: 54px;
      left: 0;
      text-align: center;
      background: #fff;
      border: 1px solid #eee;
      font-weight: bold;
      .m-el-menu {
        li {
          position: relative;
          a {
              position: absolute;
              top: 0;
              left: 0;
              right: 0;
              bottom: 0;
              padding-left: 20px;
            }
        }
      }
    }
    .side-in {
      transform: translateX(0%);
      transition: transform 0.4s ease-in-out;
      ul {
        padding: 0!important;
      }
      .nav {
        .list-item {
          padding: 0 20px;
          height: 56px;
          line-height: 56px;
          text-align: left;
          color: #505d6b;
        }
      }
    }
    .side-out {
      transform: translateX(-100%);
      transition: transform 0.3s ease-in-out;
      ul {
        padding: 0!important;
      }
      .nav {
        .list-item {
          padding: 0 20px;
          height: 56px;
          line-height: 56px;
          text-align: left;
          color: #505d6b;
        }
      }
    }
  }
</style>