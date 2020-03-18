<template>
  <div class="page-admin">
    <div class="__lt">
      <el-menu
        :default-active="activeRouter"
        class="el-menu-vertical-demo"
        background-color="#001529"
        text-color="#aaa"
        router
        :unique-opened="true"
        :collapse="isCollapse"
        active-text-color="#fff">
        <el-menu-item index="/admin" class="logo">
          <i class="el-icon-user-solid"></i>
          <span class="user-name" slot="title">益码凭川</span>
        </el-menu-item>
        <!-- <el-submenu index="1">
          <template slot="title">
            <i class="el-icon-location"></i>
            <span>仪表盘</span>
          </template>
          <el-menu-item-group>
            <el-menu-item index="1-1">数据中心</el-menu-item>
            <el-menu-item index="1-2">数据分析</el-menu-item>
          </el-menu-item-group>
        </el-submenu> -->
        <el-submenu index="2">
          <template slot="title">
            <i class="el-icon-menu"></i>
            <span>文章</span>
          </template>
          <el-menu-item-group>
            <el-menu-item index="/admin/article/list/1">文章列表</el-menu-item>
            <el-menu-item index="/admin/edit/">创建新文章</el-menu-item>
          </el-menu-item-group>
        </el-submenu>
        <el-menu-item
          v-if="isSuperAmin"
          index="/admin/project/">
          <i class="el-icon-document"></i>
          <span slot="title">项目</span>
        </el-menu-item>
        <el-menu-item v-if="isSuperAmin" index="/admin/experience/">
          <i class="el-icon-collection"></i>
          <span slot="title">历程</span>
        </el-menu-item>
        <el-menu-item
          v-if="isSuperAmin"
          index="/admin/message/">
          <i class="el-icon-message"></i>
          <span slot="title">留言</span>
        </el-menu-item>
        <el-menu-item index="/admin/manager/">
          <i class="el-icon-s-custom"></i>
          <span slot="title">个人资料</span>
        </el-menu-item>
        <el-menu-item
          v-if="isSuperAmin"
          index="/admin/config/">
          <i class="el-icon-setting"></i>
          <span slot="title">配置中心</span>
        </el-menu-item>
        <el-submenu
          index="3"
          v-if="isSuperAmin">
          <template slot="title">
            <i class="el-icon-user"></i>
            <span>用户管理</span>
          </template>
          <el-menu-item-group>
            <el-menu-item index="/admin/user/manager/1">管理员</el-menu-item>
            <el-menu-item index="/admin/user/customer/1">游客</el-menu-item>
          </el-menu-item-group>
        </el-submenu>
      </el-menu>
    </div>
    <div class="__rt">
      <header>
        <div class="menu-fold"><i class="el-icon-s-fold" @click="isCollapse =!isCollapse"></i></div>
        <div class="header-rt"><span class="user-name">欢迎您，{{userName}}</span><span class="logout" @click="logout">退出登录</span></div>
      </header>
      <nuxt/>
      <admin-footer class="foot"></admin-footer>
    </div>
  </div>
