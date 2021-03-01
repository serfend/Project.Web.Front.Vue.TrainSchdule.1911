<template>
  <div>
    <Loading />
  </div>
</template>

<script>
export default {
  name: 'ProfileActivity',
  components: {
    Loading: () => import('@/views/Loading')
  },
  data() {
    return {}
  }
}
</script>

<style lang="scss" scoped>
</style>
