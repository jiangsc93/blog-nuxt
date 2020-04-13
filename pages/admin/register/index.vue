<template>
  <section class="container">
    <div class="login_logout">
      <h1 class="title">{{title}}</h1>
      <div class="list">
        <el-form :model="ruleForm2" status-icon ref="ruleForm2" :rules="rules" label-width="80px" class="demo-ruleForm">
          <el-form-item label="用户名" prop="userName">
            <el-input type="text" placeholder="每篇文章的作者名，想一个吧" v-model="ruleForm2.userName" auto-complete="off"></el-input>
          </el-form-item>
          <el-form-item label="邮箱" prop="email">
            <el-input type="text" placeholder="请输入格式正确的邮箱" v-model="ruleForm2.email" auto-complete="off"></el-input>
          </el-form-item>
          <el-form-item label="密码" prop="password">
            <el-input show-password type="password" placeholder="请输入密码" v-model="ruleForm2.password" auto-complete="off"></el-input>
          </el-form-item>
          <el-form-item label="确认密码" prop="password">
            <el-input show-password type="password" placeholder="请再次输入密码" v-model="ruleForm2.password2" auto-complete="off"></el-input>
          </el-form-item>
          <el-form-item class="footer">
            <el-button type="primary" id="btn" @click="register('ruleForm2')">注册</el-button>
            <el-button @click="resetForm('ruleForm2')">重置</el-button>
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
        title: '管理员注册页面',
        meta: [
          { hid: 'description', name: 'description', content: 'register页面....' }
        ]
      }
    },
    data(){
      return {
        title: "管理员注册",
        ruleForm2: {
          userName: '',
          password: '',
          email: ''
        },
        rules: {
          userName: [
            { type: 'string', required: true, message: '请输入用户名', trigger: 'blur' }
          ],
          email: [
            { type: 'string', required: true, message: '请输入邮箱', trigger: 'blur' }
          ],
          password: [
            { type: 'string', required: true, message: '请输入密码', trigger: 'blur' }
          ]
        }
      }
    },
    methods: {
      resetForm(formName) {
        this.$refs[formName].resetFields();
      },
      register(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            if (this.ruleForm2.password2 == this.ruleForm2.password) {
              Api.register(this.ruleForm2).then(result => {
                if (result.status === 200 && Object.keys(result.data.data).length !== 0) { // 判断对象是否为空
                  Cookie.set('authUser', result.data.data);
                  sessionStorage.setItem('email', JSON.stringify(result.data.data.email));
                  Util.UI.toast('注册并登录成功!', 'success');
                  setTimeout(() => {
                    window.location.href = '/admin/';
                  },1000)
                } else {
                  Util.UI.toast(result.data.message, 'warning');
                }
              }).catch(err => {
                console.log('error:', err);
              })
            } else {
              Util.UI.toast('两次输入密码不一致!', 'warning');
            }
          }
        })
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
    .username_pass{
      font-size: 12px;
      color: #999;
      text-align: center;
    }
    #wait{
      line-height: 40px;
      color: #666;
    }
  }
  .footer{
    text-align: center;
  }
  
</style>
<style>
.el-form .footer .el-form-item__content {
  margin-left: 0!important;
}
</style>
