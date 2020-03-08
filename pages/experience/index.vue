<template>
  <div class="page-archive">
    <el-timeline>
      <el-timeline-item
        v-for="(item, index) in experienceList"
        :key="index"
        type="success "
        placement="top"
        hide-timestamp>
        <el-card>
          <h3 class="title">{{item.title}}</h3>
          <p class="description">{{ item.description }}</p>
          <p class="time">
            <span>{{item.start_time  || ''}}</span> -- 
            <span>{{item.end_time || ''}}</span>
          </p>
        </el-card>
      </el-timeline-item>
    </el-timeline>
  </div>
</template>

<script>
import Api from '~/utils/api'
import { Timeline, TimelineItem } from 'element-ui';
export default {
  layout: 'article',
  head() { 
    return {
      title: '历程',
      meta: [
        { hid: 'keywords', name: 'keywords', content: '历程'},
        { hid: 'description', name: 'description', content: '蒋少川从事前端的个人历程' }
      ]
    }
  },
  data() {
    return {
      experienceList: [],
      experience: [
        {
          title: 'vue-nuxt-mongodb版网站',
          description: '一直想学mongodb，成为较为全栈的工程师，后来经历了公司的nuxt项目，就开始了全栈之路。。。',
          start_time: '2020-02-05',
          end_time: '2020-02-20'
        },
        {
          title: '第一个个人博客网站',
          description: '作为程序员的自己，一直有一个做自己网站的想法，从购买阿里云服务器、域名，到部署上线，入了很多坑。最开始那个时候还是用bootstrap写的静态网站啊。',
          start_time: '2020-02-05',
          end_time: '2019-02-20'
        },
        {
          title: '第一个公众号',
          description: '第一家上班公司期间，自己申请了一个微信订阅号，起名叫“川仔先生”，后改为自己的名字',
          start_time: '2020-02-05',
          end_time: '2019-02-20'
        },
        {
          title: '毕业了--北京工商大学',
          description: '北漂读大学的四年，丰富多彩',
          start_time: '2020-02-05',
          end_time: '2019-02-20'
        },
        {
          title: '第一次接触前端',
          description: '那是还在58到家的时候，那个时候实习运营方面的工作，需要简单用HBuilder写简单的表格和图片，然后复制网址到“截屏”软件，然后生成图片。对此感兴趣，然后就开始自学前端。',
          start_time: '2020-02-05',
          end_time: '2019-02-20'
        },
      ]
    }
  },
  components: {
    Timeline,
    TimelineItem
  },
  mounted() {
    this.getExperienceList();
  },
  methods: {
    getExperienceList() {
      Api.getExperienceList()
        .then(res => {
          if (res.status === 200 && res.data && res.data.data.list) {
            let experienceList = res.data.data.list;
            this.experienceList = experienceList;
          }
      }).catch (err => {
        console.log('报错了啊')
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.page-archive {
  padding: 40px 0;
  .year {
    font-size: 30px;
    font-weight: bold;
    color: #000;
    margin-top: 0;
  }
  a {
    text-decoration: none;
  }
  .title {
    color: #333;
    font-weight: 600;
  }
  .description {
    padding: 6px 0;
    color: #333;
    font-size: 13px;
    line-height: 1.5;
  }
  .time {
    color: #666;
    font-size: 12px;
  }
}
</style>
