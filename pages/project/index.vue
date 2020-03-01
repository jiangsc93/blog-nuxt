<template>
  <div class="project">
    <el-row :gutter="20">
      <el-col :span="12" v-for="item in projectList" :key="item._id" style="margin-bottom: 20px">
        <el-card :body-style="{ padding: '0px' }" class="project-item" shadow="hover">
          <a :href="item.link || 'https://github.com/jiangsc93'" target="_blank">
            <img class="image" :src="item.imgSrc">
            <div style="padding: 14px;">
              <h5 class="title">{{item.title}}</h5>
              <div class="desc ellipsis-line3">{{item.description}}</div>
              <div class="time-wrap clearfix">
                <span class="time">{{item.start_time}}</span> --
                <span class="time">{{item.end_time}}</span>
              </div>
            </div>
          </a>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import Api from '~/utils/api'
import { Row, Col, Card } from 'element-ui'
export default {
  layout: 'article',
  head() {
    return {
      title: '项目',
      meta: [
        { id: 'keywords', hid: 'keywords', name: 'keywords', content: '' },
        { id: 'description', hid: 'description', name: 'description', content: '蒋少川的个人博客' },
      ]
    }
  },
  asyncData ({ error }) {
    return Api.getProjectList()
        .then(res => {
          if (res.status === 200 && res.data && res.data.data && res.data.data.list) {
            return { projectList: res.data.data.list }
          }
      }).catch (err => {
      console.log('报错了啊')
    })
  },
  data () {
    return {
      projectList: []
    }
  },
  components: {
    Row,
    Col,
    Card
  },
  mounted() {

    // document.title = this.item.title;
    // document.querySelector("#keywords").setAttribute("content", this.item.tag);
    // document.querySelector("#description").setAttribute("content", this.item.summary);
  },
  methods: {
    handleTag(tag) {
      if (tag) return tag.split(',')
    }
  }
}
</script>

<style lang="scss">
.project {
  margin: 50px 0;
  .image {
    width: 100%;
    height: 220px;
  }
  .title {
    margin: 0 0 10px 0;
  }
  .desc {
    height: 60px;
    font-size: 13px;
    line-height: 1.5;
  }
  .project-item {
    cursor: pointer;
    a {
      color: inherit;
    }
  }
}

.time-wrap {
  font-size: 13px;
  color: #999;
  margin-top: 13px;
  line-height: 12px;
}

.clearfix:before,
.clearfix:after {
    display: table;
    content: "";
}

.clearfix:after {
    clear: both
}
</style>
