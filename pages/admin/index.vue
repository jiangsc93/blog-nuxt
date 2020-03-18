<template>
  <section class="container">
    <div>
      <app-logo/>
      <h3>
        欢迎使用'益码凭川'博客后台系统!
      </h3>
      <p class="tip" v-if="isShowTip"><strong>温馨提示：</strong>您还有资料未完善，请前往<a href="/admin/manager">个人资料</a></p>
    </div>
  </section>
</template>

<script>
import AppLogo from '~/components/AppLogo.vue'
import Api from '../../utils/api'
export default {
  middleware: 'auth',
  layout: 'admin',
  head() {
    return {
      title: 'Admin首页',
      meta: [
        { hid: 'description', name: 'description', content: 'Admin首页' }
      ]
    }
  },
  data() {
    return {
      isShowTip: false
    }
  },
  components: {
    AppLogo
  },
  mounted() {
    this.getUserInfo();
  },
  methods: {
    getUserInfo() {
      let params = {
        email: JSON.parse(sessionStorage.getItem('email'))
      }
      Api.getUserInfo(params)
        .then(res => {
          if (res.status === 200 && res.data.data && !res.data.data.avatar) { // 头像存在
            this.isShowTip = true;
          }
        }).catch(err => {
          console.log('报错啦', err)
        })
    },
  }
}
</script>

<style scoped>
.container {
  min-height: 78vh!important;
  display: flex;
  justify-content: center;
  align-items: center;
  margin-bottom: 0!important;
  text-align: center;
}

.tip {
  font-size: 14px;
  margin-top: 30px;
  color: #f56c6c;
}
</style>
