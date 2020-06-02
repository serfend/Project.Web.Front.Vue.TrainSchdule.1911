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
              :data="vacationDay"
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
              :data="vacationMember"
            />
          </Square>
          <Square>
            <h2 slot="title">数据区域</h2>
          </Square>
        </div>
        <div class="column">
          <MembersCounter />
          <!-- 地图模块 -->
          <div class="map">
            <div class="map1" />
            <div class="map2" />
            <div class="map3" />
            <!-- <VacationMap3D
              v-if="echartGeoComplete"
              ref="vacationMap"
              :height="'100%'"
              :file-load="requestFile"
            />-->
          </div>
        </div>
        <div class="column">
          <Square>
            <h2 slot="title">数据区域</h2>
          </Square>
          <Square>
            <h2 slot="title">数据区域</h2>
          </Square>
          <Square>
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
// import VacationMap3D from './components/Geo/VacationMap3D'

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
    // VacationMap3D,
    VacationStatisticsBar,
    VacationStatisticsPie
  },
  data: () => ({
    loading: '未初始化',
    echartGeoComplete: false,
    removeLoading: false,
    company: null,
    data: null,
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
    lastItem() {
      var result = []
      if (
        !this.data ||
        !this.data.labelData ||
        !this.data.labelData.data_week
      ) {
        return result
      }
      var target = this.data.labelData.data_week
      result = Object.values(target).map(i => {
        var allItem = Object.values(i)
        if (allItem.length === 0) return []
        var lastItem = allItem[allItem.length - 1]
        return lastItem
      })
      return result
    },
    vacationDay() {
      var lastItem = this.lastItem
      var array = lastItem.map(i => {
        var ic = i.includeChildLevelStatistics
        return [ic.applySumDayCount, ic.applyMembersCount, ic.applyCount]
      })
      const series = ['休假天数', '休假人数', '休假次数']
      var result = []
      for (var i = 0; i < series.length; i++) {
        result.push({
          name: series[i],
          data: [
            { name: '已通过', data: array.map(item => item[i].access) },
            { name: '审批中', data: array.map(item => item[i].auditing) },
            { name: '被驳回', data: array.map(item => item[i].deny) }
          ]
        })
      }
      return result
    },
    vacationMember() {
      return []
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
