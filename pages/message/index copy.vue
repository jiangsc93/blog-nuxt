<template>
  <div class="message">
    <el-dialog title="收货地址" :visible.sync="dialogFormVisible">
      <el-form :model="form">
        <el-form-item label="活动名称" :label-width="formLabelWidth">
          <el-input v-model="form.name" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="活动区域" :label-width="formLabelWidth">
          <el-select v-model="form.region" placeholder="请选择活动区域">
            <el-option label="区域一" value="shanghai"></el-option>
            <el-option label="区域二" value="beijing"></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="dialogFormVisible = false">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import Api from '~/utils/api'
import markdown from '~/utils/markdown'
import { Dialog, Form, Input, FormItem, Select, Option } from 'element-ui'
export default {
  layout: 'front',
  head() {
    return {
      title: '文章标题',
      meta: [
        { id: 'keywords', hid: 'keywords', name: 'keywords', content: '' },
        { id: 'description', hid: 'description', name: 'description', content: '蒋少川的个人博客' },
      ]
    }
  },
  components: {
    Dialog,
    Form,
    Input,
    FormItem,
    Select,
    Option
  },
  data () {
    return {
      dialogFormVisible: true,
      form: {
        name: '',
        region: '',
        date1: '',
        date2: '',
        delivery: false,
        type: [],
        resource: '',
        desc: ''
      },
      formLabelWidth: '120px'
    }
  },
  beforeMount() {
    
  },
  methods: {
    
  }
}
</script>

<style lang="scss">

</style>
