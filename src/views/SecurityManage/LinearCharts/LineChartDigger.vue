<template>
  <div
    :style="{height:height,width:width,display:'flex','align-items': 'center'}"
    @mouseenter="userSelect = true"
    @mouseleave="userSelect = false"
  >
    <el-button v-show="hasParent" type="text" style="position: absolute;top:0;z-index: 1;" @click="digger_data(-1)">返回</el-button>
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
    data: {
      type: Array,
      default: () => [
        [
          {
            name: '单位A',
            data: [1, 4, 9, 5, 3],
            children: [
              {
                name: '单位A1',
                data: [1, 2, 1, 2, 1],
                children: [{ name: '姓名XXX', data: [1, 1] }]
              }
            ]
          },
          { name: '单位B', data: [4, 9, 5, 3, 4] },
          { name: '单位C', data: [9, 5, 3, 4, 5] }
        ]
      ]
    },
    type: { type: String, default: 'bar' },
  },
  data: () => ({
    chart: null,
    refresher: null,
    nowIndex: 0,
    userSelect: false,
    currentData: {}, // index:{parent:obj,data:item}
    hasParent: false
  }),
  computed: {
    currentFocusData () {
      const data = this.currentData[this.nowIndex]
      return data
    }
  },
  watch: {
    currentData: {
      handler (v) {
        this.updateValue()
      },
      immediate: true,
      deep: true
    },
    nowIndex: {
      handler (v) {
        this.updateValue()
      }
    },
    data: {
      handler (v) {
        this.$nextTick(() => {
          this.initChart()
        })
        this.currentData = {}
        if (!v) return
        v.map((x, index) => {
          this.currentData[index] = { parent: [], data: x }
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
      const nowGroup = this.currentFocusData && this.currentFocusData.data
      if (!nowGroup) return
      const series = nowGroup.map(d => ({
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
        return total_value < 0 ? '' : `(${r}%)`
      }

      const option = {
        color: this.color,
        label: {
          show: false,
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
              result.push(`${v.marker}${v.seriesName}:${v.data}${percent(v)}`)
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
          type: 'category'
        },
        yAxis: {
          type: 'value',
        }
      }

      series.map(i => {
        const single_day = 86400e3
        let date = new Date() - i.data.length * single_day
        i.data = i.data.map((x, index) => {
          date += 86400e3
          return [parseTime(new Date(date), '{d}日'), x]
        })
      })

      option.series = series
      this.chart.setOption(option)
    },
    initChart () {
      const el = this.$refs.chart
      if (!el) return
      if (this.chart) this.chart.dispose()
      this.chart = echarts.init(el)
      this.chart.on('click', this.onClick)
      this.initChartSkeleton()
      this.nextShowOfData()
    },
    initChartSkeleton() {
      this.refresh()
    },
    onClick (x) {
      // this.currentFocus
      const index = this.currentFocusData.data.findIndex(i => i.name === x.seriesName)
      this.digger_data(index)
      this.$emit('chartClick', x)
    },
    digger_data (index = -1) {
      // -1表示返回上级 ， 否则深入第index子层级
      const data = this.currentFocusData
      if (index === -1) {
        data.data = data.parent.pop()
      } else {
        const newData = data.data[index]
        if (!newData || !newData.children) return this.$message.warning('该节点没有更多信息')
        data.parent.push(data.data)
        data.data = newData.children
      }

      this.updateValue() // 似乎属性不生效 ， 故强制刷新
      this.refresh()
    },
    updateValue () {
      const data = this.currentFocusData
      const r = !!(data && data.parent && data.parent.length)
      this.hasParent = r
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
