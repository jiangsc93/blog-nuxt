<template>
  <div>
    <div class="edit container">
      <h4 class="update-time" v-if="editData.lastDate">上次更新时间：{{editData.lastDate}}</h4>
      <el-form :model="editData" :rules="rules" ref="editForm" label-width="130px" class="form-edit">
        <el-form-item label="文章标题" prop="title" class="title">
          <el-input
            v-model="editData.title"
            maxlength="50"
            size="medium"
            placeholder="请输入文章标题"
            show-word-limit></el-input>
        </el-form-item>
        <el-form-item label="简短概要" prop="summary" class="summary">
          <el-input
            type="textarea"
            v-model="editData.summary"
            maxlength="150"
            placeholder="用一句话简要概括文章内容或者写一句有意思的引导语"
            :autosize="{ minRows: 2, maxRows: 6}"
            show-word-limit></el-input>
        </el-form-item>
        <el-form-item class="img img-edit" label="文章封面" prop="fileList" ref="img">
          <el-upload class="upload-container"
              :class="isShowImg ? 'upload-wrap' : ''"
              ref="upload"
              :action="`${$store.state.apiHttp}/api/upload`"
              :on-remove="handleRemove"
              :file-list="editData.fileList"
              list-type="picture-card"
              :limit='1'
              :before-upload="beforeAvatarUpload"
              :auto-upload="true"
              :on-success='handleSucess'
              :on-error='handleError'>
              <el-button slot="trigger" size="small" type="primary">上传图片</el-button>
              <div slot="tip" class="el-upload__tip">只能上传jpg/jpeg/png文件，且不超过 500kb</div>
          </el-upload>
        </el-form-item>
        <el-form-item class="type" label="文章类型" prop="type">
          <el-select v-model.trim="editData.type" size="medium" placeholder="文章类型">
            <el-option
              v-for="item in optionsTypes"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="所属标签" prop="tag" class="tag">
          <el-select
            v-model.trim="editData.tag"
            multiple
            filterable
            allow-create
            default-first-option
            size="medium"
            placeholder="请选择标签">
            <el-option
              v-for="item in optionsTags"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item class="author" label="作者" prop="author">
          <el-input size="medium" disabled v-model="editData.author"></el-input>
        </el-form-item>
        <el-form-item label="文章发布时间" prop="beginDate">
          <el-date-picker
            size="medium"
            v-model="editData.beginDate"
            type="datetime"
            placeholder="选择发布时间">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="文章内容" prop="content">
          <my-editor :content="editData.content" @saveContent="onSave"></my-editor>
        </el-form-item>
        <p class="tips"><strong>温馨提示：</strong>编辑完内容请点击保存(或Ctrl + S)</p>
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
  import moment from 'moment';
  import Cookie from 'js-cookie'
  import BackHeader from '~/components/header/backHeader'
  import IndexFooter from '~/components/footer/footer'
  import myEditor from '~/components/editor/mavonEditor'
  import Api from '~/utils/api'
  import { DropdownMenu, DropdownItem, Dropdown } from 'element-ui'
  
  // 从cookie中获取管理员姓名，即此篇文章的作者
  let authUser =  eval('(' + Cookie.get('authUser') + ')');

  export default {
    middleware: 'auth',
    layout: 'admin',
    data(){
      return {
        isShowImg: false,
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
          },
          {
            value: 'go',
            label: 'go'
          },
          {
            value: 'python',
            label: 'python'
          },
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
        // 表单数据
        editData: {
          title: '',
          author: authUser ? authUser.userName : '',
          beginDate: moment(Date.now()).format('YYYY-MM-DD HH:mm:ss'),
          lastDate: '',
          type: '',
          tag: [],
          fileList: [],
          content: '',
          summary: '',
          state: 0,
          imgSrc: '',
        },
        // 表单验证规则
        rules: {
          title: [
            { required: true, message: '请输入文章标题', trigger: 'blur' },
            { min: 2, message: '长度在不得少于2个字符', trigger: 'blur' }
          ],
          summary: [
            { required: true, message: '请输入一句对文章简要的概括', trigger: 'blur' }
          ],
          fileList: [
            { required: true, message: '请上传文章封面图', trigger: 'blur' }
          ],
          type: [
            { required: true, message: '请输入文章类型', trigger: 'change' }
          ],
          tag: [
            { required: true, message: '请输入文章所属标签', trigger: 'change' }
          ],
          content: [
            { required: true, message: '写入内容是空的，是不是没有保存？', trigger: 'blur' }
          ],
        },
      }
    },
    mounted () {
      if (!this.$route.params.id) return;
      this.getArticleDetail();
    },
    methods: {
      getArticleDetail() {
        Api.getArticleOneAdmin({id: this.$route.params.id})
          .then(res => {
            let resData = res.data.data;
            resData.tag = res.data.data.tag.split(','); // 字符串切换成数组
            if (res.data.data.imgSrc) {
              let file = {
                name: 'png',
                url: res.data.data.imgSrc
              }
              resData.fileList = [];
              resData.fileList.push(file);
              this.isShowImg = true;
            }
            this.editData = Object.assign({}, resData);
          }, err => {
            console.log('报错啦', err)
          })
      },
      handleRemove(file, fileList) {
        fileList.splice(file, 1);
        this.editData.fileList = [];
        this.isShowImg = false;
      },
      //图片上传前
      beforeAvatarUpload(file) {
        const isJPG = (file.type === 'image/jpeg' || file.type === 'image/jpg' || file.type === 'image/png');
        const isLt2M = file.size / 1024 / 1024 <= 0.5;
        if (!isJPG || !isLt2M) {
          this.$notify({
            title: "提示",
            message: '只能上传 jpg/jpeg/png文件，且不超过500kb',
            type: "warning",
            duration: 3000
          });
        }
        return isJPG && isLt2M;
      },
      //上传成功过后
      handleSucess(response, file, fileList) {
        if (response.code == 200) {
          // 清除提示
          this.$refs.img.clearValidate();
          this.isShowImg = true;

          let data = response.data;
          let file = {};
          file.name = data.name;
          file.url = this.$store.state.imgurlhttp + data.url;
          this.editData.fileList = [];
          this.editData.fileList.push(file);
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
            this.editData.imgSrc = this.editData.fileList.length > 0 ? this.editData.fileList[0].url : '';
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
                  Util.UI.toast('文章修改且发布成功!', 'success')
                } else {
                  Util.UI.toast('文章已保存到草稿!', 'success')
                }
              }).then((res) => {
                this.$router.push('/admin/article/list/1')
              }, err => {
                 Util.UI.toast('文章修改失败!', 'error')
              })
            } else { // 新建
              if (this.editData.beginDate) {
                this.editData.beginDate = moment(this.editData.beginDate).format('YYYY-MM-DD HH:mm:ss');
              }
                Api.editNewArticleAdmin(this.editData)
                .then(res => {
                  if (state === 0) {
                    Util.UI.toast('文章发布成功!', 'success')
                  } else {
                    Util.UI.toast('文章已保存到草稿!', 'success')
                  }
                }).then((res) => {
                  this.$router.push('/admin/article/list/1')
                }, err => {
                  Util.UI.toast('文章发布失败!', 'error')
                })
              }
          } else {
            Util.UI.toast('内容未填完，验证不通过!', 'warning')
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
.img-edit .el-upload-list--picture-card .el-upload-list__item {
  width: 200px;
}
.img-edit .upload-wrap {
  height: 190px!important;
}
.img-edit .el-upload__tip {
  line-height: 20px;
}

</style>

<style scoped lang="scss">
.el-upload__tip {
  color: #888;
}
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
  .title {
    width: 850px;
  }
  .summary {
    width: 700px;
  }
  .author {
    width: 220px;
  }
  .type {
    width: 240px;
  }
  .tag {
    width: 260px;
  }
}
.tips {
  padding: 0 0 20px 100px;
  font-size: 13px;
  margin: 0;
  strong {
    color: #F56C6C;
  }
}
.update-time {
  margin: 0 0 20px 60px;
  font-size: 13px;
  color: #aaa;
}
</style>
