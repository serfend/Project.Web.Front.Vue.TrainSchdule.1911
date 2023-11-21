<template>
  <el-card class="mini-card">
    <UsersSelectorByCompany
      ref="UsersSelectorByCompany"
      :total-count.sync="membersCount"
      :members-query.sync="MembersQuery"
      :now-select-company.sync="nowSelectCompany"
      :list.sync="members"
      :loading.sync="loading"
    />
    <div class="status-pannel">
      <h2>{{ currentCompany }}统计</h2>
      <div>（{{ membersCount }}人）</div>
    </div>
    <CounterCard v-model="statistics" />
  </el-card>
</template>
<script>
export default {
  name: 'StatisticsVacation',
  components: {
    UsersSelectorByCompany: () =>
      import('@/components/Company/UsersSelectorByCompany'),
    CounterCard: () => import('./CounterCard')
  },
  data: () => ({
    members: [],
    loading: false,
    membersCount: 0,
    statistics: [
      { header: '休满假率', content: '233\nline2', footer: '555' },
      { header: '休假满60%率', content: '233\nline2', footer: '555' },
      { header: '天数完成率', content: '233\nline2', footer: '555' },
      { header: '人数完成率', content: '233\nline2', footer: '555' },
      { header: '休满假率', content: '233\nline2', footer: '555' },
      { header: '休假满60%率', content: '233\nline2', footer: '555' },
      { header: '天数完成率', content: '233\nline2', footer: '555' },
      { header: '人数完成率', content: '233\nline2', footer: '555' }
    ],
    MembersQuery: {
      userCompanyType: 0,
      includeChild: true,
      page: {
        pageIndex: 0,
        pageSize: 1e8
      }
    },
    nowSelectCompany: null
  }),
  computed: {
    currentCompany() {
      const c = this.nowSelectCompany
      if (!c) return '本单位'
      return c.name
    }
  },
  watch: {
    loading: {
      handler(v) {
        this.$emit('update:loading', v)
      }
    }
  },
  mounted() {
    this.MembersQuery.includeChild = false
  }
}
</script>
<style lang="scss">
.status-pannel {
  display: flex;
  line-height: 2rem;
}

.mini-card {
  .el-card__body {
    padding: 0.5rem !important;
  }
}
</style>
