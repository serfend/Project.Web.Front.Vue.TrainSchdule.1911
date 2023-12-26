<template>
  <el-card class="mini-card">
    <UsersSelectorByCompany
      ref="UsersSelectorByCompany"
      :total-count.sync="membersCount"
      :members-query.sync="MembersQuery"
      :now-select-company.sync="nowSelectCompany"
      :list.sync="members"
      :loading.sync="loading"
      :use-cache="true"
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
import { build_template, all_types } from './statistics_handler'
export default {
  name: 'StatisticsVacation',
  components: {
    UsersSelectorByCompany: () =>
      import('@/components/Company/UsersSelectorByCompany'),
    CounterCard: () => import('./CounterCard')
  },
  props: {
    callbackExportToXls: { type: Function, default: () => {} }
  },
  data: () => ({
    members: [],
    loading: false,
    membersCount: 0,
    templates: [],
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
      this.templates = all_types.map(x =>
        build_template({
          rate: x.rate,
          s_type: x.type
        })
      )
      this.$emit('update:callbackExportToXls', this.exportToXls)
    },
    convert_data(members) {
      members = members.map(raw => {
        const x = Object.assign({}, raw)
        x.dutiesTags = x.dutiesTags && x.dutiesTags.join(',')

        const vacation = x.vacation || {}
        const { yearlyLength, leftLength } = vacation
        const length = yearlyLength - leftLength
        vacation.length = length
        vacation.rate = yearlyLength ? length / yearlyLength : 1
        x.vacation = vacation
        return x
      })
      members.sort(
        (a, b) =>
          1e6 * (a.vacation.rate - b.vacation.rate) +
          b.vacation.length -
          a.vacation.length
      )

      const { currentCompany, MembersQuery } = this
      const { includeChild, userCompanyType } = MembersQuery
      const child = includeChild ? '(含下级)' : ''
      const companyType = userCompanyType || ''
      const tpl_name = '休假统计'
      const name = `${currentCompany}${child}${companyType}`
      const filename = `${name}_${tpl_name}(${members.length}条).xlsx`
      return {
        name,
        filename,
        members
      }
    },
    exportToXls() {
      const data = this.convert_data(this.members)
      this.loading = true
      this.$store
        .dispatch('template/download_xlsx', {
          templateName: `休假统计模板.xlsx`,
          data: { data },
          filename: data.filename
        })
        .finally(() => {
          this.loading = false
        })
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
