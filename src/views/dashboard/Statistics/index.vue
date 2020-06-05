<template>
  <div id="container" class="container">
    <div v-loading="!removeLoading" class="container-bg">
      <div v-if="company" class="statistics-title">
        <h1 class="content">{{ company.name }}休假情况</h1>
        <TimeCenter />
      </div>
      <!-- 页面主体部分 -->
      <section v-if="company" class="mainbox">
        <div class="column">
          <Square>
            <h2
              v-if="$refs.vacationApplyStatistics"
              slot="title"
            >{{ $refs.vacationApplyStatistics._data.title }}</h2>
            <VacationStatisticsBar
              slot="chart"
              ref="vacationApplyStatistics"
              height="100%"
              :color="color"
              :companies="companies"
            />
          </Square>
          <Square>
            <h2
              v-if="$refs.vacationMemberStatisticsPie"
              slot="title"
            >{{ $refs.vacationMemberStatisticsPie._data.title }}</h2>
            <VacationStatisticsPie
              slot="chart"
              ref="vacationMemberStatisticsPie"
              height="100%"
              :color="color"
              :companies="companies"
            />
          </Square>
          <Square>
            <h2 slot="title">数据区域</h2>
          </Square>
        </div>
        <div class="column">
          <MembersCounter :data="memberCount" />
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
              :data="appliesData.new"
            />
          </div>
        </div>
        <div class="float-column">
          <Square class="float-panel">
            <h2 slot="title">数据区域</h2>
          </Square>
          <Square class="float-panel">
            <h2 slot="title">数据区域</h2>
          </Square>
        </div>
      </section>
      <div v-if="company" style="display:flex;position:fixed;bottom:0;">
        <StatisticsDataDriver
          ref="dataDriver"
          :loading.sync="loading"
          :company-code="company.code"
          :data.sync="data"
          :applies-data.sync="appliesData"
        />
        <EchartGeoLoader
          ref="echartGeoDriver"
          :file-load="requestFile"
          :complete.sync="echartGeoComplete"
        />
        <SettingEngine ref="setting" :setting.sync="setting" />
      </div>
    </div>
  </div>
</template>

<script>
import './js/flexible'
import Square from './components/Square'

import TimeCenter from './components/NumberCounter/TimeCenter'
import StatisticsDataDriver from './components/Engine/StatisticsDataDriver'
import EchartGeoLoader from './components/Engine/EchartGeoLoader'
import SettingEngine from './components/Engine/SettingEngine'

import MembersCounter from './components/NumberCounter/MembersCounter'
import VacationMap3D from './components/Geo/VacationMap3D'

import VacationStatisticsBar from './components/Bar/VacationStatisticsBar'
import VacationStatisticsPie from './components/Bar/VacationStatisticsPie'
import { requestFile, download } from '@/api/common/file'
import { getUserCompany } from '@/api/user/userinfo'

export default {
  name: 'Statistics',
  components: {
    Square,
    TimeCenter,
    EchartGeoLoader,
    StatisticsDataDriver,
    SettingEngine,
    MembersCounter,
    VacationMap3D,
    VacationStatisticsBar,
    VacationStatisticsPie
  },
  data: () => ({
    loading: '未初始化',
    echartGeoComplete: false,
    removeLoading: false,
    company: null,
    data: null,
    appliesData: null,
    setting: [
      { key: 'color', value: ['#ff6f4f', '#71ff80', '#3581ff'], label: '配色' }
    ],
    lastUpdate: new Date(),
    color: ['#ff6f4f', '#71ff80', '#3581ff', '#cc337f', '#71ccb0', '#f581cc']
  }),
  computed: {
    companies() {
      var result = []
      if (!this.data || !this.data.companyDic) return result
      var cs = this.data.companyDic
      result = Object.values(cs)
      return result
    },
    memberCount() {
      var result = []
      if (!this.appliesData) return result
      this.appliesData.types.forEach((v, i, arr) => {
        var item = [
          { title: '京内新增', prev: 0, value: 0, color: '#0f0', filter: v },
          { title: '京内完成', prev: 0, value: 0, color: '#00f', filter: v },
          { title: '京外新增', prev: 0, value: 0, color: '#ff0', filter: v },
          { title: '京外完成', prev: 0, value: 0, color: '#f0f', filter: v },
          { title: '新增天数', prev: 0, value: 0, color: '#f0f', filter: v },
          { title: '完成天数', prev: 0, value: 0, color: '#f0f', filter: v }
        ]
        var newa = this.appliesData.new[v]
        if (newa) {
          newa.forEach((v2, i2, arr2) => {
            if (v2.to === 11) {
              item[0].value += v2.value
            } else {
              item[2].value += v2.value
            }
            item[4].value += v2.day
          })
        }
        var complete = this.appliesData.complete[v]
        if (complete) {
          complete.forEach((v2, i2, arr2) => {
            if (v2.to === 11) {
              item[1].value += v2.value
            } else {
              item[3].value += v2.value
            }
            item[5].value += v2.day
          })
        }
        result = result.concat(item)
      })
      console.log('caculate')
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
</style>
