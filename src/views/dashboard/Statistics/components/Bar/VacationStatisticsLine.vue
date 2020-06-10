<template>
  <div :style="{height:height,width:width}" />
</template>

<script>
import echarts from 'echarts'
import { createLinerSeries } from '../../js/linerGradient'
export default {
  name: 'VacationStatisticsLine',
  props: {
    width: {
      type: String,
      default: '100%'
    },
    height: {
      type: String,
      default: '300px'
    },
    fileLoad: {
      type: Function,
      default: null
    },
    color: {
      type: Array,
      default() {
        return []
      }
    },
    companies: {
      type: Array,
      default() {
        return []
      }
    },
    data: {
      type: Array,
      default() {
        return []
      }
    }
  },
  data() {
    return {
      title: '休假情况趋势',
      chart: null,
      refresher: null,
      nowIndex: 0
    }
  },
  mounted() {
    this.initChart()
  },
  beforeDestroy() {
    if (!this.chart) {
      return
    }
    this.checkTimeOut()
    this.chart.dispose()
    this.chart = null
  },
  methods: {
    checkTimeOut() {
      if (this.refresher) clearTimeout(this.refresher)
      this.refresher = null
    },
    async nextShowOfData() {
      this.checkTimeOut()
      if (this.data && this.data.length > 0) {
        this.nowIndex++
        if (this.nowIndex >= this.data.length) this.nowIndex = 0
        this.refresh()
      }
      this.refresher = setTimeout(this.nextShowOfData, 15000)
    },
    refresh() {
      var base = +new Date(2020, 0, 0)
      var oneDay = 24 * 3600 * 1000
      var date = []
      var sTitle = ['已休假人数', '休假满60%人数', '休满假人数', '休假中人数']
      var sTlength = sTitle.length
      var totalMemberCount = 3221
      var data = [[0], [0], [0], [totalMemberCount / 12]]
      var highDay = [67, 168, 304] // 休假高峰
      var rand = 0.3
      for (let i = 1; i < 360; i++) {
        var now = new Date((base += oneDay))
        date.push(
          [now.getFullYear(), now.getMonth() + 1, now.getDate()].join('/')
        )
        var k = highDay.reduce((prev, cur, index) => {
          return Math.min(Math.abs(cur - i), prev)
        })
        k = 365 - k
        for (var j = 0; j < sTlength; j++) {
          var t =
            (Math.random() * ((sTlength - j - 1) * 2 - rand * 2) + rand) / 100
          t = t * Math.pow(k / 365, 2)
          var leftMember = totalMemberCount - data[j][i - 1]
          if ((j === 1 || j === 2) && i < 30) t = t * (i / 30)
          data[j].push(t * leftMember + data[j][i - 1])
        }
      }

      var series = []
      for (let i = 0; i < sTlength; i++) {
        var iData = data[i].map(d => Math.round(d))
        var iColor = this.color[i % this.color.length]
        var item = createLinerSeries(sTitle[i], iColor, iData)
        series.push(item)
      }
      var option = {
        title: {
          show: false
        },
        tooltip: {
          trigger: 'axis'
        },
        legend: {
          type: 'scroll',
          bottom: 0,
          inactiveColor: '#aaa',
          textStyle: { color: '#fff' }
        },
        dataZoom: [
          {
            type: 'slider',
            show: true,
            start: 94,
            end: 100,
            bottom: '10%',
            height: '7%',
            textStyle: {
              color: '#fff'
            }
          },
          {
            type: 'inside',
            start: 94,
            end: 100
          }
        ],
        grid: [{ x: '13%', bottom: '25%', width: '80%', height: '60%' }],
        xAxis: [
          {
            type: 'category',
            boundaryGap: false,
            // x轴更换数据
            data: date,
            // 文本颜色为rgba(255,255,255,.6)  文字大小为 12
            axisLabel: {
              textStyle: {
                color: 'rgba(255,255,255,.6)',
                fontSize: 12
              }
            },
            // x轴线的颜色为   rgba(255,255,255,.2)
            axisLine: {
              lineStyle: {
                color: 'rgba(255,255,255,.2)'
              }
            }
          }
        ],
        yAxis: [
          {
            type: 'value',
            min: function(value) {
              return value.min - 20
            },
            axisTick: { show: false },
            axisLine: {
              lineStyle: {
                color: 'rgba(255,255,255,.1)'
              }
            },
            axisLabel: {
              textStyle: {
                color: 'rgba(255,255,255,.6)',
                fontSize: 12
              }
            },
            // 修改分割线的颜色
            splitLine: {
              lineStyle: {
                color: 'rgba(255,255,255,.1)'
              }
            }
          }
        ],
        series: series
      }
      this.chart.setOption(option)
    },
    initChart() {
      this.chart = echarts.init(this.$el)
      this.initChartSkeleton()
      this.nextShowOfData()
    },
    initChartSkeleton() {
      this.refresh()
    }
  }
}
</script>
