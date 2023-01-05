<template>
  <div class="primary-container">
    <el-row class="row">
      <Loading v-if="!componentLoaded" />
      <component :is="name" v-else />
    </el-row>
    <el-row class="row" :gutter="20">
      <el-col :span="11">
        <el-row class="row">
          <Square style="height:16rem">
            <div slot="title">人员情况</div>
            <div slot="chart">人员情况</div>
          </Square>
        </el-row>
        <el-row class="row">
          <Square>
            <div slot="title">安全指标监测</div>
            <div slot="chart">
              <div style="height:37rem;padding:2rem 3rem 1rem 3rem">
                <Indicator :count-per-group="6" :height="30" />
              </div>
            </div>
          </Square>
        </el-row>
      </el-col>
      <el-col :span="13">
        <el-row class="row" :gutter="10">
          <el-col :span="18">
            <EventList
              title="security_event-statistics"
              database="security_event"
              :default-data="{securityEventType:2}"
              :engine-only="true"
              style="top:1rem;left:1rem;z-index:1;"
              @change="data_arrived"
            />
            <Square>
              <div slot="title">各类事件概率</div>
              <div slot="chart">
                <EventRate v-model="event_list" height="20rem" />
              </div>
            </Square>
          </el-col>
          <el-col :span="6">
            <Square>
              <div slot="title">天气轮询</div>
              <div slot="chart" style="height:20rem">
                <WeatherCard config-id="global.sec.weather-card" />
              </div>
            </Square>
          </el-col>
        </el-row>
        <el-row>
          <Square>
            <History slot="chart" height="33rem" :size="0.6" />
          </Square>
        </el-row>
      </el-col>
    </el-row>
  </div>
</template>
<script>
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
    Loading: () => import('@/views/Loading')
  },
  data: () => ({
    componentLoaded: false,
    event_list: [],
    name
  }),
  mounted() {
    this.initComponents()
  },
  methods: {
    data_arrived (v) {
      this.event_list = v
    },
    initComponents () {
      getConfig({ name }).then((data) => {
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
.el-card.is-always-shadow{
  box-shadow: 0 2px 12px  #0000007f;
}
.el-card{
  border:1px solid #000;
}
</style>
