<template>
  <div>
    <header id="index-header" :class="!isFixed ? 'no-fixed' : $store.state.showHeader ? 'header-in' : 'header-out'">
      <div>
        <div v-if="!isMobile" class="pc-header">
          <div class="__lt">
            <div class="logo">知否</div>
            <!-- 导航栏 -->
            <el-menu :default-active="activeIndex"
              active-text-color="#5f9ea0"
              class="el-menu-demo" mode="horizontal">
              <el-menu-item
                v-for="(item, index) in navList"
                :key="index"
                :index="index.toString()">
                <a :href="item.link">
                  {{item.title}}
                </a>
              </el-menu-item>
            </el-menu>
          </div>
          <!-- 右侧 -->
          <div class="__rt">
            <!-- 搜索框 -->
            <div class="search-wrap">
              <i class="iconfont icon-search" @click="onSearch"></i>
              <el-input class="search-input" size="medium" placeholder="搜索知否" @keyup.enter.native="onSearch" v-model.trim="keywords" ></el-input>
            </div>
            <div class="write-article" @click="onWrite">
              <div class="_wrap"><i class="iconfont icon-xiezi" style="margin-right: 2px;"></i>写文章</div>
            </div>
            <div class="message">
              <a @click="goNotification" class="_wrap">
                <i class="iconfont icon-lingdang" :class="messageNum ? 'active' : ''"></i>
                <!-- <span class="_circle" v-if="messageNum"><span class="message-num">{{messageNum}}</span></span> -->
              </a>
            </div>
            <div class="user-login">
              <div class="img" v-if="this.$store.state.avatar || avatar" @click="showDropDown = !showDropDown"><img :src="this.$store.state.avatar || avatar"></div>
              <span v-if="!(this.$store.state.avatar || avatar)" @click="onWrite">
                {{ loginTitle }}
              </span>
            </div>
            <div class="user-dropdown" v-show="showDropDown">
              <ul>
                <li v-for="(item, index) in dropDownList" :key="index">
                  <a class="dropdown-item" :class="`dropdown-item${item.index}`" @click="toLink(item)" :href="item.link">
                    <i :class="`iconfont ${item.icon}`"></i>
                    <span class="val">
                      {{item.val}}
                    </span>
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>
        <div v-else class="mobile-header">
          <div class="m__lt"><i @click="isShowSide = !isShowSide" class="iconfont icon-caidan-zhankai"></i><span class="name">知否</span></div>
          <div class="show-input" @click="$refs.input.focus()">
            <i class="iconfont icon-search" @click="onSearch"></i>
            <el-input
              class="search-input"
              size="medium"
              ref="input"
              placeholder="搜索知否"
              v-model.trim="keywords">
            </el-input>
          </div>
          <div class="user-login">
            <div class="img" v-if="this.$store.state.avatar || avatar" @click="showDropDown = !showDropDown"><img :src="this.$store.state.avatar || avatar"></div>
            <span v-if="!(this.$store.state.avatar || avatar)" @click="onWrite">
              {{ loginTitle }}
            </span>
          </div>
          <div class="user-dropdown" v-show="showDropDown">
            <ul>
              <li v-for="(item, index) in dropDownList" :key="index">
                <a class="dropdown-item" :class="`dropdown-item${item.index}`" @click="toLink(item)" :href="item.link">
                  <i :class="`iconfont ${item.icon}`"></i>
                  <span class="val">
                    {{item.val}}
                  </span>
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>
      <div :class="isShowSide ? 'side side-in' : 'side side-out' ">
        <el-menu :default-active="activeIndex"
          active-text-color="#46bd87"
          class="el-menu-demo m-el-menu" mode="vertical">
          <el-menu-item
            v-for="(item, index) in navList"
            :key="index"
            :index="index.toString()">
            <a :href="item.link">
              {{item.title}}
            </a>
          </el-menu-item>
        </el-menu>
      </div>
      <LoginRegister></LoginRegister>
    </header>
  </div>
</template>

