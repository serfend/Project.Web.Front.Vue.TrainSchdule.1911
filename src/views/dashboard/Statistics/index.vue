<template>
  <div id="container" class="container">
    <div v-loading="loading" class="container-bg">
      <div v-if="company" class="statistics-title">
        <h1 class="content">{{ company.name }}休假情况</h1>
        <TimeCenter />
      </div>
      <!-- 页面主体部分 -->
      <section v-if="company" class="mainbox">
        <div class="column">
          <Square>
            <VacationStatisticsBar
              slot="chart"
              ref="vacationApplyStatistics"
              height="100%"
              :color="setting?setting.color.value.memberCard.value:null"
              :companies="companies"
              :data="accumulateData"
            />
          </Square>
          <Square>
            <div
              v-if="$refs.vacationMemberStatisticsPie"
              slot="title"
              style="color:#aaa;margin-left:0.25rem;font-size:0.25rem"
            >{{ $refs.vacationMemberStatisticsPie._data.isRate?'比率':'数值' }}</div>
            <VacationStatisticsLine
              slot="chart"
              ref="vacationMemberStatisticsPie"
              height="100%"
              :color="setting?setting.color.value.memberCard.value:null"
              :companies="companies"
              :data="trendData"
            />
          </Square>
        </div>
        <div class="column">
          <MembersCounter v-if="setting.dateRange" :data="memberCount" />
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
              :data="companyData?companyData.new:null"
            />
          </div>
        </div>
        <div class="float-column">
          <Square class="float-panel">
            <h2 slot="title">新增去向分布</h2>
          </Square>
          <Square class="float-panel">
            <h2 slot="title">在休去向分布</h2>
          </Square>
          <Square class="float-panel">
            <h2 slot="title">归队去向分布</h2>
          </Square>
          <Square class="float-panel">
            <h2 slot="title">新增来源分布</h2>
          </Square>
          <Square class="float-panel">
            <h2 slot="title">在休来源分布</h2>
          </Square>
          <Square class="float-panel">
            <h2 slot="title">归队来源分布</h2>
          </Square>
        </div>
      </section>
      <div style="display:flex;position:fixed;bottom:0;">
        <StatisticsDataDriver
          ref="dataDriver"
          :loading.sync="loading"
          :company="company?company.code:null"
          :companies="companies?companies.map(i=>i.code):null"
          :data.sync="data"
          :date-range="dateRange"
          :company-data.sync="companyData"
          :companies-data.sync="companiesData"
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
import { getProp, modify } from '@/utils/data-handle'

import MembersCounter from './components/NumberCounter/MembersCounter'
import VacationMap3D from './components/Geo/VacationMap3D'

