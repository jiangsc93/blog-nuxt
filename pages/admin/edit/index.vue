<template>
  <div>
    <div class="edit container">
      <!-- <nuxt/> -->
      <el-form :model="editData" :rules="rules" ref="editForm" label-width="100px" class="form-edit">
        <el-form-item label="文章标题" prop="title">
          <el-input v-model="editData.title"></el-input>
        </el-form-item>
        <el-form-item label="简短概要" prop="summary">
          <el-input type="textarea" v-model="editData.summary"></el-input>
        </el-form-item>
        <el-form-item class="img" label="文章图片" prop="imgSrc">
          <el-input v-model="editData.imgSrc" placeholder="请输入图片的网络链接，不填则配置默认图片"></el-input>
        </el-form-item>
        <el-form-item class="type" label="文章类型" prop="type">
          <el-select v-model.trim="editData.type" placeholder="文章类型">
          <el-option
            v-for="item in optionsTypes"
            :key="item.value"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select>
        </el-form-item>
        <el-form-item label="所属标签" prop="tag">
          <el-select
            v-model.trim="editData.tag"
            multiple
            filterable
            allow-create
            default-first-option
            placeholder="请选择所属标签">
            <el-option
              v-for="item in optionsTags"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item class="author" label="作者" prop="author">
          <el-input v-model="editData.author"></el-input>
        </el-form-item>
        <el-form-item label="文章发布时间" prop="beginDate">
          <el-date-picker
            v-model="editData.beginDate"
            type="datetime"
            @change="changeTime"
            placeholder="选择发布时间">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="文章内容" prop="content">
          <my-editor :content="editData.content" @saveContent="onSave"></my-editor>
        </el-form-item>
        <p class="tips">编辑完内容请点击保存(或Ctrl + S)</p>
        <el-form-item>
          <el-button type="primary" @click="submitArticle('editForm', 0)">立即发布</el-button>
          <el-button type="warning" @click="submitArticle('editForm', 1)">保存到草稿</el-button>
          <el-button @click="resetForm('editForm')">重置</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
  import Api from '~/utils/api'
  import BackHeader from '~/components/header/backHeader'
  import IndexFooter from '~/components/footer/footer'
  import myEditor from '~/components/editor/mavonEditor'
  import Cookie from 'js-cookie'
  import { DropdownMenu, DropdownItem, Dropdown } from 'element-ui'
  
  const moment = require('moment');

  let authUser =  eval('(' + Cookie.get('authUser') + ')');
  export default {
    middleware: 'auth',
    layout: 'admin',
    data(){
      return {
        beginTime: '',
        optionsTags: [
          {
            value: 'css',
            label: 'css'
          },
          {
            value: 'javascript',
            label: 'javascript'
          },
          {
            value: 'node',
            label: 'node'
          },
          {
            value: 'vue',
            label: 'vue'
          },
          {
            value: 'react',
            label: 'react'
          },
          {
            value: '小程序',
            label: '小程序'
          }
        ],
        optionsTypes: [
          {
            value: '前端',
            label: '前端'
          },
          {
            value: '数据库',
            label: '数据库'
          },
          {
            value: '微信',
            label: '微信'
          },
          {
            value: '开发工具',
            label: '开发工具'
          },
          {
            value: '其他',
            label: '其他'
          }],
        editData: {
          title: '',
          author: authUser ? authUser.userName : '',
          beginDate: moment(Date.now()).format('YYYY-MM-DD HH:mm:ss'),
          lastDate: '',
          type: '',
          tag: '',
          content: '',
          summary: '',
          imgSrc: '',
          state: 0
        },
        rules: {
          title: [
            { required: true, message: '请输入文章标题', trigger: 'blur' },
            { min: 2, message: '长度在不得少于2个字符', trigger: 'blur' }
          ],
          author: [
            { required: true, message: '请输入文章作者', trigger: 'blur' }
          ],
          summary: [
            { required: true, message: '请输入一句对文章简要的概括', trigger: 'blur' }
          ],
          type: [
            { required: true, message: '请输入文章类型', trigger: 'blur' }
          ],
          tag: [
            { required: true, message: '请输入文章所属标签', trigger: 'blur' }
          ]
        },
      }
    },
    mounted () {
      if (!this.$route.params.id) return;
      setTimeout(() => {
        Api.getArticleOneAdmin({id: this.$route.params.id})
          .then(res => {
            let resData = res.data.data;
            resData.tag = res.data.data.tag.split(','); // 字符串切换成数组
            this.editData = Object.assign({}, resData);
          }, err => {
            console.log('报错啦', err)
          })
      }, 0)
    },
    methods: {
      changeTime(val) {
        console.log(moment(val).format('YYYY-MM-DD HH:mm:ss'), 'ssss');
      },
      // 保存markdown内容
      onSave(val) {
        this.editData.content = val;
      },
      // 重置表单内容
      resetForm(formName) {
        this.$refs[formName].resetFields();
      },
      submitArticle(formName, state) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            this.editData.state = state; // 记录文章发布状态
            this.editData.author = this.editData.author ? this.editData.author : '佚名';
            // 将数组 标签 转化成字符串存进去
            this.editData.tag = this.editData.tag.join(',').toLowerCase();

            if (this.$route.params.id) { // 修改,编辑
              this.editData.beginDate = moment(this.editData.beginDate).format('YYYY-MM-DD HH:mm:ss');
              this.editData.lastDate = moment(Date.now()).format('YYYY-MM-DD HH:mm:ss');
              this.editData.id = this.$route.params.id;
              Api.ModifyArticleAdmin(this.editData)
              .then((res) => {
                if (state === 0) {
                  Util.UI.toast('文章修改成功!', 'success')
                } else {
                  Util.UI.toast('文章已保存到草稿!', 'success')
                }
              }).then((res) => {
                this.$router.push('/admin/article/list/1')
              }, err => {
                 Util.UI.toast('修改文章失败!', 'error')
              })
            } else { // 新建
            if (this.editData.beginDate) {
              this.editData.beginDate = moment(this.editData.beginDate).format('YYYY-MM-DD HH:mm:ss');
            }
              Api.editNewArticleAdmin(this.editData)
              .then(res => {
                if (state === 0) {
                  Util.UI.toast('发表文章成功!', 'success')
                } else {
                  Util.UI.toast('文章已保存到草稿!', 'success')
                }
              }).then((res) => {
                this.$router.push('/admin/article/list/1')
              }, err => {
                Util.UI.toast('发表文章失败!', 'error')
              })
            }
          } else {
            console.log('error submit!!');
            return false;
          }
        });
      },
    },
    components: {
      BackHeader,
      IndexFooter,
      DropdownMenu,
      DropdownItem,
      Dropdown,
      myEditor
    },
  }
</script>

<style lang="scss">
.form-edit .author .el-form-item__content .el-input .el-input__inner {
  max-width: 100px!important;
}
.form-edit .type .el-form-item__content .el-input .el-input__inner {
  max-width: 115px!important;
}
</style>

<style scoped lang="scss">
.el-dropdown {
  vertical-align: top;
}
.el-dropdown + .el-dropdown {
  margin-left: 15px;
}
.el-icon-arrow-down {
  font-size: 12px;
}

.form-edit{
  max-width: 100%;
}
.tips {
  padding: 0 0 10px 100px;
  font-size: 13px;
  color: orange;
  margin: 0;
}
</style>