<script>
  import { mapState, mapGetters } from 'vuex'
  import Cookie from 'js-cookie'
  import _ from 'lodash'
  import LoginRegister from '../common/loginRegister'
  import Api from '~/utils/api'
  import { Throttle, clearAllCookie } from '~/utils/utils'
  let throttle = Throttle();
  export default {
    props: {
      isFixed: {
        type: Boolean,
        default: true
      }
    },
    data(){
      return {
        title: '文章',
        isShowSide: false,
        isShowInput: false,
        keywords: this.$route.query.query || '',
        messageNum: '3',
        searchList: [],
        navList: [
          {
            title: '首页',
            link: '/timeline/recommend',
            activeIndex: '0'
          },
          // {
          //   title: '发牢骚',
          //   link: '/complain',
          //   activeIndex: '1'
          // },
          // {
          //   title: '时事',
          //   link: '/archive',
          //   activeIndex: '2'
          // },
        ],
        
        activeIndex: '',
        loginTitle: '登录 | 注册',
        avatar: '',
        headerClass: '',
        showDropDown: false,
        dropDownList: [
          {
            index: 1,
            icon: 'icon-bianxie',
            val: '写文章',
            link: `/edit`,
          },
          {
            index: 2,
            icon: 'icon-zhuye',
            val: '我的主页',
            link: `/user/${this.$store.state.userId}`
          },
          {
            index: 3,
            icon: 'icon-dianzan1',
            val: '我赞过谁',
            link: `/user/${this.$store.state.userId}?type=likes`
          },
          {
            index: 4,
            icon: 'icon-shoucang',
            val: '我的收藏夹',
            link: `/user/${this.$store.state.userId}?type=collects`
          },
          {
            index: 5,
            icon: 'icon-tongzhi',
            val: '我的消息',
            link: `/notification/${this.$store.state.userId}?type=user`
          },
          {
            index: 6,
            icon: 'icon-shezhi',
            val: '设置',
            link: `/user/setting/info?uid=${this.$store.state.userId}`
          },
          {
            index: 7,
            icon: 'icon-tuichu',
            val: '登出'
          },
        ]
      }
    },
    components: {
      LoginRegister
    },
    computed: {
      ...mapState(['isMobile', 'httpDomain']),
      ...mapGetters(['getUserInfo']),
    },
    watch: {
       isShowInput() {
         if (this.isShowInput) {
           this.$refs.input.focus();
         }
       },
       avatar() {
         if (this.$store.state.isLogin) {
           return this.$store.state.avatar;
         }
       }
    },
    created() {
      _.filter(this.navList, item => {
        this.activeIndex = this.$route.path.includes(item.link.substr(0, 8)) ? item.activeIndex : this.activeIndex;
        this.title = this.$route.path.includes(item.link.substr(0, 8)) ? item.title : this.title;
      })
    },
    beforeMount() {
      // 首先看本地存储里有没有userId，如果有就设置cookie和localStorage
      let userId = window.localStorage.getItem('userId');
      if (!userId) return;
      Api.getUserInfo({_id: userId}).then(result => {
        let {userName, avatar, _id} = result;
        window.localStorage.setItem('userName', userName);
        window.localStorage.setItem('userId', _id);
        window.localStorage.setItem('avatar', avatar);
        this.$store.commit('init', {userName, avatar, userId: _id});
      }).catch(err => {
        console.log(err);
      })
    },
    mounted() {
      // 点击事件
      document.addEventListener('click', (e) => {
        if (this.isShowSide && !(e.target).closest('.side, .icon-caidan-zhankai')) {
          this.isShowSide = false;
        }
        if (!(e.target).closest('.m-li, .show-input, .show-wrap')) {
          this.isShowInput = false;
          this.keywords = '';
        }
        if (!(e.target).closest('.user-dropdown, .img')) {
          this.showDropDown = false;
        }
      })
      document.addEventListener("touchstart", (e) => {
        if (this.isShowSide && !(e.target).closest('.side, .icon-caidan-zhankai')) {
          this.isShowSide = false;
        }
        if (!(e.target).closest('.m-li, .show-input, .show-wrap')) {
          this.isShowInput = false;
          this.keywords = '';
        }
      })
    },
    methods: {
      toLink(item) {
        if (item.val === '登出') {
          Util.UI.confirm('确定登出吗？知否等你回来哦！😊', '提示').then(() => {
            localStorage.clear();
            Cookie.remove('avatar');
            Cookie.remove('isLogin');
            Cookie.remove('token');
            Cookie.remove('userId');
            Cookie.remove('userName');
            location.reload();
          }, () => {
          })
        }
      },
      goNotification() {
        if (this.getUserInfo.avatar && this.getUserInfo.userName) {
          window.location.href = `/notification/${this.$store.state.userId}?type=user`;
        } else {
          this.$store.commit('setVisible', true);
          this.$store.commit('setHandleFlag', 'login');
        }
      },
      onWrite() {
        if (this.$store.state.userId && this.getUserInfo.userName) {
          window.location.href = '/edit/';
        } else if (this.$store.state.userId && !this.getUserInfo.userName) {
          Util.UI.confirm('您的个人资料未完善，请前往完善。', '提示').then(() => {
            window.location.href = `/user/setting/info?uid=${this.$store.state.userId}`;
          })
        } else {
          this.$store.commit('setVisible', true);
          this.$store.commit('setHandleFlag', 'login');
        }
      },
      handleCommand(command) {
        switch(command){
          case 'userLogin':
            this.$store.commit('setVisible', true);
            this.$store.commit('setHandleFlag', 'login');
            return;
          case 'userLogout':
            Cookie.remove('avatar');
            Cookie.remove('userName');
            this.loginTitle = '登录';
            this.avatar = '';
            return;
        }
      },
      goLink(val) {
        this.title = val;
      },
      // 搜索
      onSearch() {
        if (this.keywords === '') return;
        location.href = `/search?type=article&query=${this.keywords}`;
      },
      articleLink(item) {
        location.href = `${this.httpDomain}/article/${item._id}`;
      }
    }
  }
