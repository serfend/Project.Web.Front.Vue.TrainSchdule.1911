<template>
  <div v-loading="loading" style="display:flex">
    <SingleCard v-for="(i,index) in data" :key="index" class="single-card" v-bind="i" />
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
    refresher: null
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
}
</style>
