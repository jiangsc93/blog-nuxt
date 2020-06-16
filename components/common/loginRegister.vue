<template>
<div>
  <el-dialog 
      class="login-dialog"
      :title="flag === 'login' ? '登录' : '注册'"
      :width="isMobile ? '80%' : '22%'"
      :visible="visible"
      :close-on-click-modal="false"
      @close="cancel"
      :append-to-body="true"
      :top="flag === 'login' ? '24vh' : '22vh'"
      center>
    <el-form class="login-form">
      <el-formItem>
        <el-input v-model="params.email"
                  placeholder="请输入邮箱"
                  autocomplete="off">
        </el-input>
      </el-formItem>
      <el-formItem>
        <el-input type="password"
                  show-password
                  placeholder="请输入密码"
                  v-model="params.password"
                  autocomplete="off"></el-input>
      </el-formItem>
      <el-formItem v-if="flag === 'register'">
        <el-input type="password"
                  v-model="params.vertifyPassword"
                  placeholder="请确认密码"
                  autocomplete="off"></el-input>
      </el-formItem>
       <el-form-item v-show="flag === 'login'">
          <div id="captcha">
            <p id="wait" v-if="!showJiyan" class="show"><i class="el-icon-loading"></i>正在加载验证码......</p>
          </div>
        </el-form-item>
    </el-form>
    <div slot="footer"
         class="dialog-footer">
      <el-button v-show="flag === 'login'"
                 :loading="btnLoading"
                 type="primary"
                 @click="submit('login')">登 录</el-button>
      <el-button v-show="flag === 'register'"
                 :loading="btnLoading"
                 type="primary"
                 @click="submit('register')">注 册</el-button>
      <div class="other" v-show="flag === 'login'">
        <div class="_lt">没有账号？<span class="go-register" @click="flag = 'register', params = {}">注册</span></div>
        <div class="_rt"><a href="/reset-password">忘记密码</a></div>
      </div>
      <div class="have" v-show="flag === 'register'"><span @click="flag = 'login', params = {}">已有账号登录</span></div>
    </div>
  </el-dialog>