</script>

<style lang="scss">
  header .pc-header .__rt .search-wrap .el-input .el-input__inner {
    padding-left: 18px;
    border-radius: 6px;
    background-color: rgba(227,231,236,.2);
    height: 34px;
    line-height: 34px;
  }
  header .mobile-header .show-input .el-input .el-input__inner {
    background-color: rgba(227,231,236,.2);
    padding-left: 10px;
    border-radius: 5px;
  }
  header .mobile-header .search-wrap .el-input .el-input__inner {
    padding-left: 18px;
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
      color: $brand-primary;
      font-weight: bold;
    }
  }
  header {
    box-sizing: border-box;
    width: 100%;
    z-index: 10;
    background: #fff;
    color: #000;
    border-bottom: 1px solid #eee;
    &.header-in {
      position: fixed;
      top: 0;
      left: 0;
      transition: top .2s;
    }
    &.header-out {
      position: fixed;
      top: -61px;
      left: 0;
      transition: top .2s;
    }
    .pc-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      height: 60px;
      line-height: 60px;
      max-width: 960px;
      margin: 0 auto;
      .__lt {
        display: flex;
        .logo {
          font-size: 25px;
          color: $brand-primary;
          font-weight: bold;
          font-family: "SimHei";
        }
        .el-menu-demo {
          vertical-align: top;
          display: inline-block;
          margin-left: 1rem;
          margin-right: 30px;
          li {
            padding: 0 30px;
            position: relative;
            text-align: center;
            border: none;
            &:hover {
              color: $brand-primary;
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
      }
      .__rt {
        font-size: 18px!important;
        display: flex;
        justify-self: start;
        position: relative;
        .search-wrap {
          display: inline-block;
          position: relative;
          margin-right: 18px;
          .icon-search {
            position: absolute;
            top: 3px;
            right: 18px;
            color: #748597;
            font-size: 23px;
            z-index: 1000;
          }
          .search {
            width: 220px;
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
                color: $brand-primary;
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
          width: 160px;
          margin-right: 10px;
        }
        .write-article {
          display: flex;
          align-items: center;
          height: 64px;
          ._wrap {
            line-height: 33.6px;
            padding: 0 8px 0 6px;
            color: #fff;
            font-size: 16px;
            border-radius: 3px;
            cursor: pointer;
            background: $brand-primary;
            &:hover {
              background: $brand-primary;
              opacity: .96;
            }
          }
        }
        .message {
          display: flex;
          align-items: center;
          margin: 0 18px;
          position: relative;
          top: 3px;
          ._wrap {
            position: relative;
            .iconfont {
              font-size: 36px;
              color: $font-color4;
              &.active {
                color: $brand-primary;
              }
              &:hover {
                color: $brand-primary;
              }
            }
            ._circle {
              display: flex;
              align-items: center;
              position: absolute;
              top: 8px;
              right: 2px;
              padding: 2px;
              border-radius: 50%;
              background: #fff;
              height: 21px;
              line-height: 16px;
              .message-num {
                display: inline-block;
                padding: 3px;
                width: 16px;
                height: 16px;
                text-align: center;
                line-height: 10px;
                font-size: 10px;
                color: #fff;
                border-radius: 50%;
                background: red;
              }
            }
          }
        }
        .user-login {
          cursor: pointer;
          .img {
            display: inline-block;
            width: 34px;
            height: 34px;
            position: relative;
            top: 13px;
            right: 0;
            img {
              border-radius: 50%;
              width: 100%;
              height: 100%;
            }
          }
        }
        .user-dropdown {
          position: absolute;
          top: 63px;
          right: 0;
          z-index: 1001;
          width: 150px;
          border: 1px solid rgba(177,180,185,.45);
          border-radius: 3px;
          padding: 10px 0;
          background: #fff;
          box-shadow: 0 2px 8px 0 rgba(0, 0, 0, 0.1);
          li {
            padding: 0;
            line-height: 25px;
            .dropdown-item {
              display: inline-block;
              width: 100%;
              padding: 5px 15px;
              line-height: 25px;
              color: $font-color4;
              cursor: pointer;
              &:hover {
                background: #f9f9f9;
              }
              &.dropdown-item6 {
                border-top: 1px solid #f5f5f5;
              }
              .iconfont {
                font-size: 15px;
              }
              .val {
                display: inline-block;
                margin-left: 10px;
                font-size: 14px;
              }
            }
          }
        }
      }
    }
    .mobile-header {
      display: flex;
      justify-content: space-between;
      .show-input {
        display: inline-block;
        position: relative;
        padding-top: 10px;
        .icon-search {
          position: absolute;
          top: 5px;
          right: 15px;
          color: #748597;
          font-size: 23px;
          z-index: 1000;
        }
      }
      .show-input .el-input {
        display: inline-block;
        width: 145px;
        margin-right: 16px;
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
          padding: 14px 0 8px 20px;
          color:#001529;
        }
        .name {
          display: inline-block;
          padding: 0 12px 0 15px;
          font-size: 20px;
          font-weight: 600;
          color: $brand-primary;
        }
      }
      .user-login {
        cursor: pointer;
        .img {
          display: inline-block;
          width: 34px;
          height: 34px;
          position: relative;
          top: 13px;
          right: 15px;
          margin-left: 55px;
          img {
            border-radius: 50%;
            width: 100%;
            height: 100%;
          }
        }
        span {
          display: inline-block;
          margin-top: 2px;
          line-height: 52px;
          margin-right: 10px;
          font-size: 16px;
          color: $brand-primary;
        }
      }
      .user-dropdown {
        position: absolute;
        top: 63px;
        right: 0;
        z-index: 1001;
        width: 150px;
        border: 1px solid rgba(177,180,185,.45);
        border-radius: 3px;
        padding: 10px 0;
        background: #fff;
        box-shadow: 0 2px 8px 0 rgba(0, 0, 0, 0.1);
        li {
          padding: 0;
          line-height: 25px;
          .dropdown-item {
            display: inline-block;
            width: 100%;
            padding: 5px 15px;
            line-height: 25px;
            color: $font-color4;
            cursor: pointer;
            &:hover {
              background: #f9f9f9;
            }
            &.dropdown-item6 {
              border-top: 1px solid #f5f5f5;
            }
            .iconfont {
              font-size: 15px;
            }
            .val {
              display: inline-block;
              margin-left: 10px;
              font-size: 14px;
            }
          }
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
      z-index: 1000;
      width: 40%;
      height: 95vh;
      overflow-y: auto;
      position: fixed;
      top: 55.4px;
      left: 0;
      text-align: center;
      background: #fff;
      font-weight: bold;
      box-shadow: -2px 5px 18px rgba(0, 0, 0, .06);
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
    }
    .side-out {
      transform: translateX(-100%);
      transition: transform 0.3s ease-in-out;
      ul {
        padding: 0!important;
      }
    }
  }
</style>