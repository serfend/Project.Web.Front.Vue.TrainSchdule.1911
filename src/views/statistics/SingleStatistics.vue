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
import { groupByFiled } from '@/utils/data-handle'
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
    template: [],
    statistics: [],
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
    },
    members: {
      handler(v) {
        this.refresh()
      }
    }
  },
  mounted() {
    this.MembersQuery.includeChild = false
    this.initTemplates()
  },
  methods: {
    initTemplates() {
      // TODO 动态加载
      const get_length = x => {
        const v = x.vacation
        if (!v) return {}
        return { total: v.yearlyLength, left: v.leftLength }
      }
      // 返回 [总数,已完成]
      const s_type_callback = {
        man: {
          name: '人',
          callback: (list, rate) => {
            return [
              list.length,
              list.filter(x => {
                const cur = get_length(x)
                return cur.total <= 0 || cur.left / cur.total <= 1 - rate
              }).length
            ]
          }
        },
        day: {
          name: '天',
          callback: list =>
            list.reduce(
              (prev, cur) => {
                cur = get_length(cur)
                prev[0] += cur.total
                prev[1] += (cur.total - cur.left)
                return prev
              },
              [0, 0]
            )
        }
      }
      const get_group_rate = (g_members, rate, s_type) => {
        const accomplishs = s_type_callback[s_type].callback(g_members, rate)
        return {
          rate: accomplishs[0] <= 0 ? 1 : accomplishs[1] / accomplishs[0],
          count: accomplishs[1],
          total: accomplishs[0]
        }
      }
      const to_percent = x => `${Math.floor(x * 1e4) / 1e2}%`
      const build_template = ({ rate, s_type }) => (
        members,
        g_members,
        name
      ) => {
        const title_rate =
          rate < 0 ? '完成' : rate === 1 ? '休满' : `完成${to_percent(rate)}`
        const title_type = s_type_callback[s_type].name
        const {
          rate: acc_rate,
          count: acc_count,
          total: acc_total
        } = get_group_rate(g_members, rate, s_type)
        const count_rate =
          members.length <= 0 ? 1 : g_members.length / members.length
        return {
          header: `${name}${title_type}数${title_rate}`,
          content: `${acc_count}/${acc_total}${title_type}\n${to_percent(
            acc_rate
          )}`,
          footer: `占比:${to_percent(count_rate)}`
        }
      }
      const raw = [
        { type: 'man', rate: 1 },
        { type: 'day', rate: -1 },
        { type: 'man', rate: 0.6 }
      ]
      this.templates = raw.map(x =>
        build_template({
          rate: x.rate,
          s_type: x.type
        })
      )
    },
    refresh() {
      const { members } = this
      const groups = groupByFiled(members, 'dutiesTags')
      const group_list = Object.keys(groups).map(g => ({
        name: g,
        list: groups[g]
      }))
      group_list.unshift({
        name: '全体',
        list: members
      })

      const result = []
      group_list.map(group => {
        this.templates.map(template => {
          const single_result = template(members, group.list, group.name)
          result.push(single_result)
        })
      })
      this.statistics = result
    }
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
