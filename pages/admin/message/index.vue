<template>
  <section class="container">
    <el-table
      :data="messageList"
      stripe
      align="center"
      style="width: 100%">
      <el-table-column
        type="index"
        width="50">
      </el-table-column>
      <el-table-column
        prop="createTime"
        label="日期"
        width="180">
      </el-table-column>
      <el-table-column
        prop="name"
        label="姓名"
        width="100">
      </el-table-column>
      <el-table-column
        prop="email"
        label="邮箱"
        width="150">
      </el-table-column>
      <el-table-column
        prop="phone"
        label="手机号"
        width="120">
      </el-table-column>
      <el-table-column
        prop="sourceStr"
        label="来源"
        width="190">
      </el-table-column>
      <el-table-column
        prop="content"
        label="留言内容">
      </el-table-column>
    </el-table>

  </section>
</template>

<script>
  import Api from '~/utils/api'

  export default {
    middleware: 'auth',
    layout: 'admin',
    head() {
      return {
        title: 'Admin-留言',
        meta: [
          { hid: 'description', name: 'description', content: '留言列表' }
        ]
      }
    },
    data(){
      return {
        messageList: [],
      }
    },
    asyncData ({ params, error }) {
      return Api.getMessageListAdmin(params.id, 10)
          .then(res => {
            let getMessageListAdmin = [];
            return { messageList: res.data.data.list }
        }).catch (err => {
        console.log('报错了啊')
      })
    },
    mounted() {
    },
    methods: {
      
    },
  }
</script>

<style scoped lang="scss">
</style>
