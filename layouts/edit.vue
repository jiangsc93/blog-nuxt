<template>
  <div>
    <my-header></my-header>
    <div class="edit container">
      <nuxt/>
      <el-form :model="editData" :rules="rules" ref="editForm" label-width="100px" class="form-edit">
        <el-form-item label="文章标题" prop="title">
          <el-input v-model="editData.title"></el-input>
        </el-form-item>
        <el-form-item label="作者" prop="author">
          <el-input v-model="editData.author"></el-input>
        </el-form-item>
        <el-form-item label="文章类型" prop="type">
          <el-select v-model.trim="editData.type" @change="onChange()" placeholder="请选择文章类型">
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
            @change="onChange()"
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
        <el-form-item label="文章内容" prop="content">
          <div class="quill-editor"
               :content="editData.content"
               @change="onEditorChange($event)"
               @blur="onEditorBlur($event)"
               @focus="onEditorFocus($event)"
               @ready="onEditorReady($event)"
               v-quill:myQuillEditor="editorOption">
          </div>
        </el-form-item>
        <!-- <textarea id="editor" style={{ marginBottom: 20, width: 800 }} size="large" rows={6} /> -->

        <el-form-item>
          <el-button type="primary" @click="submitNews('editForm')">立即发表</el-button>
          <el-button @click="resetForm('editForm')">重置</el-button>
        </el-form-item>
      </el-form>
    </div>
    <my-footer></my-footer>
  </div>
</template>

<script>
  import Api from '~/utils/api'
  import 'quill/dist/quill.snow.css'
  import 'quill/dist/quill.bubble.css'
  import 'quill/dist/quill.core.css'
  import MyHeader from '~/components/header'
  import MyFooter from '~/components/Footer'
  import Cookie from 'js-cookie'
  import { DropdownMenu, DropdownItem, Dropdown } from 'element-ui'
  // import 'simplemde/dist/simplemde.min.css';
  // import SimpleMDE from 'npm install simplemde --save';
  // import marked from 'marked';
  // import highlight from 'highlight.js';
  const moment = require('moment');

  let authUser =  eval('(' + Cookie.get('authUser') + ')');
  export default {
    data(){
      return {
        // smde: null,
        optionsTags: [{
          value: 'HTML',
          label: 'HTML'
        }, {
          value: 'CSS',
          label: 'CSS'
        }, {
          value: 'JavaScript',
          label: 'JavaScript'
        }],
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
          beginDate: '',
          lastDate: '',
          type: '',
          tag: '',
          content: ''
        },
        rules: {
          title: [
            { required: true, message: '请输入文章标题', trigger: 'blur' },
            { min: 5, message: '长度在不得少于5个字符', trigger: 'blur' }
          ],
          author: [
            { required: true, message: '请输入文章作者', trigger: 'blur' }
          ],
          type: [
            { required: true, message: '请输入文章类型', trigger: 'blur' }
          ],
          tag: [
            { required: true, message: '请输入文章所属标签', trigger: 'blur' }
          ],
          content: [
            { required: true, message: '请输入文章内容', trigger: 'blur' }
          ]
        },
        editorOption: {
          // some quill options
          modules: {
            toolbar: [
              ['bold', 'italic', 'underline', 'strike'],        // toggled buttons
              ['blockquote', 'code-block'],
              [{ 'list': 'ordered'}, { 'list': 'bullet' }],
              [{ 'script': 'sub'}, { 'script': 'super' }],      // superscript/subscript
              [{ 'indent': '-1'}, { 'indent': '+1' }],          // outdent/indent
              [{ 'direction': 'rtl' }],                         // text direction
              [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
              [{ 'color': [] }, { 'background': [] }],          // dropdown with defaults from theme
              [{ 'font': [] }],
              [{ 'align': [] }],
              ['clean']
            ]
          }
        }

      }
    },
    beforeMount () {
      if (!this.$route.params.id) return;
      Api.newsOne(this.$route.params.id)
        .then(res => {
          this.editData.title = res.data.title;
          this.editData.author = res.data.author;
          this.editData.lastDate = res.data.lastDate;
          this.editData.type = res.data.type;
          this.editData.tag = res.data.tag.split(','); // 字符串切换成数组
          this.editData.content = res.data.content;
        }, err => {
          console.log('报错啦', err)
        })
    },
    mounted() {
      // this.smde = new SimpleMDE({
      //   element: document.getElementById('editor').childElementCount,
      //   autofocus: true,
      //   autosave: true,
      //   previewRender(plainText) {
      //     return marked(plainText, {
      //       renderer: new marked.Renderer(),
      //       gfm: true,
      //       pedantic: false,
      //       sanitize: false,
      //       tables: true,
      //       breaks: true,
      //       smartLists: true,
      //       smartypants: true,
      //       highlight(code) {
      //         return highlight.highlightAuto(code).value;
      //       },
      //     });
      //   },
      // });
      // console.log(this.smde, 'ddd');
    },
    methods: {
      onChange(val) {

        console.log(this.editData.type, 'cal');
        console.log(this.editData.tag, 'tag');
      },
      handleClick() {
        alert('button click');
      },
      resetForm(formName) {
        this.$refs[formName].resetFields();
      },
      submitNews(formName) {

        this.$refs[formName].validate((valid) => {
          if (valid) {
            this.editData.author = this.editData.author ? this.editData.author : '佚名';
            this.editData.tag = this.editData.tag.join(',');
            if (this.$route.params.id) { // 修改,编辑
              this.editData.lastDate = moment(Date.now()).format('YYYY-MM-DD HH:mm:ss')
              Api.reEdit(this.$route.params.id, this.editData)
              .then((res) => {
                Util.UI.toast('文章修改成功!', 'success')
              }).then((res) => {
                this.$router.push('/news/list/1')
              }, err => {
                 Util.UI.toast('修改文章失败!', 'error')
              })
            } else{// 新建

              Api.newsEdit(this.editData)
              .then((res) => {
                Util.UI.toast('发表文章成功!', 'success')
              }).then((res) => {
                this.$router.push('/news/list/1')
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

      onEditorBlur(editor) {
        console.log('editor blur!', editor.root)
      },
      onEditorFocus(editor) {
        console.log('editor focus!', editor)
      },
      onEditorReady(editor) {
        console.log('editor ready!', editor)
      },
      onEditorChange({ editor, html, text }) {
        this.editData.summary = text.substr(0,200)
        this.editData.content = html
      }

    },
    components: {
      MyFooter,
      MyHeader,
      DropdownMenu,
      DropdownItem,
      Dropdown
    },
  }
</script>

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
    max-width: 72%;
  }
  .quill-editor {
    min-height: 200px;
    max-height: 400px;
    overflow-y: auto;
  }
</style>
