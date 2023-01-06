<template>
  <div v-loading="loading">
    <transition-group name="slideCard" style="display:flex">
      <SingleCard v-for="(i,index) in data" :key="currentFocus[index] || (i[0] && i[0].title || index)" :current-focus.sync="currentFocus[index]" class="single-card" :data="i" :index="data.length-index" />
    </transition-group>
  </div>
</template>
<script>
import { getConfig } from '@/api/common/general_config'
export default {
  name: 'MemberStatistic',
  components: {
    SingleCard: () => import('./SingleCard')
  },
  props: {},
  data: () => ({
    data: [],
    loading: false,
    refresher: null,
    currentFocus: {}
  }),
  computed: {},
  mounted () {
    this.refresher = setInterval(this.refresh, 60e3)
    this.refresh()
  },
  destroyed() {
    clearInterval(this.refresher)
  },
  methods: {
    refresh () {
      const name = 'global.sec.member-statistics'
      this.loading = true
      getConfig({ name }).then(data => {
        try {
          this.data = JSON.parse(data.model.data)
        } catch {
          return this.$message.error(`人员情况数据获取失败:${name}`)
        }
      }).finally(() => {
        this.loading = false
      })
    }
  }
}
</script>
<style lang="scss" scoped>
.single-card {
  margin: 0 1rem;
  font-size: 2rem;

  display: flex;
  justify-content: center;
  box-shadow: 3px 3px 6px 3px rgba(0, 0, 0, 0.3);
  background-color: #ffffff3f;
  height: 12rem;
  width: 15rem;
  transition: transform ease 0.5s;
  transition: opacity ease 1.5s;
  border-radius: 0.8rem;
}

.slideCard-enter-active {
  opacity: 0;
  transform: translateY(2rem);
}

.slideCard-enter,
.slideCard-leave-to {
  transform: translateY(0);
  opacity: 0;
}
</style>
