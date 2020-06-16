<template>
  <div class="page-user-setting" :class="{'m-page-user-setting': isMobile}">
    <Index-header :isFixed="true"></Index-header>
    <Nav :navList="navList" :linkUrl="'/user/setting'" :queryObject="{uid: $store.state.userId}"></Nav>
    <div class="content-container common-container">
      <div class="info item-container" :class="{'m-item-container': isMobile}" v-if="$route.params.id === 'info'">
        <h1>个人资料</h1>
        <div class="content setting-list">
          <ul>
            <li class="list-item" v-for="(item, index) in settingList" :key="index">
              <span class="title">{{item.title}}</span>
              <div class="input-wrap">
                <div class="upload" v-if="index === 0">
                  <el-upload class="upload-container"
                      ref="imgUpload"
                      :action="`/api/upload`"
                      :on-remove="handleRemove"
                      :file-list="fileList"
                      list-type="picture-card"
                      :before-upload="beforeAvatarUpload"
                      :auto-upload="true"
                      :multiple="false"
                      :on-change="handleChange"
                      :on-success='handleSucess'
                      :on-error='handleError'>
                      <div class="upload-btn">
                        <div class="tip">支持jpg/png 5M以内</div>
                        <el-button slot="trigger" size="small" type="primary">上传图片</el-button>
                      </div>
                  </el-upload>
                </div>
                <template v-if="index > 0">
                  <input class="input input-box"
                    :placeholder="item.placeholder"
                    @focus="item.beModifiying = true"
                    @blur="onBlur(item)"
                    v-model="item.val"
                    type="text">
                  <div class="handle-wrap">
                    <template v-if="!item.beModifiying">
                      <button class="ui-btn" @click="item.beModifiying = true">
                        <i class="iconfont icon-tubiao09"></i>
                        <span>修改</span>
                      </button>
                    </template>
                    <template v-else>
                      <button class="ui-btn save-btn">
                        <span @click="onSave(item)">保存</span>
                      </button>
                      <button class="ui-btn cancel" @click="onCancel(item)">
                        <span>取消</span>
                      </button>
                    </template>
                  </div>
                </template>
              </div>
            </li>
          </ul>
        </div>
      </div>
      <div class="info item-container __password" :class="{'m-item-container': isMobile}" v-if="$route.params.id === 'password'">
        <h1>修改密码</h1>
        <div class="content setting-list">
          <ul>
            <li class="list-item" v-for="(item, index) in passwordList" :key="index">
              <span class="title">{{item.title}}</span>
              <div class="input-wrap">
                <template>
                  <input class="input input-box"
                    :placeholder="item.placeholder"
                    v-model="item.val"
                    type="password">
                  <a href="/reset-password" v-if="index === 0">忘记密码？</a>
                </template>
              </div>
            </li>
          </ul>
        </div>
        <button class="change-btn" @click="changePwd">确认修改</button>
      </div>
    </div>
  </div>
</template>

