<template>
  <div
    :style="{
      height: height,
      width: width,
      display: 'flex',
      'align-items': 'center'
    }"
    @mouseenter="userSelect = true"
    @mouseleave="userSelect = false"
  >
    <div v-if="data" ref="chart" class="chart" />
    <NoData v-else />
  </div>
</template>

<script>
import * as echarts from 'echarts'
import 'echarts-gl'
export default {
  name: 'Bar3DChart',
  components: {
    NoData: () => import('@/views/Loading/NoData')
  },
  props: {
    width: { type: String, default: '100%' },
    height: { type: String, default: '300px' },
    data: { type: Array, default: () => [[0, 0, 1], [0, 1, 4], [1, 0, 2]] },
    axis: {
      type: Array,
      default: () => [
        ['A单位', 'B单位', 'C单位'],
        ['7日', '8日', '9日', '10日', '11日', '12日']
      ]
    },
  },
  data: () => ({
    chart: null,
    refresher: null,
    userSelect: false
  }),
  watch: {
    data: {
      handler(v) {
        this.$nextTick(() => {
          this.initChart()
        })
      }
    }
  },
  mounted() {},
  beforeDestroy() {
    if (!this.chart) return
    this.chart.dispose()
    this.chart = null
  },
  methods: {
    refresh(directClear = true) {
      this.chart.showLoading()
      this.setOpt(directClear)
      this.chart.hideLoading()
    },
    setOpt (directClear) {
      if (directClear) this.chart.clear()
      const minmax = this.data.reduce((prev, cur) => {
        if (prev.max < cur[2])prev.max = cur[2]
        if (prev.min > cur[2]) prev.min = cur[2]
        return prev
      }, { max: 0, min: 1e6 })
      const nameTextStyle = {
        color: '#ffffff',
        borderColor: '#ffffff',
      }
      const axis = this.axis
      const option = {
        tooltip: {
          formatter: function (series, ticket, callback) {
            const result = []
            const { value } = series
            if (!value || !value.length) return '未知数据'
            const v = [axis[0][value[0]], axis[1][value[1]], value[2]]
            result.push(series.marker)
            result.push(`<span style="font-size:1rem">${v[0]}${v[1]} : ${v[2]}</span>`)
            return result.join('')
          },
        },
        darkMode: true,
        visualMap: {
          min: minmax.min,
          max: minmax.max,
          inRange: {
            color: '#06c903#1dd000#65e002#b3ef00#fcfe02#feb600#ff7b01#ff3400'.split('#').filter(x => x).map(i => `#${i}`)
          }
        },
        xAxis3D: {
          type: 'category', // 日期
          data: axis[0],
          nameTextStyle,
        },
        yAxis3D: {
          type: 'category', // 单位
          data: axis[1],
          nameTextStyle,
        },
        zAxis3D: {
          type: 'value',
          nameTextStyle,
        },
        grid3D: {
          boxWidth: 200,
          boxDepth: 80,
          axisLine: {
            lineStyle: { color: '#fff' }
          },
          axisPointer: {
            lineStyle: { color: '#fff' }
          },
          viewControl: {
            autoRotate: true
          },
          light: {
            main: {
              intensity: 1.2
            },
            ambient: {
              intensity: 0.3
            }
          }
        },
        series: [
          {
            type: 'bar3D',
            data: this.data.map(i => ({ value: i })),
            shading: 'color',
            label: {
              show: false,
              fontSize: 16,
              borderWidth: 1
            },
            itemStyle: {
              opacity: 0.4
            },
            emphasis: {
              label: {
                fontSize: 20,
                color: '#900'
              },
              itemStyle: {
                color: '#900'
              }
            }
          }
        ]
      }
      this.chart.setOption(option)
    },
    initChart() {
      const el = this.$refs.chart
      if (!el) return
      if (this.chart) this.chart.dispose()
      this.chart = echarts.init(el)
      this.chart.on('click', x => this.$emit('chartClick', x))
      this.refresh()
    }
  }
}
</script>

<style scoped lang="scss">
.chart {
  height: 100%;
  width: 100%;
}
</style>
