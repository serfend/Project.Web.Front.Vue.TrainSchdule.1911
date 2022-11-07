<template>
  <div>
    <Weather v-model="current" />
  </div>
</template>
<script>
export default {
  name: 'WeatherGroup',
  components: {
    Weather: () => import('../index')
  },
  props: {
    district: { type: Array, default: () => [] }
  },
  data: () => ({
    current: 0,
    group: []
  })
}
</script>
<style lang="scss" scoped>

</style>
