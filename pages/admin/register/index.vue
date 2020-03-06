<template>
  <section class="container">
    <div class="login_logout">
      <h1 class="title">{{title}}</h1>
      <div class="list">
        <el-form :model="ruleForm2" status-icon ref="ruleForm2" :rules="rules" label-width="70px" class="demo-ruleForm">
          <el-form-item label="用户名" prop="userName">
            <el-input type="text" v-model="ruleForm2.userName" auto-complete="off"></el-input>
          </el-form-item>
          <el-form-item label="邮箱" prop="email">
            <el-input type="text" v-model="ruleForm2.email" auto-complete="off"></el-input>
          </el-form-item>
          <el-form-item label="密码" prop="password">
            <el-input type="password" v-model="ruleForm2.password" auto-complete="off"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" id="btn" @click="register('ruleForm2')">注册</el-button>
            <el-button @click="resetForm('ruleForm2')">重置</el-button>
          </el-form-item>
          <!-- <p class="username_pass">测试账号: 任意非空字符 密码: 123456</p> -->
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
        title: '登录页面',
        meta: [
          { hid: 'description', name: 'description', content: 'login页面....' }
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
            { type: 'string', required: true, message: '请输入用户名', trigger: 'change' }
          ],
          email: [
            { type: 'string', required: true, message: '请输入邮箱', trigger: 'change' }
          ],
          password: [
            { type: 'string', required: true, message: '请输入密码', trigger: 'change' }
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
            Api.register(this.ruleForm2).then(result => {
              console.log(result, 'rrr');
              if (result.data.code === 200 && result.data.data) {
                Cookie.set('authUser', result.data.data)
                Util.UI.toast('登录成功!', 'success');
                setTimeout(() => {
                  window.location.href = '/admin/';
                },1000)
              } else {
                return;
              }
            }).catch(err => {
              console.log('error:', err);
            })
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
  footer{
    display: none;
  }
</style>