<script>
import Cookie from 'js-cookie';
import Api from '~/utils/api'
import { mapState } from 'vuex';
import Nav from '~/components/common/nav';
import IndexHeader from '~/components/header/indexHeader';
import { md5, MD5_SALT } from '../../../utils/md5.js';
let settingList = [
  {
    title: '头像',
    eng: 'avatar',
    val: '',
    placeholder: '',
    beModifiying: false
  },
  {
    title: '用户名',
    eng: 'userName',
    val: '',
    placeholder: '填写你的用户名昵称',
    beModifiying: false
  },
  {
    title: '职位',
    eng: 'position',
    val: '',
    placeholder: '填写你的职位',
    beModifiying: false
  },
  {
    title: '公司',
    eng: 'company',
    val: '',
    placeholder: '填写你的公司',
    beModifiying: false
  },
  {
    title: '个人介绍',
    eng: 'introduce',
    val: '',
    placeholder: '填写你的职业技能，个人爱好等',
    beModifiying: false
  },
  {
    title: '个人主页',
    eng: 'homePage',
    val: '',
    placeholder: '填写你的个人主页',
    beModifiying: false
  },
];
let passwordList = [
  {
    title: '原密码',
    eng: 'oldPwd',
    val: '',
    placeholder: '请输入原密码'
  },
  {
    title: '新密码',
    eng: 'newPwd',
    val: '',
    placeholder: '请输入新密码'
  },
  {
    title: '确认新密码',
    eng: 'sureNewPwd',
    val: '',
    placeholder: '确认新密码'
  },
]
export default {
  middleware: 'checkMobile',
  head() {
    return {
      title: '知否',
      meta: [
        { hid: 'keywords', name: 'keywords', content: 'Html, Css, Javascript, Nuxt, Next,Vue.js,微信小程序,React Native,敏捷开发,Bootstrap,正则表达式,WebGL,Webpack,Docker,MVVM'},
        { hid: 'description', name: 'description', content: '是一个开发者集聚地，分享技术带给我们的收获和快乐' }
      ],
    }
  },
  components: {
    IndexHeader,
    Nav,
  },
  asyncData(req) {
    // if (req.params.id === 'info') {
      return Api.getUserInfo({_id: req.query.uid})
            .then(res => {
              let editData = res;
              if (res.avatar) {
                let file = {
                  name: 'png',
                  url: res.avatar
                };
                let fileList = [];
                fileList.push(file);
                settingList.map((item, index) => {
                  item.val = editData[item.eng];
                })
                return  { editData, fileList, settingList, passwordList };
              }
            }, err => {
              console.log('报错啦', err)
            })
    // }
  },
  data() {
    return {
      fileList: [],
      editData: {},
      navList: [
        {
          name: '个人资料',
          eng: 'info'
        },
        // {
        //   name: '账号关联',
        //   eng: 'account'
        // },
        {
          name: '修改密码',
          eng: 'password'
        },
      ],
      settingList: [],
      passwordList: [],
    }
  },
  computed: {
    ...mapState(['isMobile'])
  },
  mounted() {
  },
  methods: {
    changePwd() {
      let msg = '';
      let isValidatePass = true;
      if (!this.passwordList[0].val) {
        msg = '请输入原密码';
        isValidatePass = false;
      } else if (!this.passwordList[1].val) {
        msg = '请输入新密码';
        isValidatePass = false;
      } else if (!this.passwordList[2].val) {
        msg = '请输入确认密码';
        isValidatePass = false;
      } else if (this.passwordList[2].val !== this.passwordList[1].val) {
        msg = '两次输入密码不一致';
        isValidatePass = false;
      } else if (this.passwordList[2].val === this.passwordList[0].val) {
        msg = '您输入的新密码就是原密码';
        isValidatePass = false;
      }
      if (!isValidatePass) {
        Util.UI.toast(msg, 'warning');
        return;
      };
      // 修改用户资料Api
      let postParams = {
        _id: this.editData._id,
        oldPwd: md5(this.passwordList[0].val + MD5_SALT),
        newPwd: md5(this.passwordList[2].val + MD5_SALT),
      }
      Api.modifyUserInfo(postParams)
        .then(result => {
          if (!result.isModefied) {
            this.passwordList[0].val = '';
            this.passwordList[1].val = '';
            this.passwordList[2].val = '';
            Util.UI.toast('当前原密码错误', 'warning');
          } else {
            this.passwordList[0].val = '';
            this.passwordList[1].val = '';
            this.passwordList[2].val = '';
            Util.UI.toast('密码修改成功', 'success');
          }
        }).catch(() => {
          this.passwordList[0].val = '';
          this.passwordList[1].val = '';
          this.passwordList[2].val = '';
          Util.UI.toast('密码修改失败', 'error');
        })
    },
    // 取消
    onCancel(item) {
      if (item.val === this.editData[item.eng]) {
        item.beModifiying = false;
      } else {
        this.settingList.map((i, index) => {
          if (i.eng === item.eng) {
            i.val = this.editData[item.eng];
          }
        })
        item.beModifiying = false;
      }
    },
    // 失去焦点
    onBlur(item) {
      if (item.val === this.editData[item.eng]) {
        item.beModifiying = false;
      }
    },
    // 保存
    onSave(item) {
      if (item.val === this.editData[item.eng]) {
        item.beModifiying = false;
        return;
      }
      let noPass = false;
      let num = 0;
      let len = item.val.length;
      if (item.eng === 'introduce' && len > 50) {
        noPass = true;
        num = 50;
      } else if (item.eng === 'homePage' && len > 30) {
        noPass = true;
        num = 30;
      } else if ((item.eng === 'userName' || item.eng ===  'position' || item.eng ===  'company') && len > 10) {
        noPass = true;
        num = 10;
      } else {
        noPass = false;
      }
      if (noPass) {
        Util.UI.toast(`长度不能超过${num}`, 'warning');
        return;
      }
      if (item.eng === 'homePage' && item.val.indexOf('http') === -1) {
        Util.UI.toast(`个人主页链接错误`, 'warning');
        return;
      }
      item.beModifiying = false;
      this.editData[item.eng] = item.val;
      Api.modifyUserInfo(this.editData)
        .then(res => {
          Util.UI.toast(`个人资料[${item.title}]修改成功`, 'success');
          if (item.title === '用户名') {
            localStorage.setItem('userName', item.val);
            this.$store.commit('setUserName', item.val);
          }
        }).catch(() => {
          Util.UI.toast('修改资料失败!', 'error');
        })
    },
    handleRemove(file, fileList) {
      fileList.splice(file, 1);
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
        Util.UI.toast(`只能上传 jpg/png文件，且不超过5M`, 'warning');
      }
      return isJPG && isLt2M;
    },
    // 上传成功过后
    handleSucess(response, file, fileList) {
      if (response.code === 200) {
        Util.UI.toast(`${response.message}`, 'success');
        let data = response.data;
        file.name = data.name;
        file.url = this.$store.state.imgurlhttp + data.url;
        this.fileList[0] = file;
        this.editData.avatar = file.url;
        Api.modifyUserInfo(this.editData)
          .then(res => {
            setTimeout(() => {
              Util.UI.toast(`个人资料[个人头像]修改成功`, 'success');
            }, 1000)
            setTimeout(() => {
              window.location.reload();
            }, 1000)
          }).catch(() => {
            Util.UI.toast(`个人资料[个人头像]修改失败`, 'error');
          })
      } else {
        Util.UI.toast(`${response.message}`, 'error');
      }					 
    },
    //上传失败
    handleError(err, file, fileList) {
      Util.UI.toast('上传失败', 'error');
    },
  }
}
</script>