</div>
</template>
<script>
import Cookie from 'js-cookie';
import _ from 'lodash';
import Api from '~/utils/api';
import { md5, MD5_SALT } from '../../utils/md5.js';
import { mapState, mapGetters } from 'vuex';

  export default {
    data(){
      return {
        params: {},
        btnLoading: false,
        flag: this.$store.state.handleFlag,
        jiyanData: {
          geetest_challenge: '',
          geetest_validate: '',
          geetest_seccode: ''
        },
        showJiyan: false,
        captchaObj: {}
      }
    },
    computed: {
      ...mapGetters(['getVisible']),
      ...mapState(['isMobile']),
      visible() {
        return this.$store.state.visible;
      },
    },
    watch: {
      getVisible(val) {
        if (val && this.$store.state.handleFlag === 'login') this.jiyanSlide();
      }
    },
    mounted() {
    },
    methods: {
      jiyanSlide() {
        Api.JiyanSlide()
        .then(res => {
          let { gt, challenge, success, new_captcha } = res;
          // 参数1：配置参数
          // 参数2：回调，回调的第一个参数验证码对象，之后可以使用它调用相应的接口
          let _this = this;
          window.initGeetest({ // 急眼自带方法
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
            _this.captchaObj = captchaObj;
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
      jiyanValidate () {
        if (!this.jiyanData.geetest_challenge) {
          return Util.UI.toast('未验证，请完成验证!', 'error')
        }
        Api.JiyanValidate(this.jiyanData)
          .then(res => {
            if (res.status === 'success') {
              this.login();
            } else if (res.status === 'fail') {
              Util.UI.toast('验证失败，请重新完成验证!', 'error')
              return;
            }
          }).catch(err => {
            return Util.UI.toast('验证失败，请完成验证!', 'error')
          })
      },
      login() {
        let params = this.params;
        // 加密处理
        params.password = md5(params.password + MD5_SALT);
        Api.login(params)
          .then(res => {
            if (res === 'error') {
              Util.UI.toast('账号或密码错误', 'error');
              this.params = {};
              return;
            }
            if (res && res.userInfo && res.userInfo.userName) {
              this.params = {};
              Util.UI.toast('登录成功!', 'success');
              let { userName, email, avatar, _id } = res.userInfo;
              let token = res.token;
              // 设置本地缓存
              window.localStorage.setItem('userName', userName);
              window.localStorage.setItem('userId', _id);
              window.localStorage.setItem('avatar', avatar);
              window.localStorage.setItem('token', token);
              this.$store.commit('init', { userName, email, avatar, userId: _id, token });
              this.$store.commit('setVisible', false);
              this.resetData();
              location.reload();
            }
          }, err => {
            Util.UI.toast('账号或密码错误!', 'error');
            this.params = {};
          })
      },
      submit(val) {
        const reg = new RegExp(
          "^[a-z0-9]+([._\\-]*[a-z0-9])*@([a-z0-9]+[-a-z0-9]*[a-z0-9]+.){1,63}[a-z0-9]+$"
        );
        if (!this.params.email) {
          this.$message({
            message: "邮箱不能为空！",
            type: "warning"
          });
          return;
        } else if (!reg.test(this.params.email)) {
          this.$message({
            message: "请输入格式正确的邮箱！",
            type: "warning"
          });
          return;
        } else if (!this.params.password) {
          this.$message({
            message: "请输入密码！",
            type: "warning"
          });
          return;
        } else if (val === 'register' && !this.params.vertifyPassword) {
          this.$message({
            message: "请确认密码！",
            type: "warning"
          });
          return;
        } else if (val === 'register' && this.params.vertifyPassword !== this.params.password) {
          this.$message({
            message: "两次输入密码不一致",
            type: "warning"
          });
          return;
        }
        if (val === 'login') {
          this.jiyanValidate();
        } else {
          let params = this.params;
          params.password = md5(params.password + MD5_SALT);
          Api.register(params).then(res => {
            this.$message({
              message: "注册成功",
              type: "success"
            });
            this.params = {};
            let { userName, email, avatar, _id } = res.userInfo;
            let token = res.token;
            // 设置本地缓存
            window.localStorage.setItem('userName', userName);
            window.localStorage.setItem('userId', _id);
            window.localStorage.setItem('avatar', avatar);
            window.localStorage.setItem('token', token);
            this.$store.commit('init', { userName, email, avatar, userId: _id, token });
            this.$store.commit('setVisible', false);
            this.resetData();
            location.href = `/user/setting/info?uid=${_id}`;
          }).catch(err => {
            this.$message({
              message: '注册失败',
              type: "error"
            });
            this.params = {};
            let geetestSuccess = document.getElementsByClassName('geetest_radar_success')[0];
            geetestSuccess.style.display = 'none';
            this.resetData();
            this.jiyanSlide();
          })
        }
      },
      resetData() {
        this.params = {};
        this.flag = 'login';
      },
      cancel() {
        this.params = {};
        let list = document.getElementsByClassName('geetest_holder');
        _.forEach(list, item => {
          item.style.display = "none";
        })
        this.$store.commit('setVisible', false);
        this.$store.commit('setHandleFlag', 'login');
        this.flag = 'login';
      },
    },
  }
</script>

<style lang="scss">
.el-dialog--center .el-dialog__body {
  padding-bottom: 0!important;
}
.login-dialog .el-dialog__headerbtn .el-dialog__close {
  font-size: 22px;
}
.login-dialog .el-dialog__footer {
  padding: 0 24px 20px;
}
.login-form .el-form-item {
  margin-bottom: 10px;
}
.login-dialog .el-dialog__header .el-dialog__title {
  font-weight: bold;
  color: $brand-primary;
}
.login-dialog .el-button--primary {
  width: 100%;
  margin-left: 0;
}
</style>

<style scoped lang="scss">
.el-dialog--center .el-dialog__body {
  padding-bottom: 0;
}
.other {
  display: flex;
  justify-content: space-between;
  margin-top: 15px;
  ._lt {
    color: #888;
    font-size: 14px;
  }
  .go-register, ._rt {
    color: $brand-primary;
    font-size: 14px;
    cursor: pointer;
  }
}
.forget {
  margin-left: 35px;
}
.dialog-footer>>>.el-button--primary {
  width: 100%;
  margin-left: 0;
}
.have {
  text-align: center;
  font-size: 14px;
  margin-top: 15px;
  color: $brand-primary;
  cursor: pointer;
}
</style>

