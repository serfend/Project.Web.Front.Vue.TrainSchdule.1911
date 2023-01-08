<template>
  <div v-loading="loading">
    <SingleCard v-for="(i,index) in data" :key="index" class="single-card" :data="i" :index="data.length-index" />
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
  box-shadow: 0.1rem 0.1rem 0.3rem 0.2rem #0000003f;
  background-color: #ffffff3f;
  height: 12rem;
  width: 15rem;
  transition: transform ease 0.5s;
  transition: opacity ease 1.5s;
  border-radius: 0.8rem;
}

</style>