<style lang="scss">
.page-user-setting .upload .el-upload-list--picture-card .el-upload-list__item {
  width: 100px;
  height: 100px;
}
.page-user-setting .upload .el-upload--picture-card {
  display: inline-block;
  border: none;
  background: #fff;
  width: 80px;
  height: 32px;
  line-height: 0;
  margin-top: 40px;
}
.page-user-setting .upload .el-upload--picture-card .upload-btn {
  position: relative;
}
.page-user-setting .upload .el-upload--picture-card .upload-btn .tip {
  position: absolute;
  top: -20px;
  left: -12px;
  width: 140px;
  font-size: 12px;
  display: inline-block;
  height: 30px;
}
.m-page-user-setting .upload .el-upload--picture-card .upload-btn .tip {
  position: absolute;
  top: -20px;
  left: -2px;
  width: 120px;
  font-size: 12px;
  display: inline-block;
  height: 30px;
}
</style>

<style lang="scss" scoped>
.page-user-setting {
  .content-container {
    margin: 124px auto 50px;
    .item-container {
      width: 72%;
      background: #fff;
      padding: 40px 40px 80px;
      &.__password {
        padding: 40px 40px 30px;
      }
      h1 {
        margin: 0;
        padding: 10px 0;
        font-weight: bold;
        font-size: 25px;
        border-bottom: 1px solid #ebebeb;
      }
      .setting-list {
        .list-item {
          padding: 23px 0;
          border-bottom: 1px solid #f0f0f0;
          display: flex;
          align-items: center;
          font-size: 15px;
          .title {
            display: inline-block;
            width: 100px;
          }
          .input-wrap {
            display: inline-flex;
            justify-content: flex-end;
            flex: 1;
            .upload {
              flex: 1;
            }
            .input {
              flex: 1;
              border: none;
              outline: none;
              font-size: 15px;
              color: #909090;
            }
            input::placeholder {
              color: #cdcdcd;
            }
            a {
              color: $brand-primary;
            }
            .handle-wrap {
              width: 80px;
              text-align: right;
              .ui-btn {
                background: transparent;
                border: none;
                outline: none;
                color: $brand-primary;
                cursor: pointer;
                &.cancel {
                  color: #666;
                }
                .iconfont {
                  font-size: 15px;
                  color: $brand-primary;
                  margin-right: 3px;
                }
              }
            }
          }
        }
      }
      &.m-item-container {
        box-sizing: border-box;
        width: 100%;
        padding: 40px 20px 80px;
        .setting-list {
          .list-item {
            .title {
              width: 80px;
            }
          }
        }
      }
      .change-btn {
        display: block;
        padding: 10px 25px;
        margin: 20px auto 0;
        color: #fff;
        border: none;
        outline: none;
        background: $brand-primary;
        border-radius: 3px;
        cursor: pointer;
        &:hover {
          opacity: 0.92;
        }
      }
    }
  }
}
</style>
