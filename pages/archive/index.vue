<template>
  <div class="page-archive">
    <div ref="tag_chart" style="width: 100%;height: 330px;"></div>
    <h3>时间轴</h3>
    <el-timeline :class="isMobile ? 'ul_m' : ''">
      <el-timeline-item
        v-for="it in archiveList"
        :key="it.year"
        type="success"
        placement="top"
        hide-timestamp>
        <h3 class="year">{{it.year}}</h3>
        <el-timeline-item
          v-for="(m, index) in it.list"
          :key="index"
          type="warning"
          placement="top">
          <nuxt-link :to="`/article/${m._id}`" target="_blank">
            <h3 class="title">{{m.title}}</h3>
          </nuxt-link>
          <p class="time">{{m.beginDate}}</p>
        </el-timeline-item>
      </el-timeline-item>
    </el-timeline>
  </div>
</template>

<script>
import echarts from 'echarts';
import Api from '~/utils/api'
import { mapState } from 'vuex';
require('echarts/lib/chart/bar'); //引入柱状图
// 引入提示框和标题组件
require('echarts/lib/component/tooltip');
require('echarts/lib/component/title');
export default {
  layout: 'article',
  head() {
    return {
      title: '归档',
      meta: [
        { hid: 'keywords', name: 'keywords', content: '归档，博客'},
        { hid: 'description', name: 'description', content: '博客笔记的时间档案' }
      ]
    }
  },
  async asyncData() {
    let reqParams = {
      type: '2',
      pageIndex: 1,
      pageSize: 10
    };
    let [res1, res2] = await Promise.all([Api.getArticleList(reqParams), Api.getTagSort()]);
    return { archiveList: res1.data.data.archive, tagList: res2.data.data.tagList, tagNum: res2.data.data.tagNum };
  },
  data() {
    return {
      archiveList: [],
      tagList: [],
      tagNum: [],
    }
  },
  computed: {
    ...mapState(['isMobile'])
  },
  mounted() {
    this.initEchart();
    // this.getArchiveList();
    // this.initTimelineChart();
  },
  methods: {
    initTimelineChart() {
      let timeLineChart = echarts.init(this.$refs.timeline_chart);
      // myChart.showLoading();
      let timeArr = [1, 2, 3, 4];
      let tempCount = 11;
      var timeLineOption = {
					timeline: {
            data: timeArr,
            axisType: 'category',
            zlevel: 4,
            autoPlay: true,
            currentIndex: tempCount,
            playInterval: 3000,
            left: '5%',
            width: '80%',
            //  height: null,
            label: {
              normal: {
                show: true,
                color: '#000',
                interval: '0',
              },
            },
            symbolSize: 10,
            lineStyle: {
              color: '#555'
            },
            checkpointStyle: {
              borderColor: '#44fdff',color:'#44fdff',
              borderWidth: 2
            },
            controlStyle: {
              showNextBtn: true,
              showPrevBtn: true,
              normal: {
                color: '#44fdff',
                borderColor: '#44fdff'
              },
              emphasis: {
                color: '#44fdff',
                borderColor: '#44fdff'
              }
            },
          },
				}
				timeLineChart.setOption(timeLineOption);
    },
    initEchart() {
      let myChart = echarts.init(this.$refs.tag_chart);
      myChart.setOption({
        title: {
          text: '文章标签分类视图'
        },
        // 布局
        grid: {
          left: '40',
          top: '60',
          right: '40',
          // bottom: '30'
        },
        
        legend: {
          icon: 'circle',
          x: 'right',
          data:['红灯','黄灯','绿灯']
        },
        tooltip: {
          // trigger: 'axis',       //触发类型
          // backgroundColor: '#ffffff',  //背景颜色
          // borderColor: '#c63300',   //边框颜色
          borderWidth: 1,   //边框粗细
          textStyle: { color: '#fff'},   //字体样式
        },
        xAxis: {
            data: this.tagList,
            axisLabel: {
              interval: 0,
              rotate: 50
            }

            // axisLabel: {
            //   show: true,
            //   textStyle: {
            //     // color: '#c3dbff',  //更改坐标轴文字颜色
            //     // fontWeight: 'bold',
            //     fontSize : 16      //更改坐标轴文字大小
            //   }
            // },
            // axisTick: {
            //   show: false
            // },
          //   axisLine:{
          //     lineStyle:{
          //       // color:'#315070' //更改坐标轴颜色
          //     }
          // }
        },
        yAxis: {
          // 设置颜色的
          // axisLine: {lineStyle: {color: 'green'}}
          type: 'value',
          scale: true,
          min: 0,
          splitNumber: 3,
          boundaryGap: [0.2, 0.2]
        },
        series: [{
            name: '文章数量',
            type: 'bar',
            // 普通样式。
            // itemStyle: {
            //   // 点的颜色。
            //   color: 'red'
            // },
            label: {
              show: true,
              // 标签的文字。
              // formatter: 'This is a normal label.'
            },
            // color: ['#8dc1a9','#ea7e53','#eedd78','#73a373','#73b9bc','#7289ab', '#91ca8c','#f49f42'],
            data: this.tagNum,
            // hover之后高亮样式。
            // emphasis: {
            //   itemStyle: {
            //     // 高亮时块的颜色。
            //     color: 'blue'
            //   },
            //   label: {
            //     show: true,
            //     // 高亮时标签的文字。
            //     formatter: 'This is a emphasis label.'
            //   }
            // }
        }]
      })
      // myChart.showLoading();
      // Api.getTagSort().then(res => {
      //   if (res.status == 200 && res.data.data.tagList && res.data.data.tagNum) {
      //     myChart.hideLoading();
      //     let tagList = res.data.data.tagList;
      //     let tagNum = res.data.data.tagNum;
         

      //   }
      // })
    },
    goArticle(id) {
      window.location.href = `/article/${id}`;
    },
    getArchiveList() {
      let reqParams = {
        type: '2',
        pageIndex: 1,
        pageSize: 10
      };
      Api.getArticleList(reqParams)
        .then(result => {
          if (result.status === 200 && result.data && result.data.data && result.data.data.archive) {
            this.archiveList = result.data.data.archive;
          }
        }).catch (err => {
          console.log('报错了啊')
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.el-timeline .el-timeline-item:last-child .el-timeline-item__tail {
  display: block!important;
}
.page-archive {
  padding: 40px 0;
  .ul_m.el-timeline {
    padding-left: 10px;
  }
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
    padding-bottom: 6px;
    color: #333;
    &:hover {
      color: #409eff;
    }
  }
  .time {
    color: #333;
  }
}
</style>
