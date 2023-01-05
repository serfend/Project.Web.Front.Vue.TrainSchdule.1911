<template>
  <transition v-if="current" name="slideCard">
    <div :key="current.title" class="card-container">
      <el-row class="data">{{ current.digital }}</el-row>
      <el-row class="title">{{ current.title }}</el-row>
      <div class="progress">
        <LinearProgress :data="current.progress" :height="2.2" :color="['#40a5e8','#94f4fb']" :title="current.progressTitle" />
      </div>
    </div>
  </transition>
</template>
<script>
export default {
  name: 'SingleCard',
  components: {
    LinearProgress: () => import('./LinearProgress')
  },
  props: {
    // progressTitle: { type: String, default: null },
    // digital: { type: [String, Number], default: '无数据' },
    // title: { type: String, default: '无标题' },
    // progress: { type: Number, default: 70 },
    data: {
      type: Array, default: () => [
        {
          progressTitle: 'XXX率',
          digital: 15259,
          title: '标题',
          progress: 70
        }
      ]
    },
    index: { type: Number, default: 0 }
  },
  data: () => ({
    current: null,
    currentIndex: -1,
    refresher: null
  }),
  computed: {},
  mounted () {
    setTimeout(() => {
      this.refresher = setInterval(this.refresh, 5e3)
      this.refresh()
    }, this.index * 3e2)
  },
  destroyed() {
    clearInterval(this.refresher)
  },
  methods: {
    refresh () {
      const { data } = this
      if (!data) return
      if (this.currentIndex >= data.length - 1) {
        this.currentIndex = -1
      }
      this.currentIndex++

      this.current = this.data[this.currentIndex]
    }
  }
}
</script>
<style lang="scss" scoped>
.data {
  margin-top: 1rem;
  font-size: 4rem;
  color: #25f0f0;
  text-shadow: #21f0ff 0 0 0.5rem;
}
.title {
  font-size: 1.5rem;
  color: #ffffff;
}
.progress {
  margin-top: 1rem;
}
.card-container {
  display: inline-block;
  text-align: center;
  border-radius: 0.4rem;
}

.slideCard-enter-active {
  transition: opacity 1.5s;
}

.slideCard-enter,
.slideCard-leave-to {
  opacity: 0;
}

</style>
