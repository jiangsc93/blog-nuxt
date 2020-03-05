<template>
  <section class="container">
    <el-table
      :data="experienceList"
      stripe
      style="width: 100%">
      <el-table-column
        type="index"
        fixed
        width="30">
      </el-table-column>
      <el-table-column
        prop="time"
        label="时间"
        fixed
        width="190">
        <template slot-scope="scope">
          <span>{{scope.row.start_time}}</span> --
          <span>{{scope.row.end_time}}</span>
        </template>
      </el-table-column>
      <el-table-column
        prop="title"
        label="标题"
        width="230">
      </el-table-column>
      <el-table-column
        prop="description"
        label="描述">
      </el-table-column>
      <el-table-column
        fixed="right"
        label="操作"
        width="160">
        <template slot-scope="scope">
          <el-button @click="modifyExperience(scope.row)" type="primary" v-scroll-to="{element:'#edit'}" size="small">修改</el-button>
          <el-button @click="deleteExperience(scope.row)" type="danger" size="small">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <h3 id="edit" class="edit-title">{{isModify ? '修改' : '创建'}}历程：</h3>
    <el-form :model="ruleForm" ref="ruleForm" :rules="rules" label-width="200px" class="edit-form">
      <el-form-item label="标题" prop="title">
        <el-input v-model="ruleForm.title"></el-input>
      </el-form-item>
      <el-form-item label="时间" prop="timeArr">
        <el-date-picker
          v-model="ruleForm.timeArr"
          type="datetimerange"
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期">
        </el-date-picker>
      </el-form-item>
      <el-form-item label="描述" prop="description">
        <el-input type="textarea" v-model="ruleForm.description" placeholder="输入历程描述"></el-input>
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
      title: 'Admin-历程',
      meta: [
        { hid: 'description', name: 'description', content: '历程' }
      ]
    }
  },
  asyncData ({ params, error }) {
    return Api.getExperienceList()
        .then(res => {
          if (res.status === 200 && res.data && res.data.data.list) {
            let experienceList = res.data.data.list;
            return { experienceList }
          }
      }).catch (err => {
      console.log('报错了啊')
    })
  },
  data() {
    return {
      isModify: false, // 是否修改
      experienceList: [],
      ruleForm: {
        title: '',
        description: '',
        timeArr: [],
        _id: ''
      },
      messageList: [],
      rules: {
        title: [
          { type: 'string', required: true, message: '请输入标题', trigger: 'change' }
        ],
        timeArr: [
          { type: 'array', required: true, message: '请选择时间周期', trigger: 'change' }
        ],
        description: [
          { type: 'string', required: true, message: '请添加历程描述', trigger: 'change' }
        ],
      }
    }
  },
  methods: {
    // 提交表单
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          let { title, description, imgSrc, timeArr, _id } = this.ruleForm;
          let start_time = moment(timeArr[0]).format('YYYY-MM-DD');
          let end_time = moment(timeArr[1]).format('YYYY-MM-DD');
          let params = {
            title,
            description,
            imgSrc,
            start_time,
            end_time,
            _id
          };
          
          Api.addExperience(params).then(result => {
            if (result.status === 200) {
              this.$refs[formName].resetFields(); // 清空表单
              this.$message({
                type: 'success',
                message: '添加成功!'
              });
              setTimeout(() => {
                window.location.reload(); 
              }, 1500)
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
    // 修改历程
    modifyExperience(val) {
      this.isModify = true;
      _.filter(this.experienceList, item => {
        if (item._id === val._id) {
          this.ruleForm = item;
          this.ruleForm.timeArr = [item.start_time, item.end_time];
        }
      })
    },
    // 删除历程
    deleteExperience(val) {
      this.$confirm('确定要删除吗？', '提示', {
        type: 'warning',
      }).then(() => {
        this.delete(val._id);
      })
    },
    // 调用删除历程api
    delete(_id) {
      Api.deleteExperience({_id}).then(result => {
        this.$message({
          type: 'success',
          message: '删除成功!'
        });
        setTimeout(() => {
          window.location.reload(); 
        }, 1500)
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
