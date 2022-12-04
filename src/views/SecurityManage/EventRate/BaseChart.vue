<template>
  <div
    :style="{height:height,width:width,display:'flex','align-items': 'center'}"
    @mouseenter="userSelect = true"
    @mouseleave="userSelect = false"
  >
    <div v-if="data && data[0] && data[0].length" class="chart" />
    <NoData v-else />
  </div>
</template>

<script>
import * as echarts from 'echarts'
export default {
  name: 'EventRateBaseChart',
  components: {
    NoData: () => import('@/views/Loading/NoData')
  },
  props: {
    width: { type: String, default: '100%' },
    height: { type: String, default: '300px' },
    color: { type: Array, default() { return [] } },
    companies: { type: Array, default() { return [] } },
    data: { type: Array, default: () => { } },
    type: { type: String, default: 'bar' }
  },
  data: () => ({
    chart: null,
    refresher: null,
    nowIndex: 0,
    userSelect: false
  }),
  watch: {
    data: {
      handler (v) {
        this.initChart()
      }
    }
  },
  mounted() {

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
      if (!this.userSelect) {
        this.checkTimeOut()
        if (this.data && this.data.length > 0) {
          const lastIndex = this.nowIndex
          this.nowIndex++
          if (this.nowIndex >= this.data.length) this.nowIndex = 0
          if (lastIndex === this.nowIndex) return
          this.refresh(true)
        }
      }
      this.refresher = setTimeout(() => {
        this.nextShowOfData()
      }, 5000)
    },
    refresh(directClear = true) {
      this.chart.showLoading()
      this.setOpt(directClear)
      this.chart.hideLoading()
    },
    setOpt(directClear) {
      if (!this.data) return
      const nowGroup = this.data[this.nowIndex]
      if (!nowGroup) return
      let series = nowGroup.map(d => ({
        name: '未命名',
        type: this.type,
        data: [],
        itemStyle: {
          borderRadius: 5
        },
        ...d
      }))
      if (directClear || this.nowIndex === 0) this.chart.clear()
      const total_value = series.reduce((prev, current) => prev + current.data[0], 0)
      const percent = (v) => Math.floor(10000 * ((v.data || v.value) / total_value)) / 100

      const option = {
        color: this.color,
        label: {
          show: true,
          formatter: (v) => {
            return `${v.seriesName} ${v.value}(${percent(v)}%)`
          }
        },
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            // 坐标轴指示器，坐标轴触发有效
            type: 'shadow' // 默认为直线，可选为：'line' | 'shadow'
          },
          formatter: (data) => {
            const result = []
            data.map(v => {
              result.push(`${v.marker}${v.seriesName}:${v.data}(${percent(v)}%)`)
            })
            return result.join('<br>')
          }
        },
        legend: {
          type: 'scroll',
          bottom: '0%',
          textStyle: {
            color: '#fff'
          },
          inactiveColor: '#aaa'
        },
        // 修改图表的大小
        grid: {
          left: '5%',
          top: '20%',
          right: '5%',
          bottom: '10%',
          containLabel: true
        },
        xAxis: [
          {
            type: 'value',
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
            type: 'category',
            data: [''],
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
        ]
      }
      if (this.type === 'pie') {
        // 饼状图只支持一个系列
        const s = series[0]
        if (s) {
          s.data = series.map(i => i.data && i.data[0])
          s.roseType = 'area'
          s.label = { position: 'inside' }
          series = [s]
        }

        option.coordinateSystem = 'calendar'
        delete option.legend
      }
      option.series = series
      this.chart.setOption(option)
    },
    initChart () {
      const el = this.$el.querySelector('.chart')
      if (!el) return
      echarts.dispose(el)
      this.chart = echarts.init(el)
      this.initChartSkeleton()
      this.nextShowOfData()
    },
    initChartSkeleton() {
      this.refresh()
    }
  }
}
</script>
