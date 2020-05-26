<template>
  <div :style="{height:height,width:width}" />
</template>

<script>
import echarts from 'echarts'
export default {
  name: 'VacationStatisticsBar',
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
      title: '加载中',
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
      this.chart.showLoading()
      if (!this.data || !this.data[this.nowIndex]) return
      var series = this.data[this.nowIndex].data.map(d => {
        return {
          name: '未命名',
          type: 'bar',
          data: [],
          itemStyle: {
            barBorderRadius: 5
          },
          ...d
        }
      })
      this.title = this.data[this.nowIndex].name
      var option = {
        color: this.color,
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            // 坐标轴指示器，坐标轴触发有效
            type: 'shadow' // 默认为直线，可选为：'line' | 'shadow'
          }
        },
        // 修改图表的大小
        grid: {
          left: '0%',
          top: '0.0125rem',
          right: '0%',
          bottom: '4%',
          containLabel: true
        },
        xAxis: [
          {
            type: 'category',
            data: this.companies.map(c => c.name),
            axisTick: {
              alignWithLabel: true
            },
            // 修改刻度标签 相关样式
            axisLabel: {
              color: 'rgba(255,255,255,.6) ',
              fontSize: '12'
            },
            // 不显示x坐标轴的样式
            axisLine: {
              show: false
            }
          }
        ],
        yAxis: [
          {
            type: 'value',
            // 修改刻度标签 相关样式
            axisLabel: {
              color: 'rgba(255,255,255,.6) ',
              fontSize: 12
            },
            // y轴的线条改为了 2像素
            axisLine: {
              lineStyle: {
                color: 'rgba(255,255,255,.1)',
                width: 2
              }
            },
            // y轴分割线的颜色
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
      this.chart.hideLoading()
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
