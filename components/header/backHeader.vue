<template>
  <header>
      <span class="home"><a href="/" alt="益码凭川">益码凭川</a></span>
      <div class="login_out">
        <!-- <nuxt-link to="/admin/login" class="logIn btn">登录</nuxt-link>
        <span v-if="!isLogin" class="logOut btn" @click="logout">退出</span> -->
      </div>
  </header>
</template>

<style scoped lang="scss">
  header {
    background: #f0f0f0;
    border-bottom: 1px solid #ccc;
    height: 50px;
    line-height: 50px;
    overflow: hidden;
    padding: 0 25px;
    h1{
      margin-bottom: 0;
      display: inline-block;
      color: #409EFF;
    }
    .login_out{
      float:right;
      span, a{
        padding-left: 10px;
        font-size: 14px;
        color: #666;
        &.btn{
          cursor: pointer;
          color: #999;
         }
      }
    }
  }
</style>
<script>
  import Cookie from 'js-cookie'
  export default {

    data(){
      return {
      }
    },
    methods: {
      goCreateFile() {
        this.$router.push(`/admin/edit`)
      },
      async logout() {
        try {
          await this.$store.dispatch('logout')
          this.$router.push(`/login`)
          this.isLogin = true;
        } catch (e) {
          console.log('登出错误', e)
        }
      }
    }
  }
</script>
<style lang="scss" scoped>
.home a {
  font-weight: bold;
  font-size: 20px;
  color: #409EFF;
}
</style>
