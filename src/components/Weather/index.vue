<template>
  <div>
    <LottieIcon
      :animation-data="animationData"
      :animate-speed="0.5"
      style="width:15rem;margin: auto;color:#fff"
    />
    <!-- <LottieIcon
      path="/assets/lottie/lottie.submit.fail.json"
      :animate-speed="0.5"
      style="width:15rem;margin: auto;color:#fff"
    /> -->
  </div>
</template>
<script>
import weatherData from './weather'
export default {
  name: 'Weather',
  components: {
    LottieIcon: () => import('@/components/LottieIcon'),
  },
  model: {
    prop: 'data',
    event: 'change'
  },
  props: {
    data: { type: Number, default: 0 }
  },
  data: () => ({
    animationData: weatherData.晴()
  })
}
</script>
<style lang="scss" scoped>

</style>
