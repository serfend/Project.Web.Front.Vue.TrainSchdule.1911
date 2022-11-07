<template>
  <div class="main">
    <LottieIcon ref="icon" path="/assets/lottie/lottie.empty.json" :style="{width:`${size*5}rem`}" />
    <div class="title-main" :style="{'font-size':`${size}rem`}">这里没有任何数据...</div>
  </div>
</template>

<script>
export default {
  name: 'DefaultEmpty',
  components: {
    LottieIcon: () => import('@/components/LottieIcon')
  },
  props: {
    size: { type: Number, default: 1 }
  },
  mounted() {},
  methods: {}
}
</script>
<style lang="scss" scoped>
.main {
  background-color: transparent;
  text-align: center;
  display: flex;
  justify-items: center;
  align-items: center;
  flex-direction: column;
  width: 100%;
}
.title-main {
  color: #ccc;
}
</style>
