<template>
  <el-dialog :title="handleFlag === 'login' ? '登录' : '注册'"
             :width="isMobile ? '80%' : '35%'"
             :visible="visible"
             :close-on-click-modal="false"
             @close="cancel"
             :append-to-body="true"
             :top="handleFlag === 'login' ? '25vh' : '9vh'"
             center>
    <el-form :class="!isMobile ? 'login-form' : ''">
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
        <el-upload class="upload-container"
            ref="upload"
            :action=" `${$store.state.apiHttp}/api/upload`"
            :on-remove="handleRemove"
            :file-list="fileList"
            list-type="picture-card"
            :limit='1'
            :before-upload="beforeAvatarUpload"
            :auto-upload="true"
            :on-success='handleSucess'
            :on-error='handleError'>
            <div slot="trigger">+</div>
            <div slot="tip" class="el-upload__tip">只能上传jpg/jpeg/png文件，且不超过 300kb</div>
          </el-upload>
      </el-formItem>
      <el-formItem
          v-if="handleFlag === 'register'"
          label="简介"
          :label-width="formLabelWidth">
        <el-input
            v-model="params.introduction"
            :placeholder="isMobile ? '简单描述你的职业、擅长的事情' : '用一句话描述你的职业、擅长或喜欢做的事情'"
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
      <!-- <el-button class="forget" v-if="handleFlag === 'login'"
        :loading="btnLoading"
        plain
        @click="submit('modify')">忘记密码</el-button> -->
      <el-button v-if="handleFlag === 'register'"
                 :loading="btnLoading"
                 type="primary"
                 @click="submit('register')">注 册</el-button>
      <div class="tip">我也想在这个上面写文章，<a href="/admin/register">去写文章</a></div>
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
        formLabelWidth: '50px',
        params: {},
        btnLoading: false,
        //上传图片参数
			  fileList: [],
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
            message: "请上传头像！",
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
              // 设置本地缓存
              window.localStorage.setItem('customerName', userName);
              window.localStorage.setItem('avatorSrc', avatorSrc);
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
          this.params.avatorSrc = this.fileList[0].url;
          Api.customerRegister(this.params).then(res => {
            if (res.status === 200 && res.data.data.customerInfo) {
              this.$message({
                message: "注册成功",
                type: "success"
              });
              let userName = res.data.data.customerInfo.userName;
              let avatorSrc = res.data.data.customerInfo.avatorSrc;
              // 设置本地缓存
              window.localStorage.setItem('customerName', userName);
              window.localStorage.setItem('avatorSrc', avatorSrc);
              // Cookie.set('customerName', userName);
              // Cookie.set('avatorSrc', avatorSrc);
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
      cancel() {
        this.params = {};
        this.$emit('feedback', false);
      },
      handleRemove(file, fileList) {
        fileList.splice(file, 1);
        this.fileList = [];
        this.params.avatorSrc = '';
      },
      // 图片上传前
      beforeAvatarUpload(file) {
        const isJPG = (file.type === 'image/jpeg' || file.type === 'image/jpg' || file.type === 'image/png');
        const isLt2M = file.size / 1024 / 1024 <= 0.3;
        if (!isJPG || !isLt2M) {
          this.$notify({
            title: "提示",
            message: '只能上传 jpg/jpeg/png文件，且不超过300kb',
            type: "warning",
            duration: 3000
          });
        }
        return isJPG && isLt2M;
      },
      //上传成功过后
      handleSucess(response, file, fileList) {
        if (response.code == 200) {
          let data = response.data;
          
          let file = {};
          file.name = data.name;
          file.url = this.$store.state.imgurlhttp + data.url;
          this.fileList = [];
          this.fileList.push(file);
          this.params.avatorSrc = file.url;
          this.$notify({
            title: "提示",
            message: response.message,
            type: "success",
            duration: 2000
          });
          return;
        } else {
          this.$notify({
            title: "失败",
            message: response.message,
            type: "warning",
            duration: 2000
          });
        }					 
      },
      //上传失败
      handleError(err, file, fileList) {
        this.$notify({
          title: "失败",
          message: "上传失败",
          type: "warning",
          duration: 2000
        });
      },
    }
  }
</script>

<style>
.el-dialog--center .el-dialog__body {
  padding-bottom: 0!important;
}
.upload-container>.el-upload.el-upload--picture-card {
  width: 80px;
  height: 80px;
  line-height: 80px;
}
.el-upload-list--picture-card .el-upload-list__item {
  width: 80px;
  height: 80px;
}
</style>

<style scoped lang="scss">
.el-dialog--center .el-dialog__body {
  padding-bottom: 0;
}
.login-form {
  padding: 0 15px;
}
.forget {
  margin-left: 35px;
}
.tip {
  font-size: 13px;
  color: #888;
  margin-top: 10px;
}

</style>

