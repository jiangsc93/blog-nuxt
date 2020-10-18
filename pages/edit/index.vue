<template>
  <div class="page-edit container">
    <Index-header :isFixed="isFixed"></Index-header>
    <div class="edit-wrap common-container">
      <h4 class="update-time" v-if="editData.lastDate">上次更新时间：{{editData.lastDate}}</h4>
      <el-form :model="editData" :rules="rules" ref="editForm" :label-width="isMobile ? '90px' : '130px'" class="form-edit" :class="{'m-from-edit': isMobile}">
        <my-editor :content="editData.content" @saveContent="onSave"></my-editor>
        <p class="editor-tips"><span :class="saved ? 'save' : ''"><i :class="`iconfont ${iconClass}`"></i>{{editorTips}}</span>
          <span class="tips"><strong>温馨提示：</strong>编辑完内容请点击保存(或Ctrl + S)</span>
        </p>
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
            :placeholder="isMobile ? '用一句话简要概括文章内容' : '用一句话简要概括文章内容或者写一句有意思的引导语'"
            :autosize="{ minRows: 2, maxRows: 6}"
            show-word-limit></el-input>
        </el-form-item>
        <el-form-item class="img img-edit" label="文章封面" prop="fileList" ref="img">
          <el-upload class="upload-container"
              :class="isShowImg ? 'upload-wrap' : ''"
              ref="upload"
              :action="`/api/upload`"
              :on-remove="handleRemove"
              :file-list="editData.fileList"
              list-type="picture-card"
              :multiple="false"
              :on-change="handleChange"
              :before-upload="beforeAvatarUpload"
              :auto-upload="true"
              :on-success='handleSucess'
              :on-error='handleError'>
              <div slot="trigger">+</div>
              <div slot="tip" class="el-upload__tip">支持jpg/png文件 5M 以内的图片</div>
          </el-upload>
        </el-form-item>
        <el-form-item class="category" label="文章类型" prop="category">
          <el-select v-model.trim="editData.category" size="medium" placeholder="文章分类">
            <el-option
              v-for="item in optionsCategory"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="标签" prop="tag" class="tag">
          <el-select
            v-model.trim="editData.tag"
            multiple
            filterable
            allow-create
            default-first-option
            size="medium"
            placeholder="请选择标签">
            <el-option
              v-for="(item, index) in optionsTags[editData.category]"
              :key="index"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
          <span class="tag-tip">可自定义</span>
        </el-form-item>
        <el-form-item label="发布时间" prop="beginDate">
          <el-date-picker
            size="medium"
            v-model="editData.beginDate"
            type="datetime"
            placeholder="选择发布时间">
          </el-date-picker>
        </el-form-item>
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
  import Cookie from 'js-cookie';
  import myEditor from '~/components/editor/mavonEditor';
  import IndexHeader from '~/components/header/indexHeader';
  import Api from '~/utils/api';
  import { mapState } from 'vuex';
  import { DropdownMenu, DropdownItem, Dropdown } from 'element-ui';

  export default {
    middleware: 'checkMobile',
    head() {
      return {
        title: `编辑文章 - 知否`,
        meta: [
          { hid: 'keywords', name: 'keywords', content: 'Html, Css, Javascript, Nuxt, Next,Vue.js,微信小程序,React Native,敏捷开发,Bootstrap,正则表达式,WebGL,Webpack,Docker,MVVM'},
          { hid: 'description', name: 'description', content: '是一个开发者集聚地，分享技术带给我们的收获和快乐' }
        ],
      }
    },
    data(){
      return {
        isShowImg: false,
        editorTips: '未保存',
        iconClass: 'icon-gantanhao',
        saved: false,
        isFixed: false,
        optionsTags: {
          frontend: [
            {
              value: 'Javascript',
              label: 'Javascript'
            },
            {
              value: 'Vue.js',
              label: 'Vue.js'
            },
            {
              value: 'React.js',
              label: 'React.js'
            },
            {
              value: 'Node.js',
              label: 'Node.js'
            },
            {
              value: 'CSS',
              label: 'CSS'
            },
            {
              value: '微信小程序',
              label: '微信小程序'
            },
            {
              value: '前端框架',
              label: '前端框架'
            },
            {
              value: 'Typescript',
              label: 'Typescript'
            },
            {
              value: 'HTML',
              label: 'HTML'
            },
            {
              value: 'ES6',
              label: 'ES6'
            },
            {
              value: 'GraphQL',
              label: 'GraphQL'
            },
            {
              value: '算法',
              label: '算法'
            },
            {
              value: '面试',
              label: '面试'
            },
            {
              value: '其他',
              label: '其他'
            },
          ],
          backend: [
            {
              value: 'Java',
              label: 'Java'
            },
            {
              value: 'SpringBoot',
              label: 'SpringBoot'
            },
            {
              value: 'Go',
              label: 'Go'
            },
            {
              value: 'MySQL',
              label: 'MySQL'
            },
            {
              value: 'Python',
              label: 'Python'
            },
            {
              value: 'Redis',
              label: 'Redis'
            },
            {
              value: 'Spring',
              label: 'Spring'
            },
            {
              value: 'Linux',
              label: 'Linux'
            },
            {
              value: 'Nginx',
              label: 'Nginx'
            },
            {
              value: 'JVM',
              label: 'JVM'
            },
            {
              value: 'SpringCloud',
              label: 'SpringCloud'
            },
            {
              value: 'Docker',
              label: 'Docker'
            },
            {
              value: 'Serverless',
              label: 'Serverless'
            },
            {
              value: '面试',
              label: '面试'
            },
            {
              value: '其他',
              label: '其他'
            },
          ],
          android: [
            {
              value: 'Java',
              label: 'Java'
            },
            {
              value: 'Kotlin',
              label: 'Kotlin'
            },
            {
              value: 'AndroidJetpack',
              label: 'AndroidJetpack'
            },
            {
              value: 'OpenGL',
              label: 'OpenGL'
            },
            {
              value: 'Android',
              label: 'Android'
            },
            {
              value: 'FFmpeg',
              label: 'FFmpeg'
            },
            {
              value: 'OKHttp',
              label: 'OKHttp'
            },
            {
              value: 'RxJava',
              label: 'RxJava'
            },
             {
              value: '面试',
              label: '面试'
            },
            {
              value: '其他',
              label: '其他'
            },
          ],
          ios: [
            {
              value: 'Swift',
              label: 'Swift'
            },
            {
              value: 'Obkective-C',
              label: 'Obkective-C'
            },
            {
              value: 'SwiftUI',
              label: 'SwiftUI'
            },
            {
              value: 'macOS',
              label: 'macOS'
            },
            {
              value: 'OpenGL',
              label: 'OpenGL'
            },
            {
              value: 'APP',
              label: 'APP'
            },
            {
              value: '逆向',
              label: '逆向'
            },
             {
              value: '面试',
              label: '面试'
            },
            {
              value: '其他',
              label: '其他'
            },
          ],
          operation: [
            {
              value: 'Linux',
              label: 'Linux'
            },
            {
              value: 'Java',
              label: 'Java'
            },
            {
              value: 'Kubernetes',
              label: 'Kubernetes'
            },
            {
              value: '服务器',
              label: '服务器'
            },
            {
              value: '其他',
              label: '其他'
            },
          ],
          tool: [
            {
              value: 'Visual Studio Code',
              label: 'Visual Studio Code'
            },
            {
              value: 'Intelli IDEA',
              label: 'Intelli IDEA'
            },
            {
              value: 'Git',
              label: 'Git'
            },
            {
              value: 'GitHub',
              label: 'GitHub'
            },
            {
              value: 'Java',
              label: 'Java'
            },
            {
              value: '其他',
              label: '其他'
            },
          ],
          other: [
            {
              value: '程序员',
              label: '程序员'
            },
            {
              value: '代码规范',
              label: '代码规范'
            },
            {
              value: '编程语言',
              label: '编程语言'
            },
            {
              value: 'Google',
              label: 'Google'
            },
            {
              value: '招聘',
              label: '招聘'
            },
            {
              value: '代码人生',
              label: '代码人生'
            },
            {
              value: '故事',
              label: '故事'
            },
            {
              value: '其他',
              label: '其他'
            },
          ]
        },
        optionsCategory: [
          {
            value: 'frontend',
            label: '前端'
          },
          {
            value: 'backend',
            label: '后端'
          },
          {
            value: 'android',
            label: '安卓'
          },
          {
            value: 'ios',
            label: 'iOS'
          },
          {
            value: 'operation',
            label: '运维'
          },
          {
            value: 'tool',
            label: '工具'
          },
          {
            value: 'other',
            label: '其他'
          }],
        // 表单数据
        editData: {
          title: '',
          author: '',
          beginDate: moment(Date.now()).format('YYYY-MM-DD HH:mm:ss'),
          lastDate: '',
          category: '',
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
          category: [
            { required: true, message: '请输入文章类型', trigger: 'change' }
          ],
          tag: [
            { required: true, message: '请输入文章所属标签', trigger: 'change' }
          ],
        },
      }
    },
    computed: {
      ...mapState(['isMobile']),
    },
    mounted () {
      window.addEventListener('scroll', () => {
        let scroll = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop;
        if (scroll > 100) {
          this.isFixed = true;
          this.$store.commit('setHeaderIsShow', true)
        } else {
          this.isFixed = false;
          this.$store.commit('setHeaderIsShow', false)
        }
      })
      if (!this.$route.query.aid) return;
      this.getArticleDetail();
    },
    methods: {
      getArticleDetail() {
        Api.getArticleOneAdmin({id: this.$route.query.aid})
          .then(res => {
            let resData = res;
            resData.tag = res.tag.split(','); // 字符串切换成数组
            if (res.imgSrc) {
              let file = {
                name: 'png',
                url: res.imgSrc
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
      // 重复覆盖上一张图片
      handleChange(files, fileList) {
        if (fileList.length>0) {
          this.fileList=[fileList[fileList.length-1]];
        }
      },
      // 图片上传前
      beforeAvatarUpload(file) {
        const isJPG = (file.type === 'image/jpg' || file.type === 'image/png' || file.type === 'image/jpeg');
        const isLt2M = file.size / 1024 / 1024 <= 5;
        if (!isJPG || !isLt2M) {
          Util.UI.toast('只支持 jpg/png文件 5M 以内的图片', 'warning');
        }
        return isJPG && isLt2M;
      },
      // 上传成功过后
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
          Util.UI.toast(`${response.message}`, 'success');
          return;
        } else {
          Util.UI.toast(`${response.message}`, 'error');
        }					 
      },
      // 上传失败
      handleError(err, file, fileList) {
        Util.UI.toast('上传失败', 'error');
      },
      // 保存markdown内容
      onSave(val) {
        this.editData.content = val;
        if (val) {
          this.editorTips = '已保存';
          this.saved = true;
          this.iconClass = 'icon-zhengque';
        } else {
          this.editorTips = '未保存';
          this.saved = false;
          this.iconClass = 'icon-gantanhao';
        }
      },
      // 重置表单内容
      resetForm(formName) {
        this.$refs[formName].resetFields();
      },
      submitArticle(formName, state) {
        this.$refs[formName].validate((valid) => {
          if (this.editData.tag.length > 2) {
            Util.UI.toast('文章标签不能超过2个', 'warning');
            return;
          }
          if (valid && this.editData.content) {
            this.editData.imgSrc = this.editData.fileList ? (this.editData.fileList.length > 0 ? this.editData.fileList[0].url : '') : '';
            this.editData.userId = localStorage.getItem('userId');
            this.editData.state = state; // 记录文章发布状态
            this.editData.author = localStorage.getItem('userName') || '佚名';
            // 将数组 标签 转化成字符串存进去
            this.editData.tag = this.editData.tag.join(',');

            if (this.$route.query.aid) { // 修改,编辑
              this.editData.beginDate = moment(this.editData.beginDate).format('YYYY-MM-DD HH:mm:ss');
              this.editData.lastDate = moment(Date.now()).format('YYYY-MM-DD HH:mm:ss');
              this.editData.id = this.$route.query.aid;
              Api.ModifyArticleAdmin(this.editData)
              .then((res) => {
                if (state === 0) {
                  Util.UI.toast('文章修改且发布成功!', 'success')
                } else {
                  Util.UI.toast('文章已保存到草稿!', 'success')
                }
              }).then((res) => {
                location.href = '/timeline/recommend';
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
                  location.href = '/timeline/recommend';
                }, err => {
                  Util.UI.toast('文章发布失败!', 'error')
                })
              }
          } else {
            Util.UI.toast('内容未填完，验证不通过!', 'warning');
            if (!this.editData.content) {
              this.saved = false;
              this.editorTips = '编辑的内容是空的，是不是没有保存？';
              this.iconClass = 'icon-cuowu';
            }
            return false;
          }
        });
      },
    },
    components: {
      IndexHeader,
      DropdownMenu,
      DropdownItem,
      Dropdown,
      myEditor
    },
  }
</script>

<style lang="scss">
.form-edit .el-upload-list--picture-card {
  width: 200px;
}
.form-edit .upload-wrap {
  height: 145px!important;
}
.form-edit .el-upload--picture-card {
  width: 80px;
  height: 80px!important;
  line-height: 80px;
}
.form-edit .el-upload-list--picture-card .el-upload-list__item {
  height: 100px;
}
.form-edit .el-upload__tip {
  line-height: 20px;
}
.tag .el-form-item__content {
  width: 330px;
}
.tag .el-select {
  width: 130px;
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

.page-edit {
  .edit-wrap {
    margin: 20px auto 80px;
    padding-bottom: 1px;
    background: #fff;
    .form-edit{
      max-width: 100%;
      position: relative;
      z-index: 9;
      .title {
        max-width: 650px;
      }
      .summary {
        max-width: 650px;
      }
      .category {
        width: 240px;
      }
      .tag {
        width: 260px;
        .tag-tip {
          font-size: 13px;
          margin-left: 10px;
          color: #888;
        }
      }
    }
    .m-form-edit {
      .title {
        width: 240px!important;
      }
      .summary {
        width: 240px!important;;
      }
    }
    .editor-tips {
      padding: 10px 0 15px 20px;
      font-size: 13px;
      margin: 0;
      vertical-align: top;
      color: #F56C6C;
      .save {
        color: $brand-primary;
      }
      .iconfont {
        margin-right: 6px;
      }
      .tips {
        display: inline-block;
        padding-left: 20px;
        font-size: 13px;
        margin: 0;
        strong {
          color: #F56C6C;
        }
      }
    }
    .update-time {
      padding: 10px;
      font-size: 13px;
      color: #aaa;
    }
  }
}

</style>
