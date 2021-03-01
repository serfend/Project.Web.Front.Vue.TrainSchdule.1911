<template>
  <div style="background-color:#153285;text-align:center">
    <div class="title-main">正在拼命施工中...</div>
    <LottieIcon ref="icon" path="/assets/lottie/lottie.building.json" class="buiding" />
  </div>
</template>

<script>
export default {
  name: 'DefaultLoading',
  components: {
    LottieIcon: () => import('@/components/LottieIcon')
  },
  mounted() {},
  methods: {}
}
</script>
<style lang="scss" scoped>
.title-main {
  color: #ccc;
  font-size: 3rem;
}
.buiding {
  margin-top: -20%;
}
</style>
