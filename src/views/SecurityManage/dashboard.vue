<template>
  <div class="primary-container">
    <el-row class="row">
      <CounterTimer />
    </el-row>
    <el-row class="row">
      <History />
    </el-row>
  </div>
</template>
<script>
export default {
  name: 'SecurityManageDashboard',
  components: {
    History: () => import('./history'),
    CounterTimer: () => import('./CounterTimer')
  }
}
</script>
<style lang="scss" scoped>
@import "./style";
.primary-container {
  @include common();
}
</style>
