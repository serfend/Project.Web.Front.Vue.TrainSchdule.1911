<template>
  <div class="container">
    <dv-loading v-if="!removeLoading" class="loading" :style="{opacity:loading?1:0}">{{ loading }}</dv-loading>
    <div v-if="company" class="statistics-title">
      <span class="content">{{ company.name }}数据统计</span>
    </div>
    <!-- 页面主体部分 -->
    <section class="mainbox">
      <div class="column">
        <div class="panel bar">
          <h2>柱形图-就业行业</h2>
          <div class="chart" />
          <div class="panel-footer" />
        </div>
        <div class="panel line">
          <h2>
            折线图-人员变化
            <a href="javacript:;">2020</a>
            <a href="javascript:;">2021</a>
          </h2>
          <div class="chart">图表</div>
          <div class="panel-footer" />
        </div>
        <div class="panel pie">
          <h2>饼形图-年龄分布</h2>
          <div class="chart">图表</div>
          <div class="panel-footer" />
        </div>
      </div>
      <div class="column">
        <!-- no模块制作 -->
        <div class="no">
          <div class="no-hd">
            <ul>
              <li>125811</li>
              <li>100000</li>
            </ul>
          </div>
          <div class="no-bd">
            <ul>
              <li>前端需求人数</li>
              <li>市场供应人数</li>
            </ul>
          </div>
        </div>
        <!-- 地图模块 -->
        <div class="map">
          <div class="map1" />
          <div class="map2" />
          <div class="map3" />
          <div class="chart" />
        </div>
      </div>
      <div class="column">
        <div class="panel bar2">
          <h2>柱形图-就业行业</h2>
          <div class="chart">图表</div>
          <div class="panel-footer" />
        </div>
        <div class="panel line2">
          <h2>折线图-播放量</h2>
          <div class="chart">图表</div>
          <div class="panel-footer" />
        </div>
        <div class="panel pie2">
          <h2>饼形图-地区分布</h2>
          <div class="chart">图表</div>
          <div class="panel-footer" />
        </div>
      </div>
    </section>
    <div v-if="company" style="display:flex;position:fixed;bottom:0;">
      <StatisticsDataDriver
        ref="dataDriver"
        :loading.sync="loading"
        :company-code="company.code"
        :data.sync="data"
      />
      <EchartGeoLoader ref="echartGeoDriver" :file-load="requestFile" />
    </div>
  </div>
</template>

<script>
import StatisticsDataDriver from './components/StatisticsDataDriver'
import EchartGeoLoader from './components/EchartGeoLoader'

import { requestFile, download } from '@/api/file'
// import VacationMap from './components/VacationMap'
import { getUserCompany } from '@/api/userinfo'
export default {
  name: 'Statistics',
  components: { EchartGeoLoader, StatisticsDataDriver /* , VacationMap */ },
  data: () => ({
    loading: '未初始化',
    removeLoading: false,
    company: null,
    data: null,
    lastUpdate: new Date()
  }),
  watch: {
    loading: {
      handler(val) {
        if (!val) {
          setTimeout(() => {
            this.removeLoading = true
            this.refresh()
          }, 500)
        }
      }
    }
  },
  mounted() {
    this.init()
  },
  beforeDestroy() {
    window.removeEventListener('resize', this.resize)
  },
  methods: {
    requestFile(file) {
      return requestFile('/dataview', file).then(data => {
        return download(data.file.id)
      })
    },
    async init() {
      this.loading = '加载单位信息'
      await getUserCompany(null, true)
        .then(data => {
          this.company = data.company
        })
        .catch(e => {
          if (e.status === 12120) {
            this.$router.push('/application/myapply')
          }
        })
      this.$nextTick(() => {
        this.$refs.dataDriver.refresh()
        this.$refs.echartGeoDriver.refresh()
      })
      window.addEventListener('resize', this.resize)
    },
    refresh() {
      this.chartsDoAction(c => {
        if (c._data && c._data.chart) {
          c.refresh()
        }
      })
    },
    resize() {
      this.chartsDoAction(c => {
        var data = c._data
        if (data.chart) data.chart.resize()
      })
    },
    chartsDoAction(method) {
      var lastUpdate = new Date()
      this.lastUpdate = lastUpdate
      setTimeout(() => {
        if (this.lastUpdate !== lastUpdate) return
        for (var component of Object.keys(this.$refs)) {
          var c = this.$refs[component]
          method(c)
        }
      }, 500)
    }
  }
}
</script>

<style lang="scss" scoped>
@import './style/index.scss';
</style>
