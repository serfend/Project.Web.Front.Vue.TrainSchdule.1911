<template>
  <div>
    <el-card>
      <template #header>
        <div style="display:flex">
          <h2>周考月评</h2>
          <el-tooltip style="color:#2c80c5;cursor: pointer;" content="查看帮助">
            <i class="el-icon-question" @click="show_help" />
          </el-tooltip>
        </div>
      </template>
      <el-form inline>
        <el-form-item label="考评时间">
          <el-date-picker v-model="search.date" type="month" placeholder="选择年月" />
        </el-form-item>
        <el-form-item label="单位">
          <CompanySelector :code.sync="search.company" />
        </el-form-item>
        <el-form-item label="被考评人">
          <UserSelector :code.sync="search.user" />
        </el-form-item>
        <el-form-item label="类别">
          <RatingTypeSelector v-model="search.ratingType" />
        </el-form-item>
        <el-form-item v-if="search.ratingType" label="评比期数">
          <RatingCycleSelector v-model="search.ratingCycleCount" :rating-type="search.ratingType" />
        </el-form-item>
      </el-form>
    </el-card>
    <el-card v-loading="loading" style="margin-top:1rem">
      <el-table :data="list">
        <el-table-column label="姓名" width="120rem">
          <template #default="scope">
            <UserFormItem :userid="scope.row.userId" />
          </template>
        </el-table-column>
        <el-table-column label="单位" width="200rem">
          <template #default="scope">
            <CompanyFormItem :id="scope.row.companyCode" />
          </template>
        </el-table-column>
        <el-table-column label="排序" width="50rem">
          <template #default="scope">{{ scope.row.rank }}</template>
        </el-table-column>
        <el-table-column label="评级" width="70rem">
          <template #default="scope">
            <MemberRateStatusTag v-model="scope.row.level" />
          </template>
        </el-table-column>
        <el-table-column label="备注">
          <template #default="scope">{{ scope.row.remark }}</template>
        </el-table-column>
      </el-table>
      <Pagination :pagesetting.sync="page" :total-count="totalCount" />
    </el-card>
    <el-dialog :visible.sync="help_dialog_show">
      <template #title>
        <h2>周考月评</h2>
      </template>
      <Help />
    </el-dialog>
  </div>
</template>

<script>
import { FormRecorder } from '@/utils/form'
import { ratingTypeDict } from './setting'
import { get_rates } from '@/api/memberRate/query'
export default {
  name: 'MemberRate',
  components: {
    CompanySelector: () => import('@/components/Company/CompanySelector'),
    UserSelector: () => import('@/components/User/UserSelector'),
    CompanyFormItem: () => import('@/components/Company/CompanyFormItem'),
    UserFormItem: () => import('@/components/User/UserFormItem'),
    Help: () => import('./Help'),
    RatingCycleSelector: () => import('./RatingTypeOption/RatingCycleSelector'),
    RatingTypeSelector: () => import('./RatingTypeOption/RatingTypeSelector'),
    MemberRateStatusTag: () => import('./MemberRateStatusTag'),
    Pagination: () => import('@/components/Pagination')
  },
  data: () => ({
    loading: false,
    ratingType: ratingTypeDict,
    searchForm: null,
    search: {
      date: null,
      company: null,
      user: null,
      ratingType: 4,
      ratingTypeCycleCount: 0
    },
    page: {
      pageIndex: 0,
      pageSize: 50
    },
    totalCount: 0,
    list: [],
    help_dialog_show: false
  }),
  watch: {
    page: {
      deep: true,
      handler(val) {
        this.refresh()
      }
    },
    search: {
      handler(val) {
        this.refresh()
      },
      deep: true
    }
  },
  mounted() {
    this.searchForm = new FormRecorder('memberRate.summary', this.search)
    setTimeout(() => {
      this.search = this.searchForm.getRecord()
    }, 100)
  },
  methods: {
    get_rates,
    show_help() {
      this.help_dialog_show = true
    },
    refresh() {
      if (this.loading) return
      this.searchForm.setRecord(this.search)
      this.loading = true
      const s = Object.assign({}, this.search)
      this.get_rates(Object.assign(s, { page: this.page }))
        .then(d => {
          this.list = d.list
          this.totalCount = d.totalCount
        })
        .finally(() => {
          this.loading = false
        })
    }
  }
}
</script>

<style lang="scss"  scoped>
</style>
