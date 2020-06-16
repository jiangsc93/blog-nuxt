<template>
  <div class="page-set-new-password common-container">
    <div class="reset-form" :class="{'m-reset-form':isMobile}">
      <div class="__header">
        <h1>设置新密码</h1>
      </div>
      <div class="__body" v-if="showInput">
        <input type="text" placeholder="请输入新密码" v-model.trim="newPwd">
      </div>
      <div class="success" v-else>新密码设置成功，请返回首页登录</div>
      <div class="__footer">
        <button v-if="showInput" class="button" @click="onSubmit">确定</button>
        <div class="index-link">
          <a href="/">返回首页</a>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Api from '~/utils/api'
import { md5, MD5_SALT } from '../../utils/md5.js';
import { mapState } from 'vuex';
export default {
  middleware: 'checkMobile',
  head() {
    return {
      title: `设置新密码-知否`,
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
      newPwd: '',
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
      if (!this.newPwd) {
        this.$message({
          message: "请输入新密码",
          type: "warning"
        })
        return;
      }
      console.log(this.$route.query.token, 'this.$route.query.token');
      if (!this.$route.query.token) {
        this.$message({
          message: "请复制邮箱中的地址",
          type: "warning"
        })
        return;
      }
      Api.changePwdByEmailToken({newPwd: md5(this.newPwd + MD5_SALT), emailToken: this.$route.query.token})
        .then(res => {
          if (res === 'noUser') {
            this.showInput = true;
            this.$message({
              message: "用户不存在",
              type: "warning"
            })
          } else {
            this.showInput = false;
          }
        }).catch(err => {
          this.showInput = true;
          this.$message({
            message: "当前token无效或已过期",
            type: "warning"
          })
        })
    }
  }
}
</script>

<style lang="scss" scoped>
.page-set-new-password {
  .reset-form {
    width: 450px;
    padding: 50px 40px 40px;
    margin: 80px auto 0;
    background: #fff;
    &.m-reset-form {
      width: 100%;
    }
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
