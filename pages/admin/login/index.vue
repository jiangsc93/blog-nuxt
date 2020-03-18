<template>
  <section class="container">
    <div class="login_logout">
      <h1 class="title">{{title}}</h1>
      <div class="list">
        <el-form :model="ruleForm2" status-icon ref="ruleForm2" :rules="rules" label-width="70px" class="demo-ruleForm">
          <el-form-item label="邮箱" prop="email">
            <el-input type="text" placeholder="请输入邮箱" v-model="ruleForm2.email" auto-complete="off"></el-input>
          </el-form-item>
          <el-form-item label="密码" prop="password">
            <el-input type="password" placeholder="请输入密码" v-model="ruleForm2.password" auto-complete="off"></el-input>
          </el-form-item>
          <el-form-item label="验证">
            <div id="captcha">
              <p id="wait" v-if="!showJiyan" class="show"><i class="el-icon-loading"></i>正在加载验证码......</p>
            </div>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" id="btn" @click="loginCheck">登录</el-button>
            <el-button @click="resetForm('ruleForm2')">重置</el-button>
            <el-button @click="register()">去注册</el-button>
          </el-form-item>
        </el-form>
      </div>
    </div>
  </section>
</template>

<script>
  import Api from '~/utils/api'
  import Cookie from 'js-cookie'
  export default {
    layout: 'back',
    head() {
      return {
        title: '管理员登录页面',
        meta: [
          { hid: 'description', name: 'description', content: 'login页面....' }
        ],
        script: [
        //  { src: 'gt.js', type: 'text/javascript' } // 本地静态资源可用次,线上无法读取改地址,建议换成下面
          { src: 'https://static.geetest.com/static/tools/gt.js', type: 'text/javascript' }
        ]
      }
    },
    data(){
      return {
        title: "管理员登录",
        ruleForm2: {
          password: '',
          email: ''
        },
        jiyanData: {
          geetest_challenge: '',
          geetest_validate: '',
          geetest_seccode: ''
        },
        showJiyan: false,
        rules: {
          email: [
            { type: 'string', required: true, message: '请输入邮箱', trigger: 'blur' }
          ],
          password: [
            { type: 'string', required: true, message: '请输入密码', trigger: 'blur' }
          ]
        }
      }
    },
    mounted() {
      Api.JiyanSlide()
        .then(res => {
          if (!res.data.data || res.status !== 200) {
            return
          }
          let { gt, challenge, success, new_captcha } = res.data.data;
          // 参数1：配置参数
          // 参数2：回调，回调的第一个参数验证码对象，之后可以使用它调用相应的接口
          let _this = this;
          initGeetest({ // 急眼自带方法
            // 以下 4 个配置参数为必须，不能缺少
            gt: gt,
            challenge: challenge,
            offline: !success, // 表示用户后台检测极验服务器是否宕机
            new_captcha: new_captcha, // 用于宕机时表示是新验证码的宕机
            product: "float", // 产品形式，包括：float，popup
            width: "100%"
          }, function(captchaObj) {
            var captchaBox = document.getElementById('captcha');
            var wait = document.getElementById('wait');
            var btn = document.getElementById('btn');
            captchaObj.appendTo(captchaBox);
            captchaObj.onReady(function () {
              _this.showJiyan = true;
            });
            captchaObj.onSuccess(function () {
              let successResult = captchaObj.getValidate();
              _this.jiyanData.geetest_challenge = successResult.geetest_challenge;
              _this.jiyanData.geetest_validate = successResult.geetest_validate;
              _this.jiyanData.geetest_seccode = successResult.geetest_seccode;
            })
          });
        })
    },
    methods: {
      jiyanValidate () {
        if (!this.jiyanData.geetest_challenge) {
          return Util.UI.toast('未验证，请完成验证!', 'error')
        }
        Api.JiyanValidate(this.jiyanData)
          .then(res => {
            if (res.data.data.status === 'success') {
              this.login();
            } else if (res.data.data.status === 'fail') {
              Util.UI.toast('验证失败，请重新完成验证!', 'error')
              return;
            }
          }).catch(err => {
            return Util.UI.toast('验证失败，请完成验证!', 'error')
          })
      },
      login() {
        Api.login(this.ruleForm2)
          .then(res => {
            if (res.status === 200 && res.data && res.data.data && res.data.data.userInfo && res.data.data.userInfo.userName) {
              Cookie.set('authUser', res.data.data.userInfo);
              sessionStorage.setItem('email', JSON.stringify(res.data.data.userInfo.email));
              Util.UI.toast('登录成功!', 'success');
              setTimeout(() => {
                window.location.href = '/admin/'
              }, 1000)
            } else {
              Util.UI.toast(res.data.message, 'error');
            }
          }, err => {
            Util.UI.toast('账号或密码错误!', 'error')
          })
      },
      loginCheck() {
        if (this.ruleForm2.userName !== '' && this.ruleForm2.password !== '') {
          this.jiyanValidate();
        } else {
          Util.UI.toast('请输入账号和密码!', 'error')
        }
      },
      resetForm(formName) {
        this.$refs[formName].resetFields();
      },
      register() {
        window.location.href = '/admin/register';
      }
    }
  }
</script>

<style scoped lang="scss">
  .container .el-form-item {
    margin-bottom: 18px!important;
  }
  .container{
    height: 60vh;
    margin: 0 auto;
    -webkit-box-shadow: none;
    box-shadow: none;
    .el-form-item {
      margin-bottom: 10px;
    }
    .login_logout{
      padding: 20px;
      border-radius: 5px;
      -webkit-box-shadow: 0 0 6px rgba(99, 99, 99, .4);
      box-shadow: 0 0 6px rgba(99, 99, 99, .4);
      width: 360px !important;
      margin-left: -180px;
      margin-top: -150px;
      margin: auto;
      min-height: 300px;
      .title {
        text-align: center;
        font-size: 20px;
        color: #555;
      }
    }
    #wait{
      line-height: 40px;
      color: #666;
    }
  }
</style>