import VacationStatisticsBar from './components/Bar/VacationStatisticsBar'
import VacationStatisticsLine from './components/Bar/VacationStatisticsLine'
import { requestFile, download } from '@/api/common/file'
import { getUserCompany } from '@/api/user/userinfo'
import { companyChild } from '@/api/company'
import { apiOption } from './components/Engine/dataDriverApiOption'

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
    VacationStatisticsLine
  },
  data: () => ({
    loading: false,
    echartGeoComplete: false,
    initStatus: 'wait init',
    data: null,
    companyData: null,
    companiesData: null,
    lastUpdate: new Date()
  }),
  computed: {
    setting: {
      get() {
        return this.$store.state.dashboard.setting
      },
      set(n) {
        this.$store.state.dashboard.setting = n
      }
    },
    company() {
      var i = getProp(this.setting, ['company', 'main'])
      if (i) {
        if (i.name) i.name = i.name.replace('*', '')
        return i
      } else {
        return null
      }
    },
    memberType() {
      return getProp(this.setting, ['memberType'])
    },
    companies() {
      return getProp(this.setting, ['company', 'compare'])
    },
    dateRange() {
      return {
        start: getProp(this.setting, ['dateRange', 'start']),
        end: getProp(this.setting, ['dateRange', 'end'])
      }
    },
    // 子单位累积数据，展示柱状图
    accumulateData() {
      const companiesData = this.companiesData
      if (!companiesData || companiesData.length === 0) return []
      const collectionNames = Object.keys(companiesData[0]).filter(
        i => i !== 'types' && apiOption[i].chartShow[0]
      )
      return collectionNames.map(collect => {
        const { props, accumulate } = apiOption[collect]
        return {
          name: apiOption[collect].name,
          series: props.map(prop => {
            const { key, name } = prop
            const reducer = (prev, cur, curIndec, arr) => prev + cur[key]
            const data = companiesData.map(cmp => {
              const cmpCollect = cmp[collect]
              if (!cmpCollect || cmpCollect.length === 0) return 0
              return accumulate
                ? cmpCollect.reduce(reducer, 0)
                : cmpCollect[cmpCollect.length - 1][key]
            })
            return { name, data }
          })
        }
      })
    },
    // 主单位趋势数据，展示折线图
    trendData() {
      const companyData = this.companyData
      if (!companyData) return []
      const collectionNames = Object.keys(companyData).filter(
        i => i !== 'types' && apiOption[i].chartShow[1]
      )
      // TODO 日后可以计算比率
      const screens = collectionNames.map(collect => {
        const { name, props, accumulate } = apiOption[collect]
        const companyCollect = companyData[collect]
        const primaryPropArr = props.filter(p => p.isPrimary)
        const primaryProp =
          primaryPropArr.length === 1 ? primaryPropArr[0].key : null
        let primaryData = []
        if (primaryProp) {
          let prevData = 0
          primaryData = companyCollect.map(data => {
            if (accumulate) prevData = prevData + data[primaryProp]
            else prevData = data[primaryProp]
            return prevData
          })
        }
        return {
          name,
          series: props.map(prop => {
            const { name, key } = prop
            let prevData = 0
            const datas = companyCollect.map((data, index) => {
              // 如果需要累积
              if (accumulate) prevData = prevData + data[key]
              else prevData = data[key]
              const dateStr = new Date(data.target).toLocaleDateString()
              const v = [data.target, prevData, dateStr]
              if (primaryProp) {
                const pData = primaryData[index]
                v.push(pData > 0 ? v[1] / pData : 0)
              }
              return { name: data.target, value: v }
            })
            return { name, data: datas }
          })
        }
      })
      return screens
    },
    memberCardSetting() {
      return getProp(this.setting, ['memberCard'])
    },
    // 去向数据，展示翻牌器
    memberCount() {
      const item = []
      const items = this.companyData
      if (!items) return item
      const memberCard = this.memberCardSetting
      for (var card of memberCard) {
        const { title, color } = card
        let value = 0
        if (items[card.collection]) {
          const collect = items[card.collection]
          const filter = card.filter
          if (filter) {
            const expression = new Function('i', `return i.${filter}`)
            for (var i of collect) {
              if (expression(i)) value += i[card.binding]
            }
          } else value += i[card.binding]
        }
        item.push({ title, prev: 0, value, color })
      }
      return item
    }
  },
  watch: {
    setting: {
      handler(val) {
        if (this.initStatus === 'inited') {
          const dataDriver = this.$refs.dataDriver
          if (dataDriver) {
            dataDriver.refresh().then(() => {
              this.refresh()
            })
          }
        } else {
          this.init()
        }
      },
      deep: true
    },
    companyData: {
      handler(val) {
        if (val) {
          modify(this.setting.memberType, item => {
            item.__setting.props.option = val.types.map(i => {
              return {
                label: i,
                value: i
              }
            })
          })
        }
      }
    }
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
      this.$nextTick(() => {
        if (this.initStatus !== 'wait init') return
        this.initStatus = 'initing'
        console.log('init main')
        this.loading = '初始化'
        window.addEventListener('resize', this.resize)
        this.$refs.echartGeoDriver.refresh()
        this.reloadUserCompany().then(() => {
          this.reloadChildCompanies().then(() => {
            this.initStatus = 'inited'
          })
        })
      })
    },
    reloadChildCompanies() {
      return companyChild(this.company.code).then(child => {
        modify(this.setting.company.value.compare, m => {
          m = Object.assign(m, {
            value: child.list,
            __setting: {
              props: {
                'company-select-names': child.list.map(i => i.name)
              }
            }
          })
        })
      })
    },
    reloadUserCompany() {
      return new Promise((res, rej) => {
        getUserCompany(null)
          .then(data => {
            this.setting.company.value.main.value = data.company
            this.$nextTick(() => res(data.company))
          })
          .catch(e => {
            if (e.status === 12120) {
              setTimeout(() => {
                location.href = '/'
              }, 2000)
            }
            rej(e)
          })
      })
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
      const lastUpdate = new Date()
      this.lastUpdate = lastUpdate
      setTimeout(() => {
        if (this.lastUpdate !== lastUpdate) return
        for (var component of Object.keys(this.$refs)) {
          const c = this.$refs[component]
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