</template>
<script>
  import Cookie from 'js-cookie'
  import BackHeader from '~/components/header/backHeader'
  import AdminFooter from '~/components/footer/adminFooter'
  export default {
    data() {
      let authUser = Cookie.get('authUser') ? JSON.parse(Cookie.get('authUser')) : '';
      return {
        isSuperAmin: authUser.userName === '益码凭川',
        userName: authUser.userName,
        activeRouter: '/admin/article',
        isCollapse: false,
        navList: [
          {
            isShow: false,
            class: 'el-icon-s-data',
            name: '仪表盘',
            url: '/admin/dashbord',
            index: '/admin/dashbord',
            isSubmenu: true,
            list: [
              {
                isShow: false,
                name: '数据中心',
                index: '/admin/datacenter',
                url: '/admin/datacenter',
                internal: true
              },
              {
                isShow: false,
                name: '数据分析',
                index: '/admin/analy',
                url: '/admin/analy',
                internal: true
              },
            ]
          },
          {
            isShow: false,
            class: 'el-icon-document',
            name: '文章',
            index: '/admin/article',
            url: '/admin/article',
            isSubmenu: true,
            list: [
              {
                isShow: false,
                name: '文章列表',
                index: '/admin/article/list/1',
                url: '/admin/article/list/1',
                internal: true
              },
              {
                isShow: false,
                name: '创建文章',
                index: '/admin/edit',
                url: '/admin/edit',
                internal: true
              },
            ]
          },
          {
            isShow: false,
            class: 'el-icon-document',
            name: '项目',
            url: '/admin/project',
            index: '/admin/project',
            internal: true
          },
          {
            isShow: false,
            class: 'el-icon-collection',
            name: '历程',
            index: '/admin/experience',
            url: '/admin/experience',
            internal: true
          },
          {
            isShow: false,
            class: 'el-icon-message',
            name: '留言',
            index: '/admin/message',
            url: '/admin/message',
            internal: true
          }
        ]
      }
    },
    components: {
      BackHeader,
      AdminFooter,
    },
    watch: {
       '$route' (to, from) {
        //  this.changeActive()
         //刷新参数放到这里里面去触发就可以刷新相同界面了
        //  to.path == '/admin/login' ? this.isLogin = true : this.isLogin = false;
        //  let authUser = Cookie.get('authUser') ? JSON.parse(Cookie.get('authUser')) : '';
        //  this.userName = authUser.userName;

       }
     },
    created () {
      // this.changeActive()
    },
    mounted() {
    },
    methods: {
      async logout() {
        try {
          await this.$store.dispatch('logout')
          window.location.href = '/admin/login';
        } catch (e) {
          console.log('登出错误', e)
        }
      },
      changeActive () {
        let path = this.$route.path;
        this.activeMenu(this.navList, path);
      },
      activeMenu (menus, path) {
        if (path === null || path === '') return
        menus.forEach((nav) => {
          if (nav.isSubmenu) {
            this.activeMenu(nav.list, path)
          } else if (nav.url.indexOf(path) !== -1) {
            this.activeIndex = nav.index
          }
        })
      },
      // handleOpen(key, keyPath) {
      //   console.log(key, keyPath, '333');
      // },
      // handleClose(key, keyPath) {
      //   console.log(key, keyPath, '5555');
      // },
    }
  }
</script>
<style lang="scss">
.page-admin {
  background:#f0f2f5;
  display: flex;
  flex: auto;
  .__lt {
    min-height: 100%;
    a {
      color: rgb(170, 170, 170);
    }
    .el-menu-vertical-demo:not(.el-menu--collapse) {
      flex: 0 0 256px;
      max-width: 256px;
      min-width: 256px;
      width: 256px;
      min-height: 100%!important;
    }
    .el-menu-vertical-demo {
      min-height: 100%!important;
      a:before {
        position: absolute;
        top: 0;
        right: 0;
        bottom: 0;
        left: 0;
        background-color: transparent;
        content: "";
      }
      .el-menu-item {
        height: 40px!important;
        line-height: 40px!important;
        &.is-active {
          background: #409EFF!important;
          a {
            color: #fff;
          }
        }
        &.logo {
          color: #fff!important;
          i {
            color: #409eff!important;
          }
          background: #001529!important;
          .user-name {
            padding-left: 5px;
          }
        }
        &.logo {
          height: 60px!important;
          line-height: 60px!important;
          text-align: center;
          .el-tooltip {
            padding: 0 10px!important;
          }
          i {
            font-size: 30px;
          }
        }
      }
    }
  }
  .__rt {
    width: 100%;
    min-height: 100vh;
    header {
      width: 100%;
      display: flex;
      justify-content: space-between;
      background: #fff;
      height: 60px;
      line-height: 60px;
      padding: 0 20px;
      border-bottom: 1px solid #ccc;
      .menu-fold {
        height: 60px;
        line-height: 60px;
        .el-icon-s-fold {
          color: #777;
          padding-top: 16px;
          font-size: 28px;
          cursor: pointer;
        }
      }
      .header-rt {
        // width: 100%;
        .user-name {
          margin-right: 30px;
        }
        .logout {
          color: #888;
          cursor: pointer;
        }
      }
    }
    .breadcrumb {
      background: #fff;
      padding: 20px;
      margin-bottom: 20px;
    }
  }
}
</style>
<style>
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
</style>
