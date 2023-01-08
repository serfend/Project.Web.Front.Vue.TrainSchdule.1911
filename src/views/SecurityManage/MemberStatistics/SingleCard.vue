<template>
  <transition v-if="current" name="slideCard" class="single-card">
    <div :key="current.title" class="card-container">
      <el-row class="data">{{ current.digital }}</el-row>
      <el-row class="title">{{ current.title }}</el-row>
      <div class="progress" :style="{ width: `${width}rem` }">
        <LinearProgress
          :data="current.progress"
          :height="2.2"
          :color="['#40a5e8', '#94f4fb']"
          :title="current.progressTitle"
        />
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
      type: Array,
      default: () => [
        {
          progressTitle: 'XXX率',
          digital: 15259,
          title: '标题',
          progress: 70
        }
      ]
    },
    index: { type: Number, default: 0 },
    width: { type: Number, default: 16 },
    currentFocus: { type: String, default: null }
  },
  data: () => ({
    current: null,
    currentIndex: -1,
    refresher: null
  }),
  computed: {},
  mounted() {
    setTimeout(() => {
      this.refresher = setInterval(this.refresh, 5e3)
      this.refresh()
    }, this.index * 5e2)
  },
  destroyed() {
    clearInterval(this.refresher)
  },
  methods: {
    refresh() {
      const { data } = this
      if (!data) return
      if (this.currentIndex >= data.length - 1) {
        this.currentIndex = -1
      }
      this.currentIndex++
      this.current = this.data[this.currentIndex]
      this.$emit('update:currentFocus', this.current.title)
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
.single-card {
  transition: all ease 1s;
}
.slideCard-enter {
  opacity: 0;
  transform: translateY(2rem);
}

.slideCard-enter-to {
  transform: translateY(0rem);
  opacity: 1;
}

.slideCard-leave {
  transform: translateY(0rem);
  opacity: 1;
  position: absolute;
}
.slideCard-leave-to {
  transform: translateY(-10rem);
  opacity: 0;
  position: absolute;
}
</style>
