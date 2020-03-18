<template>
  <section class="container">
    <div class="list">
      <el-table
        :data="managerList"
        stripe
        style="width: 100%">
        <el-table-column
          type="index"
          fixed
          label="序号"
          width="50">
        </el-table-column>
        <el-table-column
          prop="userName"
          label="管理员姓名"
          width="100">
        </el-table-column>
        <el-table-column
          prop="create_time"
          label="注册时间"
          width="180">
        </el-table-column>
        <el-table-column
          prop="email"
          label="邮箱账号"
          width="160">
        </el-table-column>
        <el-table-column
          prop="avatar"
          label="头像"
          width="120">
          <template slot-scope="scope">
            <img :src="scope.row.avatorSrc" alt="">
          </template>
        </el-table-column>
        <el-table-column
          prop="introduce"
          label="个人介绍"
          width="80">
        </el-table-column>
        <el-table-column
          fixed="right"
          label="操作"
          width="260">
          <template slot-scope="scope">
            <el-button disabled size="mini" type="success" @click="editFn(scope.row._id)">修改</el-button>
            <el-button :disabled="scope.row.userName === '益码凭川'" size="mini" type="danger" @click="deletFn(scope.row._id)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <my-page v-on:page-change="onPageChange" :pageSize="pageSize" :total="records" :currentPage="pageIndex"></my-page>
    </div>

  </section>
</template>

<script>
  import Api from '~/utils/api'
  import MyPage from '~/components/PageAction'
  import Cookie from 'js-cookie'
  export default {
    middleware: 'auth',
    layout: 'admin',
    head() {
      return {
        title: '后台-列表页',
        meta: [
          { hid: 'description', name: 'description', content: '这是useryemian一段描述文字' }
        ]
      }
    },
    data(){
      return {
        managerList: [],
        records: 0, // 总数据条数
        pageIndex: 1, // 当前页
        pageSize: 10, // 每页数
      }
    },
    mounted() {
      this.getManagerList();
    },
    methods: {
      getManagerList() {
        let postParams = {
          pageIndex: this.$route.params.id,
          pageSize: 10
        }
        return Api.getManagerList(postParams)
            .then(res => {
              let { records, pageSize, pageIndex } = res.data.data;
              this.managerList = res.data.data.list;
              this.records = records;
              this.pageSize = pageSize;
              this.pageIndex = pageIndex
            }).catch (err => {
              console.log('报错了啊')
        })
      },
      deletFn(id) {
        Util.UI.confirm('确定删除这个管理员吗?', '提示').then(() => {
          Api.deleteManager({id})
            .then(res => {
              Util.UI.toast('文章删除成功!', 'success')
              this.getManagerList();
            })
          }, () => {
            console.log('取消了')
          })
      },
      onPageChange(e) {
        this.$router.push(`/admin/user/manager/${e}`)
      }
    },
    components: {
      MyPage
    }
  }
</script>

<style scoped lang="scss">
  li {
    overflow: hidden;
    padding: 6px 0;
    border-bottom: 1px solid #f7f7f7;
    line-height: 29px;
  &:hover {
     background: #f7f7f7;
   }
  }
  
  .list {
    .list-ul {
      display: block;
      li {
        width: 100%;
        display: flex;
        justify-content: space-between;
        overflow: hidden;
        .serial {
          display: inline-block;
          margin-right: 10px;
        }
        a {
          width: 70%;
          overflow: hidden;
          white-space: wrap;
        }
        .handle {
          a{
            margin-left: 20px;
            font-size: 12px;
            color: #666;
          }
          button{
            margin-left: 20px;
            font-size: 12px;
            color: #fff;
          }
        }
      }
    }
  }
</style>
