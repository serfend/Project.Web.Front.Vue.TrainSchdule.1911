<template>
  <transition v-if="current" name="slideCard" class="single-card">
    <div :key="current.title" class="card-container" @click="onClick">
      <el-row class="data">{{ current.digital }}</el-row>
      <el-row class="title">{{ current.title }}</el-row>
      <el-tooltip :content="current.description || '无描述'">
        <div class="progress">
          <LinearProgress
            :data="current.progress"
            :height="2.2"
            :color="['#40a5e8', '#94f4fb']"
            :title="current.progressTitle"
          />
        </div>
      </el-tooltip>
      <el-button
        :style="{visibility:current.url?'visible':'hidden'}"
        class="reference"
        type="text"
        @click="onEnterReference"
      >查看详情</el-button>
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
          progress: 70,
          enable: true
        }
      ]
    },
    index: { type: Number, default: 0 },
    currentFocus: { type: String, default: null }
  },
  data: () => ({
    current: null,
    currentIndex: -1,
    refresher: null,
    canRefreshTime: new Date()
  }),
  computed: {
    innerData() {
      const { data } = this
      if (!data) return []
      return data.filter(i => i && i.enable)
    }
  },
  mounted() {
    setTimeout(() => {
      this.refresher = setInterval(this.refresh, 5e3)
      this.refresh()
    }, this.index * 2e2)
  },
  destroyed() {
    clearInterval(this.refresher)
  },
  methods: {
    onEnterReference () {
      window.open(this.current.url)
    },
    onClick() {
      const d = new Date().getTime() + 20e3
      this.canRefreshTime = new Date(d)
      this.refresh(true)
    },
    refresh(direct_refresh = false) {
      if (!direct_refresh && new Date() < this.canRefreshTime) return
      const { innerData } = this
      if (!innerData) return
      const lastIndex = this.currentIndex
      if (this.currentIndex >= innerData.length - 1) {
        this.currentIndex = -1
      }
      this.currentIndex++
      if (
        lastIndex === this.currentIndex ||
        this.currentIndex >= this.innerData.length
      ) {
        if (direct_refresh) return this.$message.warning('无更多数据可用')
        return
      }
      this.current = this.innerData[this.currentIndex]
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
  transition: all ease-out 1s;
  display: inline-block;
  text-align: center;
  border-radius: 0.4rem;
  user-select: none;
  cursor: pointer;
  &:hover {
    background-color: #21f0ff9f;
    .reference {
      opacity: 1;
      transform: translateY(-0.5rem);
    }
  }
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
.reference {
  color: #ffffff;
  opacity: 0;
      transform: translateY(0.5rem);
}
</style>
