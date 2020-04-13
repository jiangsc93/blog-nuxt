<template>
  <div>
    <div class="edit container">
      <h3>基本资料</h3>
      <el-form :model="editData" :rules="rules" ref="editForm" label-width="200px" class="form-edit">
       
        <el-form-item class="img-manager" label="头像" prop="avatar">
          <el-upload class="upload-container"
              ref="upload"
              :action="`${$store.state.apiHttp}/api/upload`"
              :on-preview="handlePreview"
              :on-remove="handleRemove"
              :file-list="fileList"
              list-type="picture-card"
              :limit='1'
              :before-upload="beforeAvatarUpload"
              :auto-upload="true"
              :on-success='handleSucess'
              :on-error='handleError'>
              <div class="upload-btn">

                <el-button slot="trigger" size="small" type="primary">上传图片</el-button>
                <div class="tip">只能上传jpg/jpeg/png文件，且不超过 300kb</div>
              </div>
          </el-upload>
        </el-form-item>
         <el-form-item label="用户名(昵称)" prop="userName">
          <span class="name">{{editData.userName}}</span><span class="state">（暂不支持修改）</span>
        </el-form-item>
         <el-form-item label="邮箱" prop="email">
          <span class="name">{{editData.email}}</span><span class="state">（暂不支持修改）</span>
        </el-form-item>
        <el-form-item label="密码修改" prop="newPwd">
          <el-input show-password type="text" class="input-password" placeholder="请输入你要修改的密码" v-model="editData.newPwd"></el-input>
        </el-form-item>
        <el-form-item label="个人介绍" prop="introduce">
          <el-input type="text" placeholder="填写职业技能、擅长的或者喜欢的事情等" v-model="editData.introduce"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="save('editForm')">保存</el-button>
        </el-form-item>
        <div class="manager-tip">系统会自动为您创建一个游客身份账号，账号的头像、邮箱、密码、个人介绍同上，用于回复评论者，您也可以评论您自己或者其他人的文章。
          <br/>
          如果您是修改资料，游客账号的资料也会被同步修改。
        </div>
      </el-form>
    </div>
  </div>
</template>

<script>
  import Api from '~/utils/api'
  import { deepCompare } from '~/utils/utils'
  import Cookie from 'js-cookie'
  import _ from 'lodash'
  import { DropdownMenu, DropdownItem, Dropdown } from 'element-ui'
  
  const moment = require('moment');

  let authUser =  eval('(' + Cookie.get('authUser') + ')');
  export default {
    middleware: 'auth',
    layout: 'admin',
    data(){
      return {
        editData: {
          _id: '',
          avatar: '',
          userName: '',
          newPwd: '',
          introduce: '',
        },
        rules: {
          avatar: [
            { required: true, message: '请上传头像', trigger: 'blur' }
          ],
          introduce: [
            { required: true, message: '请输入个人介绍', trigger: 'blur' }
          ],
        },
        //上传图片参数
        fileList: [],
        originData: {},
      }
    },
    mounted () {
      this.getUserInfo()
    },
    methods: {
      getUserInfo() {
        let params = {
          email: JSON.parse(sessionStorage.getItem('email'))
        }
        Api.getUserInfo(params)
          .then(res => {
            this.editData = res.data.data; // 深拷贝
            this.originData = _.cloneDeep(this.editData);
            if (res.data.data.avatar) {
              let file = {
                name: 'png',
                url: res.data.data.avatar
              }
              this.fileList = [];
              this.fileList.push(file);
            }
          }, err => {
            console.log('报错啦', err)
          })
      },
      handleRemove(file, fileList) {
        fileList.splice(file, 1);
      },
      handlePreview(file) {
        console.log(file);
      },
      //图片上传前
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
          this.fileList[0] = file;
          this.editData.avatar = file.url;
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
      save(formName) {
        if (deepCompare(this.originData, this.editData)) {
          return Util.UI.toast('你并没有做任何修改!', 'warning')
        }
        this.$refs[formName].validate(valid => {
          if (valid) {
              Api.modifyUserInfo(this.editData)
              .then(res => {
                this.fileList = [];
                Util.UI.toast('个人资料修改成功!, 系统已为您同步至游客资料', 'success')
              }).then(res => {
                this.getUserInfo();
              }, err => {
                 Util.UI.toast('修改资料失败!', 'error')
              })
          } else {
            console.log('error submit!!');
            return;
          }
        });
      },
    },
  }
</script>

<style lang="scss">
.img-manager .el-upload-list--picture-card .el-upload-list__item {
  width: 100px;
  height: 100px;
}
.form-edit .author .el-form-item__content .el-input .el-input__inner {
  max-width: 100px!important;
}
.form-edit .type .el-form-item__content .el-input .el-input__inner {
  max-width: 115px!important;
}
.el-form-item__label {
  padding-right: 50px;
}
.el-upload--picture-card {
  border: none;
  background: #fff;
  width: 150px;
  height: 50px;
  line-height: 50px;
}
.upload-container {
  height: 100px;
}
</style>

<style scoped lang="scss">
.upload-btn {
  line-height: 50px;
  .tip {
    width: 300px;
    font-size: 12px;
    height: 20px;
  }
}


.form-edit{
  max-width: 100%;
  .name {
    color: #888;
  }
  .state {
    font-size: 12px;
    color: #ccc;
  }
  .input-password {
    width: 200px;
  }
}
.manager-tip {
  margin-left: 200px;
  font-size: 13px;
  color: #666;
  line-height: 1.8;
}

</style>
