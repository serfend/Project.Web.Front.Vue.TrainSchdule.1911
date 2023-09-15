<template>
  <div class="primary-container">
    <el-row class="row">
      <Loading v-if="!componentLoaded" />
      <component :is="name" v-else />
      <SecurityWarning />
    </el-row>
    <el-row class="row" :gutter="20">
      <el-col :span="11">
        <el-row class="row">
          <Square style="height:18rem">
            <div slot="title">总体数据联动</div>
            <div
              slot="chart"
              style="height: 100%;display: flex;align-items: center;justify-content: center;"
            >
              <MemberStatistics />
            </div>
          </Square>
        </el-row>
        <el-row class="row">
          <Square>
            <div slot="title">安全指标监测</div>
            <div slot="chart">
              <div style="height:40rem;padding:2rem 3rem 1rem 3rem">
                <Indicator :count-per-group="6" :height="31" />
              </div>
            </div>
          </Square>
        </el-row>
      </el-col>
      <el-col :span="13">
        <el-row class="row" :gutter="10">
          <el-col :span="16">
            <Square>
              <div slot="title">
                各类事件概率（共{{ event_list.length }}件）
              </div>
              <div slot="chart">
                <EventRate
                  v-model="event_list"
                  height="22rem"
                  @chartClick="onEventListSelect"
                />
              </div>
            </Square>
          </el-col>
          <el-col :span="8">
            <Square>
              <div slot="title">
                天气轮询（共监测{{ weather_list.length }}地）
              </div>
              <div slot="chart" style="height:22rem">
                <WeatherCard
                  :list.sync="weather_list"
                  config-id="global.sec.weather-card"
                />
              </div>
            </Square>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <Square>
              <History
                ref="history"
                slot="chart"
                height="33rem"
                :size="0.6"
                :page-setting="{pageSize:1000,pageIndex:0}"
                @change="data_arrived"
              />
            </Square>
          </el-col>
          <el-col :span="12">
            <LinearChartsDefault :height="32" />
          </el-col>
        </el-row>
      </el-col>
    </el-row>
  </div>
</template>
<script>
// 原数据引擎
// <!-- <EventList
//               title="security_event-statistics"
//               database="security_event"
//               :default-data="{securityEventType:3}"
//               :engine-only="true"
//               style="top:1rem;left:1rem;z-index:1;"
//               @change="data_arrived"
//             /> -->
import { getConfig } from '@/api/common/general_config'
import { loader } from '@/utils/common/vueLoader'
const name = 'global.sec.banner'
import Vue from 'vue'
export default {
  name: 'SecurityManageDashboard',
  components: {
    History: () => import('../history'),
    EventList: () => import('../event/EventList'),
    Square: () => import('@/views/dashboard/Statistics/components/Square'),
    EventRate: () => import('../EventRate'),
    WeatherCard: () => import('../WeatherCard'),
    Indicator: () => import('../indicator'),
    MemberStatistics: () => import('../MemberStatistics'),
    LinearChartsDefault: () => import('../LinearCharts/LinearChartsDefault'),
    Loading: () => import('@/views/Loading'),
    SecurityWarning: () => import('../SecurityWarning')
  },
  data: () => ({
    componentLoaded: false,
    event_list: [],
    name,
    weather_list: []
  }),
  mounted() {
    this.initComponents()
  },
  methods: {
    onEventListSelect(x) {
      const h = this.$refs.history
      h && h.onEventListSelect(x)
    },
    data_arrived(v) {
      this.event_list = v
    },
    initComponents() {
      getConfig({ name }).then(data => {
        if (!data.model) return this.$message.error(`未定义组件:${name}`)

        loader(data.model.data).then(component => {
          this.name = 'Test'
          Vue.component(this.name, component)
          this.componentLoaded = true
        })
      })
    }
  }
}
</script>
<style lang="scss" scoped>
@import "@/views/dashboard/Statistics/style";
@import "../style";
.primary-container {
  @include common();
  @extend %background-img;
  height: 1080px;
  overflow: hidden;
}
</style>
<style lang="scss">
.el-card.is-always-shadow {
  box-shadow: 0 2px 12px #0000007f;
}
.el-card {
  border: 1px solid #000;
}
</style>
