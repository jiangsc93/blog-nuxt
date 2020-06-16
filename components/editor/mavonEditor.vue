<template>
  <div>
    <no-ssr><mavon-editor ref="md" :toolbars="markdownOption" @save="onSave" @imgAdd="$imgAdd" v-model="handbook"/></no-ssr>
  </div>
</template>
<script>
import axios from 'axios';
import  'mavon-editor/dist/css/index.css'
export default {
  props: ['content'],
  data() {
    return {
      markdownOption:{
        bold: true, // 粗体
        italic: true, // 斜体
        header: true, // 标题
        underline: true, // 下划线
        strikethrough: true, // 中划线
        mark: true, // 标记
        superscript: true, // 上角标
        subscript: true, // 下角标
        quote: true, // 引用
        ol: true, // 有序列表
        ul: true, // 无序列表
        link: true, // 链接
        imagelink: true, // 图片链接
        code: true, // code
        table: true, // 表格
        fullscreen: true, // 全屏编辑
        readmodel: false, // 沉浸式阅读
        htmlcode: true, // 展示html源码
        help: true, // 帮助
        undo: true, // 上一步
        redo: true, // 下一步
        trash: true, // 清空
        save: true, // 保存（触发events中的save事件）
        navigation: true, // 导航目录
        alignleft: true, // 左对齐
        aligncenter: true, // 居中
        alignright: true, // 右对齐
        subfield: true, // 单双栏模式
        preview: true, // 预览
      },
      handbook: '',
      img_file: {}
    }
  },
  watch: {
    content(val) {
      this.handbook = val;
    }
  },
  methods: {
    onSave() {
      this.$emit('saveContent', this.handbook);
    },
    $imgAdd(pos, $file){
      // 缓存图片信息
      this.img_file[pos] = $file;
      // 将图片上传到服务器.
      var formdata = new FormData();
      formdata.append('file', $file);
      axios({
          url: `${this.$store.state.apiHttpUpload}/api/upload`,
          method: 'post',
          data: formdata,
          headers: { 'Content-Type': 'multipart/form-data' },
      }).then(res => {
        let { name, url } = res.data.data;
          // $vm.$img2Url  将md源码中图片文件名替换为url(如![h](./0) -> ![h](http://path/to/png/some.png))
          let imgUrl = `${this.$store.state.imgurlhttp}${url}`
          this.$refs.md.$img2Url(pos, imgUrl);
      })
    }
  }
}
</script>
