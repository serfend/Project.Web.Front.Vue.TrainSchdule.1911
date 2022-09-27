<template>
  <div class="big-screen-limitation">
    <el-row class="row">
      <CounterTimer />
    </el-row>
    <el-row :gutter="20" class="row">
      <el-col :span="12">
        <EventList title="安全保密警钟长鸣" database="security_event" />
      </el-col>
      <el-col :span="12">
        <EventList title="学习先进积极前行" database="best_event" />
      </el-col>
    </el-row>
  </div>
</template>
<script>
export default {
  name: 'SecurityManage',
  components: {
    EventList: () => import('../event/EventList'),
    CounterTimer: () => import('./CounterTimer')
  }
}
</script>
<style lang="scss" scoped>

.row{
  margin-bottom:1rem;
}
.big-screen-limitation{
  height:1080px;
  overflow: hidden;
}
</style>
