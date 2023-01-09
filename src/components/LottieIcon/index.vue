<template>
  <div ref="lottieBox" />
</template>

<script>
const local_cache = {}
import lottie from 'lottie-web'
export default {
  name: 'LottieIcon',
  props: {
    animationData: { type: Object, default: null },
    path: { type: String, default: null },
    loop: { type: Boolean, default: true },
    animateSpeed: { type: Number, default: 1 }
  },
  data: () => ({
    lottie: null
  }),
  watch: {
    path: {
      handler(val) {
        this.destroyInstance()
        this.initLottie()
      }
    },
    animationData: {
      handler(val) {
        this.destroyInstance()
        this.initLottie()
      }
    },
    animateSpeed: {
      handler() {
        this.onSpeedChange()
      },
      immediate: true
    }
  },
  mounted() {
    this.initLottie()
  },
  beforeDestroy() {
    this.destroyInstance()
  },
  methods: {
    destroyInstance() {
      if (!this.lottie) return
      this.lottie.destroy()
      this.lottie = null
    },

    stop() {
      this.lottie.stop()
    },

    play() {
      this.lottie.play()
    },

    pause() {
      this.lottie.pause()
    },

    onSpeedChange() {
      if (!this.lottie) {
        return setTimeout(() => {
          this.onSpeedChange()
        }, 200)
      }
      this.lottie.setSpeed(this.animateSpeed)
    },

    isLottieFinish() {
      // this.lottie.removeEventListener('data_ready', this.isLottieFinish)
      if (this.path) {
        local_cache[this.path] = this.lottie.animationData
      }
      this.onSpeedChange()
      this.$emit('isLottieFinish', true)
    },

    initLottie() {
      const { animationData, path, loop } = this
      const animationDataLoad = local_cache[this.path] || animationData
      const pathLoad = local_cache[this.path] ? null : path
      this.lottie = lottie.loadAnimation({
        container: this.$refs.lottieBox,
        renderer: 'svg',
        loop: loop || true,
        path: pathLoad,
        animationData: animationDataLoad
      })
      this.lottie.addEventListener('data_ready', this.isLottieFinish, {
        once: true
      })
    }
  }
}
</script>
