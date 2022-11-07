<template>
  <div class="primary-container">
    <el-row class="row">
      <CounterTimer />
    </el-row>
    <el-row class="row" :gutter="20">
      <el-col :span="11">
        <el-row class="row">
          <Square>
            <div slot="title">本周人员情况</div>
            <div slot="chart">
              <div style="height:26rem">内容</div>
            </div>
          </Square>
        </el-row>
        <el-row class="row">
          <Square>
            <div slot="title">本周出车情况</div>
            <div slot="chart">
              <div style="height:26rem">内容</div>
            </div>
          </Square>
        </el-row>
      </el-col>
      <el-col :span="13">
        <el-row class="row" :gutter="10">
          <el-col :span="18">
            <Square>
              <div slot="title">各类事件概率</div>
              <div slot="chart">
                <EventRate height="20rem" />
              </div>
            </Square>
          </el-col>
          <el-col :span="6">
            <Square>
              <div slot="title">天气轮询</div>
              <div slot="chart" style="height:20rem">
                <el-row style="padding:1rem 0.5rem">
                  <WeatherGroup :district="[110000,420600]" />
                </el-row>
                <el-row style="padding:1rem 0.5rem">
                  <WeatherGroup :district="[130623,140922]" />
                </el-row>
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
export default {
  name: 'SecurityManageDashboard',
  components: {
    History: () => import('./history'),
    CounterTimer: () => import('./CounterTimer'),
    Square: () => import('@/views/dashboard/Statistics/components/Square'),
    EventRate: () => import('./EventRate'),
    WeatherGroup: () => import('@/components/Weather/WeatherGroup')
  }
}
</script>
<style lang="scss" scoped>
@import "@/views/dashboard/Statistics/style";
@import "./style";
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
