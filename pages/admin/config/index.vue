<template>
  <section class="container">
    <el-table
      :data="configList"
      stripe
      style="width: 100%">
      <el-table-column
        label="序号"
        type="index"
        fixed
        width="70">
      </el-table-column>
       <el-table-column
        prop="title"
        label="图片类型"
        width="210">
      </el-table-column>
      <el-table-column
        prop="imgSrc"
        label="图片链接">
      </el-table-column>
      <el-table-column
        fixed="right"
        label="操作"
        width="160">
        <template slot-scope="scope">
          <el-button @click="modifyConfig(scope.row)" type="primary" v-scroll-to="{element:'#edit'}" size="small">修改</el-button>
          <el-button @click="deleteConfig(scope.row)" type="danger" size="small">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <h3 id="edit" class="edit-title">{{isModify ? '修改' : '创建'}}图片链接：</h3>
    <el-form :model="ruleForm" ref="ruleForm" :rules="rules" label-width="200px" class="edit-form">
      <el-form-item label="图片类型" prop="title">
        <el-select v-model.trim="ruleForm.title" placeholder="请选择图片类型">
          <el-option
            v-for="item in optionsTypes"
            :key="item.value"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select>
      </el-form-item>
       <el-form-item label="图片链接" prop="title">
        <el-input v-model="ruleForm.imgSrc"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="submitForm('ruleForm')">提交</el-button>
        <el-button type="warning" @click="resetForm('ruleForm')">我要新创建</el-button>
      </el-form-item>
    </el-form>
  </section>
</template>

<script>
import moment from 'moment';
import _ from 'lodash';
import Api from '~/utils/api'

export default {
  middleware: 'auth',
  layout: 'admin',
  head() {
    return {
      title: 'Admin-配置中心',
      meta: [
        { hid: 'description', name: 'description', content: '配置中心' }
      ]
    }
  },
  // asyncData ({ params, error }) {
  //   return Api.getConfigList()
  //       .then(res => {
  //         if (res.status === 200 && res.data && res.data.data.list) {
  //           let configList = res.data.data.list;
  //           return { configList }
  //         }
  //     }).catch (err => {
  //     console.log('报错了啊')
  //   })
  // },
  data() {
    return {
      isModify: false, // 是否修改
      ruleForm: {
        title: '',
        imgSrc: '',
        _id: ''
      },
      optionsTypes: [
        {
          value: '文章列表默认封面',
          label: '文章列表默认封面'
        },
        {
          value: '游客默认头像',
          label: '游客默认头像'
        },
      ],
      configList: [],
      rules: {
        title: [
          { type: 'string', required: true, message: '请输入标题', trigger: 'change' }
        ],
        imgSrc: [
          { type: 'string', required: true, message: '请添加图片链接', trigger: 'blur' }
        ]
      }
    }
  },
  mounted() {
    this.getConfigList();
  },
  methods: {
    getConfigList() {
      Api.getConfigList()
        .then(res => {
          if (res.status === 200 && res.data && res.data.data.list) {
            this.configList = res.data.data.list;
          }
      }).catch (err => {
        console.log('报错了啊')
      })
    },
    // 提交表单
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          let { title, imgSrc, _id } = this.ruleForm;
          let params = {
            title,
            imgSrc,
            _id
          };
          
          Api.addConfig(params).then(result => {
            if (result.status === 200) {
              this.$refs[formName].resetFields(); // 清空表单
              this.$message({
                type: 'success',
                message: '添加成功!'
              })
              this.getConfigList();
              this.ruleForm = {};
            }
          }).catch(err => {
            this.$message({
              type: 'warning',
              message: '添加失败'
            });
          })
        }
      })  
    },
    // 重置表单
    resetForm(formName) {
      this.isModify = false;
      this.ruleForm = {};
    },
    // 修改配置
    modifyConfig(val) {
      this.isModify = true;
      _.filter(this.configList, item => {
        if (item._id === val._id) {
          this.ruleForm = item;
        }
      })
    },
    // 删除图片
    deleteConfig(val) {
      this.$confirm('确定要删除吗？', '提示', {
        type: 'warning',
      }).then(() => {
        this.delete(val.title);
      })
    },
    // 调用删除图片api
    delete(title) {
      Api.deleteConfig({title}).then(result => {
        this.$message({
          type: 'success',
          message: '删除成功!'
        });
        this.getConfigList();
        this.ruleForm = {};
      }).catch(err => {
        this.$message({
          type: 'warning',
          message: '删除失败'
        });
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.edit-title {
  margin-top: 50px;
}
.edit-form {
  margin-top: 20px;
  width: 70%;
}

</style>
