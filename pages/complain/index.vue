<template>
  <div class="page-reset-password common-container">
    <div class="reset-form">
      <div class="__header">
        <h1>重置密码</h1>
      </div>
      <div class="__body" v-if="showInput">
        <input type="text" placeholder="请输入邮箱" v-model.trim="email">
      </div>
      <div class="success" v-else>密码重置邮件已发送，请前往邮箱重置密码</div>
      <div class="__footer">
        <button v-if="showInput" class="button" @click="onSubmit">发送邮件</button>
        <div class="index-link">
          <a href="/">返回首页</a>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Api from '~/utils/api'
import { mapState } from 'vuex';
export default {
  middleware: 'checkMobile',
  head() {
    return {
      title: `重置密码-知否`,
      meta: [
        { hid: 'keywords', name: 'keywords', content: 'Html, Css, Javascript, Nuxt, Next,Vue.js,微信小程序,React Native,敏捷开发,Bootstrap,正则表达式,WebGL,Webpack,Docker,MVVM'},
        { hid: 'description', name: 'description', content: '是一个开发者集聚地，分享技术带给我们的收获和快乐' }
      ],
    }
  },
  components: {
  },
  data() {
    return {
      email: '',
      showInput: true
    }
  },
  computed: {
    ...mapState(['isMobile']),
  },
  mounted() {
    
  },
  methods: {
    onSubmit() {
      if (!this.email) {
        this.$message({
          message: "请输入邮箱",
          type: "warning"
        })
        return;
      }
      this.showInput = false;
      Api.resetPwdByEmail({email: this.email})
        .then(() => {
          this.showInput = false;
        })
    }
  }
}
</script>

<style lang="scss" scoped>
.page-reset-password {
  .reset-form {
    width: 450px;
    padding: 50px 40px 40px;
    margin: 80px auto 0;
    background: #fff;
    .__header {
      margin: 0 0 15px;
      h1 {
        font-size: 24px;
        font-weight: bold;
        text-align: center;
        margin: 0 0 15px;
      }
    }
    .__body {
      input {
        width: 100%;
        padding: 6px 0;
        border: none;
        outline: none;
        border-bottom: 1px solid #eee;
      }
    }
    .success {
      padding: 40px 0;
      text-align: center;
    }
    .__footer {
      .button {
        display: block;
        width: 100%;
        margin: 28px 0 16px;
        border: none;
        border-radius: 3px;
        background: $brand-primary;
        color: #fff;
        line-height: 36px;
        outline: none;
        cursor: pointer;
        &:hover {
          opacity: .96;
        }
      }
      .index-link {
        color: $brand-primary;
        text-align: center;
      }
    }
  }
}
</style>
