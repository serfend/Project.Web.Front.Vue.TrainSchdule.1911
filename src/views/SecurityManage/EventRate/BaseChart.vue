<template>
  <div
    :style="{height:height,width:width,display:'flex','align-items': 'center'}"
    @mouseenter="userSelect = true"
    @mouseleave="userSelect = false"
  >
    <div v-if="data && data[0] && data[0][0] && data[0][0].data" ref="chart" class="chart" />
    <NoData v-else />
  </div>
</template>

<script>
import * as echarts from 'echarts'
import { parseTime } from '@/utils'
export default {
  name: 'EventRateBaseChart',
  components: {
    NoData: () => import('@/views/Loading/NoData')
  },
  props: {
    width: { type: String, default: '100%' },
    height: { type: String, default: '300px' },
    color: { type: Array, default: () => [] },
    data: { type: Array, default: null },
    type: { type: String, default: 'bar' },
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
        this.$nextTick(() => {
          this.initChart()
        })
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
    setOpt (directClear) {
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
      let total_value = series.reduce((prev, current) => prev + current.data, 0)
      if (Object.prototype.toString.call(total_value) === '[object String]')total_value = -1 // 当计算失败时将总数作废
      const percent = (v) => {
        const r = Math.floor(10000 * (((v.data && v.data.value || v.data) || v.value) / total_value)) / 100
        return [r, total_value < 0 ? '' : `(${r}%)`]
      }

      const option = {
        color: this.color,

        label: {
          show: true,
          formatter: (v) => {
            const p = percent(v)
            if (p[0] < 30) return '' // 过短时不显示
            const d = v.data
            if (d && d.name) return `${d.name}:${d.value} ${p[1]}`
            const raw = `${v.seriesName} ${v.value}${p[1]}`
            return raw
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
              result.push(`${v.marker}${v.seriesName}:${v.data}${percent(v)[1]}`)
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
        xAxis: {
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
        },
        yAxis: {
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
      }

      if (this.type === 'line') {
        option.xAxis = {
          type: 'category',
        }
        option.yAxis = { type: 'value' }
        option.label = { show: false }
        series.map(i => {
          const single_day = 86400e3
          let date = new Date() - i.data.length * single_day
          i.data = i.data.map((x, index) => {
            date += 86400e3
            return [parseTime(new Date(date), '{d}日'), x]
          })
        })
      } else if (this.type === 'radar') {
        series = series
          .sort((a, b) => a.data - b.data)
          .slice(0, 6)
        if (series.length < 6)series = series.concat(new Array(6 - series.length).fill(0).map(i => ({ name: '无数据', data: 0 })))
        const max_value = series.reduce((prev, cur, cur_index) => prev < cur.data ? cur.data : prev, 0) * 1.2 + 1
        const data = {
          data: [{ value: series.map(i => i.data), name: '事件占比' }],
          name: '占比',
          type: 'radar'
        }
        option.label = { show: false }
        option.radar = {
          indicator: series.map(i => ({ name: i.name, max: max_value }))
        }
        series = [data]
      } else {
        series.map(x => {
          x.itemStyle = {
            shadowBlur: 200,
            shadowColor: 'rgba(0, 0, 0, 0.5)'
          }
        })
      }

      if (this.type === 'pie') {
        option.radius = '80%'
        option.tooltip = {
          trigger: 'item'
        }
        // 饼状图只支持一个系列
        const s = series[0]
        if (s) {
          s.data = series.map(i => ({ name: i.name, value: i.data }))
          s.label = { show: false }
          series = [s]
        }
        delete option.legend
      } else if (this.type === 'radar') {
        option.tooltip = {
          trigger: 'item'
        }
      } else {
        series.map(i => {
          if (Object.prototype.toString.call(i.data) === '[object Array]') return
          i.data = [i.data]
        })
      }

      option.series = series
      this.chart.setOption(option)
    },
    initChart () {
      const el = this.$refs.chart
      if (!el) return
      if (this.chart) this.chart.dispose()
      this.chart = echarts.init(el)
      this.chart.on('click', x => this.$emit('chartClick', x))
      this.initChartSkeleton()
      this.nextShowOfData()
    },
    initChartSkeleton() {
      this.refresh()
    }
  }
}
</script>

<style scoped lang="scss">
.chart{
  height:100%;
  width:100%;
}
</style>
