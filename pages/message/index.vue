<template>
  <div class="message">
    <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="160px" class="demo-ruleForm">
      <el-form-item label="姓名" prop="name">
        <el-input v-model="ruleForm.name"></el-input>
      </el-form-item>
      <el-form-item label="邮箱" prop="email">
        <el-input v-model="ruleForm.email" placeholder="必填"></el-input>
      </el-form-item>
      <el-form-item label="手机号" prop="phone">
        <el-input v-model="ruleForm.phone"></el-input>
      </el-form-item>
      <el-form-item label="留言内容" prop="content">
        <el-input type="textarea" v-model="ruleForm.content" placeholder="请留言"></el-input>
      </el-form-item>
      <el-form-item label="您是怎么找到我的" prop="source">
        <el-checkbox-group v-model="ruleForm.source">
          <el-checkbox label="百度" name="baidu"></el-checkbox>
          <el-checkbox label="朋友推荐" name="friend"></el-checkbox>
          <el-checkbox label="微信订阅号" name="wexin"></el-checkbox>
          <el-checkbox label="其他" name="other"></el-checkbox>
        </el-checkbox-group>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="submitForm('ruleForm')">提交留言</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import Api from '~/utils/api'
import markdown from '~/utils/markdown'
export default {
  middleware: 'getTagList',
  layout: 'article',
  head() {
    return {
      title: '留言',
      meta: [
        { id: 'keywords', hid: 'keywords', name: 'keywords', content: '留言' },
        { id: 'description', hid: 'description', name: 'description', content: '对博主留言' },
      ]
    }
  },
  data () {
    return {
      ruleForm: {
        name: '',
        email: '',
        phone: '',
        content: '',
        source: [],
      },
      rules: {
        source: [
          { type: 'array', required: true, message: '请至少选择一个嘛', trigger: 'change' }
        ]
      }
    }
  },
  beforeMount() {
    
  },
  methods: {
    submitForm(formName) {
      const reg = new RegExp(
        "^[a-z0-9]+([._\\-]*[a-z0-9])*@([a-z0-9]+[-a-z0-9]*[a-z0-9]+.){1,63}[a-z0-9]+$"
      );
      if (!this.ruleForm.email) {
        this.$message({
          message: "邮箱不能为空！",
          type: "warning"
        });
        return;
      } else if (!reg.test(this.ruleForm.email)) {
        this.$message({
          message: "请输入格式正确的邮箱！",
          type: "warning"
        });
        return;
      } else if (!this.ruleForm.content.length) {
        this.$message({
          message: "请输入留言内容！",
          type: "warning"
        });
        return;
      } else {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            let params = {};
            params = Object.assign({}, this.ruleForm);
            params.sourceStr = this.ruleForm.source.join(',');
            Api.submitMessage(params)
              .then(res => {
                this.$refs[formName].resetFields(); // 清空表单
                this.$message({
                  message: "感谢您的留言，博主会抽空回复您的",
                  type: "success"
                });
              }).catch((err) => {
                console.log('留言提交失败');
                throw Error('留言失败!')
              })
          } else {
            this.$message({
              message: "请至少选一个嘛",
              type: "warning"
            });
          }
        })
      }
    },
  }
}
</script>

<style lang="scss">
.message {
  margin: 90px 0 90px;
}
</style>
