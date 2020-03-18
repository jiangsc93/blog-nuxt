<template>
  <section class="container">
    <div class="list">
      <el-table
        :data="articleList"
        stripe
        style="width: 100%">
        <el-table-column
          type="index"
          fixed
          label="序号"
          width="50">
        </el-table-column>
        <el-table-column
          prop="title"
          label="文章标题">
          <template slot-scope="scope">
            <nuxt-link :to="`/admin/article/${scope.row._id}`">{{scope.row.title}}</nuxt-link>
          </template>
        </el-table-column>
        <el-table-column
          prop="beginDate"
          label="创建时间"
          width="180">
        </el-table-column>
        <el-table-column
          prop="author"
          label="作者"
          width="80">
        </el-table-column>
        <el-table-column
          prop="visit"
          label="浏览量"
          width="80">
        </el-table-column>
        <el-table-column
          prop="like"
          label="点赞量"
          width="80">
        </el-table-column>
        <el-table-column
          prop="comments.length"
          label="评论数"
          width="80">
        </el-table-column>
        <el-table-column
          fixed="right"
          label="操作"
          width="260">
          <template slot-scope="scope">
            <el-button size="mini" type="primary" @click="goFn(scope.row._id)">查看</el-button>
            <el-button size="mini" type="success" @click="editFn(scope.row._id)">修改</el-button>
            <el-button size="mini" type="danger" @click="deletFn(scope.row._id)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <my-page v-on:page-change="onPageChange" :pageSize="pageSize" :total="records" :currentPage="pageIndex"></my-page>
    </div>

  </section>
</template>

<script>
  import Cookie from 'js-cookie'
  import Api from '~/utils/api'
  import MyPage from '~/components/PageAction'
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
        articleList: [],
        records: 0, // 总数据条数
        pageIndex: 1, // 当前页
        pageSize: 10, // 每页数
      }
    },
    // asyncData ({ params, error }) {
    //   let authUser = Cookie.get('authUser') ? JSON.parse(Cookie.get('authUser')) : '';
    //   let postParams = {
    //     authore: authUser.userName,
    //     pageIndex: params.id,
    //     pageSize: 10
    //   }
    //   return Api.getArticleListAdmin(postParams)
    //       .then(res => {
    //         let { records, pageSize, pageIndex } = res.data.data;
    //         return { articleList: res.data.data.list, records, pageSize, pageIndex }
    //     }).catch (err => {
    //     console.log('报错了啊')
    //   })
    // },
    mounted() {
      this.getArticleListAdmin();
    },
    methods: {
      getArticleListAdmin() {
        let authUser = Cookie.get('authUser') ? JSON.parse(Cookie.get('authUser')) : '';
        let postParams = {
          author: authUser.userName,
          pageIndex: this.$route.params.id,
          pageSize: 10
        }
        return Api.getArticleListAdmin(postParams)
            .then(res => {
              let { records, pageSize, pageIndex } = res.data.data;
              this.articleList = res.data.data.list;
              this.records = records;
              this.pageSize = pageSize;
              this.pageIndex = pageIndex
            }).catch (err => {
              console.log('报错了啊')
        })
      },
      deletFn(id) {
        Util.UI.confirm('确定删除这篇文章吗?', '提示').then(() => {
          Api.deleteArticleAdmin({id})
            .then(res => {
              Util.UI.toast('文章删除成功!', 'success')
              this.getArticleListAdmin();
            })
          }, () => {
            console.log('取消了')
          })
      },
      editFn(id) {
        this.$router.push(`/admin/edit/${id}`)
      },
      goFn(id) {
        this.$router.push(`/admin/article/${id}`)
      },
      onPageChange(e) {
        this.$router.push(`/admin/article/list/${e}`)
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
