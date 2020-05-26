<template>
  <div :style="{height:height,width:width,opacity:0.8}" />
</template>

<script>
import echarts from 'echarts'
import 'echarts-gl'
import { geoCoordMap } from '../../js/variables'
export default {
  name: 'VacationMap3D',
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
    speed: {
      type: Number,
      default: 1
    }
  },
  data() {
    return {
      chart: null,
      lines: [],
      rotateDirection: 'cw',
      startPlace: ['海淀', '昌平', '石家庄', '襄阳'],
      refresher: null
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
    initChart() {
      this.chart = echarts.init(this.$el)
      this.initChartSkeleton()
      this.loadNewData(30)
    },
    async refresh() {
      this.chart.showLoading()
      await this.nextShowOfData()
      this.chart.hideLoading()
    },
    async nextShowOfData() {
      this.checkTimeOut()
      this.rotateDirection = this.rotateDirection === 'cw' ? 'ccw' : 'cw'
      this.initChartSkeleton()
      this.refresher = setTimeout(this.nextShowOfData, 15000)
    },
    async loadNewData(dataCount) {
      if (!dataCount) dataCount = 1
      var values = Object.values(geoCoordMap)
      var targetRandom = values.length
      this.lines.splice(0, dataCount * this.startPlace.length)
      for (var count = 0; count < dataCount; count++) {
        for (var i = 0; i < this.startPlace.length; i++) {
          var startPlace = this.startPlace[i]
          var itemIndex = Math.floor(Math.random() * targetRandom)
          this.lines.push([
            geoCoordMap[startPlace].concat(0),
            values[itemIndex].concat(0)
          ])
        }
      }
      this.refreshData()
    },
    refreshData() {
      this.chart.setOption({
        series: {
          type: 'lines3D',
          coordinateSystem: 'geo3D',
          effect: {
            show: true,
            trailWidth: 1,
            trailOpacity: 0.5,
            trailLength: 0.2,
            constantSpeed: 5,
            trailColor: '#88f'
          },
          blendMode: 'lighter',
          lineStyle: {
            width: 0.2,
            opacity: 0.05
          },
          data: this.lines
        }
      })
    },
    initChartSkeleton() {
      var option = {
        geo3D: {
          map: 'china',
          environment: '#01104D',
          shading: 'realistic',
          // silent: true, 显示各省
          postEffect: {
            enable: false
          },
          groundPlane: {
            show: false
          },
          light: {
            main: {
              intensity: 1,
              alpha: 30
            },
            ambient: {
              intensity: 0
            }
          },
          itemStyle: {
            color: '#339',
            borderWidth: 1,
            borderColor: '#33f'
          },
          viewControl: {
            autoRotateDirection: this.rotateDirection,
            autoRotate: this.speed > 0,
            autoRotateSpeed: this.speed,
            damping: 0.8
          },
          regionHeight: 0.05
        },
        series: []
      }
      this.chart.setOption(option)
    }
  }
}
</script>
