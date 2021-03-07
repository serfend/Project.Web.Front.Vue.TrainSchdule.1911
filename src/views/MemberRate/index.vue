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
        <el-form-item id="companySelector" label="单位">
          <CompanySelector ref="companySelector" :code.sync="search.company" />
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
        <el-form-item id="onlySelfSelector" label="只看自己">
          <el-switch v-model="search.onlySelf" />
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
        <el-table-column label="职务" width="150rem">
          <template #default="scope">
            <div v-if="scope.row.user">
              <div>{{ scope.row.user.dutiesName }}</div>
            </div>
          </template>
        </el-table-column>
        <el-table-column label="职级" width="120rem">
          <template #default="scope">
            <div v-if="scope.row.user">
              <div>{{ scope.row.user.userTitle }}</div>
              <div>{{ formatTime(scope.row.user.userTitleDate) }}</div>
            </div>
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
import Driver from 'driver.js' // import driver.js
import 'driver.js/dist/driver.min.css' // import driver.js css
import { FormRecorder } from '@/utils/form'
import { ratingTypeDict } from './setting'
import { get_rates } from '@/api/memberRate/query'
import { formatTime } from '@/utils'
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
      ratingTypeCycleCount: 0,
      onlySelf: false
    },
    page: {
      pageIndex: 0,
      pageSize: 50
    },
    totalCount: 0,
    list: [],
    help_dialog_show: false,
    driver: null
  }),
  computed: {
    currentUser() {
      return this.$store.state.user.userid
    }
  },
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
    this.driver = new Driver({
      closeBtnText: '我知道了'
    })
  },
  methods: {
    formatTime(d) {
      return formatTime(d, '{y}.{m}')
    },
    get_rates,
    show_help() {
      this.help_dialog_show = true
    },
    refresh() {
      if (this.loading) return
      this.searchForm.setRecord(this.search)
      this.loading = true
      const s = Object.assign({}, this.search)
      if (s.onlySelf) s.user = this.currentUser
      this.get_rates(Object.assign(s, { page: this.page }))
        .then(d => {
          this.list = d.list
          this.totalCount = d.totalCount
        })
        .catch(e => {
          if (e.status === 12100) {
            setTimeout(() => {
              const steps = [
                {
                  element: '#companySelector',
                  popover: {
                    title: '查看指定单位',
                    description:
                      '本单位或上级单位管理人员有权限查看本单位的评比情况'
                  }
                },
                {
                  element: '#onlySelfSelector',
                  popover: {
                    title: '仅查看自己',
                    description: '任何人都有权限查看关于【自己】的评比情况'
                  }
                }
              ]
              this.driver.defineSteps(steps)
              this.driver.start()
              this.$refs.companySelector.$el.click()
            }, 500)
          }
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
