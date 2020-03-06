<template>
  <el-dialog :title="handleFlag === 'login' ? '登录' : '注册'"
             :width="isMobile ? '60%' : '35%'"
             :visible="visible"
             :close-on-click-modal="false"
             @close="cancel"
             :append-to-body="true"
             center>
    <el-form>
      <el-formItem label="邮箱"
                   :label-width="formLabelWidth">
        <el-input v-model="params.email"
                  placeholder="请输入邮箱"
                  autocomplete="off">
        </el-input>
      </el-formItem>
      <el-formItem label="密码"
                   :label-width="formLabelWidth">
        <el-input type="password"
                  placeholder="请输入密码"
                  v-model="params.password"
                  autocomplete="off"></el-input>
      </el-formItem>
      <el-formItem v-if="handleFlag === 'register'"
                   label="昵称"
                   :label-width="formLabelWidth">
        <el-input v-model="params.userName"
                  placeholder="用户名或昵称（评论区展示）"
                  autocomplete="off"></el-input>
      </el-formItem>
      <el-formItem v-if="handleFlag === 'register'"
                   label="头像"
                   :label-width="formLabelWidth">
        <el-input v-model="params.avatorSrc"
                  placeholder="输入图片的网络链接"
                  autocomplete="off"></el-input>
      </el-formItem>
      <el-formItem v-if="handleFlag === 'register'"
                   label="简介"
                   :label-width="formLabelWidth">
        <el-input v-model="params.introduction"
                  placeholder="个人简介"
                  autocomplete="off"></el-input>
      </el-formItem>
    </el-form>
    <div slot="footer"
         class="dialog-footer">
      <!-- <el-button type="success"
                 @click="handleOAuth">github 授权登录</el-button> -->
      <el-button v-if="handleFlag === 'login'"
                 :loading="btnLoading"
                 type="primary"
                 @click="submit('login')">登 录</el-button>
      <el-button v-if="handleFlag === 'register'"
                 :loading="btnLoading"
                 type="primary"
                 @click="submit('register')">注 册</el-button>
    </div>
  </el-dialog>
</template>

<script>
import Api from '~/utils/api'
import Cookie from 'js-cookie'
  export default {
    props: {
      handleFlag:{
        type: String,
        default: 'login'
      },
      visible:{
        type: Boolean,
        default: false
      },
      isMobile:{
        type: Boolean,
        default: false
      }
    },
    data(){
      return {
        formLabelWidth: '80px',
        params: {},
        btnLoading: false,
      }
    },
    mounted() {
     
    },
    methods: {
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
        } else if (val === 'register' && !this.params.userName) {
          this.$message({
            message: "请输入用户名或昵称！",
            type: "warning"
          });
          return;
        } else if (val === 'register' && !this.params.avatorSrc) {
          this.$message({
            message: "请输入头像图片链接！",
            type: "warning"
          });
          return;
        } else if (val === 'register' && !this.params.introduction) {
          this.$message({
            message: "请输入个人简介！",
            type: "warning"
          });
          return;
        }
        if (val === 'login') {
          Api.customerLogin(this.params).then(res => {
            if (res.status === 200 && res.data.data.customerInfo) {
              let userName = res.data.data.customerInfo.userName;
              let avatorSrc = res.data.data.customerInfo.avatorSrc;
              Cookie.set('customerName', userName);
              Cookie.set('avatorSrc', avatorSrc);
              this.$store.commit('setCustomer', {userName, avatorSrc});
              this.$message({
                message: "登录成功",
                type: "success"
              });
              this.$emit('feedback', false);
              setTimeout(() => {
                window.location.reload()
              }, 1000)
            } else {
              this.$message({
                message: res.data.message,
                type: "error"
              });
            }
          }).catch(err => {
            this.$message({
              message: "登录失败",
              type: "error"
            });
          })
        } else {
          Api.customerRegister(this.params).then(res => {
            if (res.status === 200 && res.data.data.customerInfo) {
              this.$message({
                message: "注册成功",
                type: "success"
              });
              let userName = res.data.data.customerInfo.userName;
              let avatorSrc = res.data.data.customerInfo.avatorSrc;
              Cookie.set('customerName', userName);
              Cookie.set('avatorSrc', avatorSrc);
              this.$store.commit('setCustomer', {userName, avatorSrc});
              this.$emit('feedback', false);
              setTimeout(() => {
                window.location.reload()
              }, 1000)
            } else {
              this.$message({
                message: res.data.message,
                type: "error"
              });
            }
          }).catch(err => {
            this.$message({
              message: '注册失败',
              type: "error"
            });
          })
        }
      },
      handleOAuth() {

      },
      cancel() {
        this.params = {};
        this.$emit('feedback', false);
      }
    }
  }
</script>

<style scoped lang="scss">


</style>

