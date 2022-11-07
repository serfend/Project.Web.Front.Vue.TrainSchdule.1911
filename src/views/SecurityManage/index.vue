<template>
  <el-card>
    <div>这里显示组件</div>
    <WeatherGroup :district="[110000,420600]" />
  </el-card>
</template>
<script>
export default {
  name: 'SecurityManage',
  components: {
    WeatherGroup: () => import('@/components/Weather/WeatherGroup')
  }
}
</script>
