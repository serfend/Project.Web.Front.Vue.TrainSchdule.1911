<template>
  <div id="container" class="container">
    <div class="container-bg">
      <dv-loading v-if="!removeLoading" class="loading" :style="{opacity:loading?1:0}">{{ loading }}</dv-loading>
      <div v-if="company" class="statistics-title">
        <h1 class="content">{{ company.name }}休假情况</h1>
        <TimeCenter />
      </div>
      <!-- 页面主体部分 -->
      <section v-if="company" class="mainbox">
        <div class="column">
          <dv-border-box-11
            :title="$refs.vacationDayStatistics?$refs.vacationDayStatistics._data.title:'加载中'"
            class="panel bar"
          >
            <VacationStatisticsBar
              ref="vacationDayStatistics"
              height="100%"
              class="dv-boarder-chart"
              :color="color"
              :companies="companies"
              :data="vacationDay"
            />
          </dv-border-box-11>
          <dv-border-box-11 title="数据区域" class="panel line">
            <div class="chart" />
          </dv-border-box-11>
          <dv-border-box-11 title="数据区域" class="panel pie">
            <div class="chart" />
          </dv-border-box-11>
        </div>
        <div class="column">
          <MembersCounter />
          <!-- 地图模块 -->
          <div class="map">
            <div class="map1" />
            <div class="map2" />
            <div class="map3" />
            <VacationMap3D
              v-if="echartGeoComplete"
              ref="vacationMap"
              :height="'100%'"
              :file-load="requestFile"
            />
          </div>
        </div>
        <div class="column">
          <dv-border-box-11 title="数据区域" class="panel bar2">
            <div class="chart" />
          </dv-border-box-11>
          <dv-border-box-11 title="数据区域" class="panel line2">
            <div class="chart" />
          </dv-border-box-11>
          <dv-border-box-11 title="数据区域" class="panel pie2">
            <div class="chart" />
          </dv-border-box-11>
        </div>
      </section>
      <div v-if="company" style="display:flex;position:fixed;bottom:0;">
        <StatisticsDataDriver
          ref="dataDriver"
          :loading.sync="loading"
          :company-code="company.code"
          :data.sync="data"
        />
        <EchartGeoLoader
          ref="echartGeoDriver"
          :file-load="requestFile"
          :complete.sync="echartGeoComplete"
        />
      </div>
    </div>
  </div>
</template>

<script>
import './js/flexible'
import TimeCenter from './components/NumberCounter/TimeCenter'
import StatisticsDataDriver from './components/Engine/StatisticsDataDriver'
import EchartGeoLoader from './components/Engine/EchartGeoLoader'

import MembersCounter from './components/NumberCounter/MembersCounter'
import VacationMap3D from './components/Geo/VacationMap3D'

import VacationStatisticsBar from './components/Bar/VacationStatisticsBar'

import { requestFile, download } from '@/api/file'
import { getUserCompany } from '@/api/userinfo'

export default {
  name: 'Statistics',
  components: {
    TimeCenter,
    EchartGeoLoader,
    StatisticsDataDriver,
    MembersCounter,
    VacationMap3D,
    VacationStatisticsBar
  },
  data: () => ({
    loading: '未初始化',
    echartGeoComplete: false,
    removeLoading: false,
    company: null,
    data: null,
    lastUpdate: new Date(),
    color: ['#ff6f4f', '#71ff80', '#3581ff']
  }),
  computed: {
    companies() {
      var result = []
      if (!this.data || !this.data.companyDic) return result
      var cs = this.data.companyDic
      result = Object.values(cs)
      return result
    },
    vacationDay() {
      var result = []
      result.push({
        name: '休假天数',
        data: [7, 2, 6, 2, 4, 5, 3, 1, 9]
      })
      result.push({
        name: '休假次数',
        data: [5, 3, 6, 2, 4, 1, 9, 7, 2]
      })
      result.push({
        name: '休假人数',
        data: [2, 4, 6, 1, 9, 5, 3, 7, 2]
      })
      return result
    }
  },
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
      this.loading = '初始化'
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
        this.$refs.dataDriver.refresh().then(() => {
          this.refresh()
        })
        this.$refs.echartGeoDriver.refresh()
      })
      window.addEventListener('resize', this.resize)
    },
    refresh() {
      this.chartsDoAction(c => {
        if (c._data && c._data.chart && c.refresh) {
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

<style lang="scss" >
@import './style/index.scss';
.dv-boarder-chart {
  padding: 1rem 0.2rem 0 0.2rem;
}
</style>
