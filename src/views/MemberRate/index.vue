<template>
  <div>
    <el-card>
      <el-button type="primary" icon="el-icon-upload" @click="upload_dialog_show = true">评级上传</el-button>
      <el-dialog :visible.sync="upload_dialog_show" append-to-body>
        <Upload v-if="upload_dialog_show" />
      </el-dialog>
    </el-card>
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
        <el-form-item id="companySelector" label="单位">
          <CompanySelector ref="companySelector" :code.sync="search.company" />
        </el-form-item>
        <el-form-item label="被考评人">
          <UserSelector :code.sync="search.user" />
        </el-form-item>
        <el-form-item label="类别">
          <RatingTypeSelector v-model="search.ratingType" :item.sync="search.ratingTypeItem" />
        </el-form-item>
        <el-form-item v-if="search.ratingType" label="评比期数">
          <RatingCycleSelector
            v-model="search.ratingTypeCycleCount"
            :rating-type="search.ratingType"
            :date-name.sync="search.ratingTypeCycleDesc"
          />
        </el-form-item>
        <el-form-item id="onlySelfSelector" label="只看自己">
          <el-switch v-model="search.onlySelf" />
        </el-form-item>
      </el-form>
      <el-button
        v-loading="loading_export"
        type="primary"
        style="width:100%"
        icon="el-icon-download"
        @click="export_current"
      >导出当前筛选查询</el-button>
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
import { downloadByPath } from '@/api/common/file'
import { downloadBlob, exportXlsByTemplate } from '@/utils/file'
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
    Upload: () => import('./Upload'),
    Pagination: () => import('@/components/Pagination')
  },
  data: () => ({
    loading: false,
    loading_export: false,
    ratingType: ratingTypeDict,
    searchForm: null,
    search: {
      company: null,
      user: null,
      ratingType: 4,
      ratingTypeItem: null,
      ratingTypeCycleCount: 0,
      ratingTypeCycleDesc: null,
      onlySelf: false
    },
    page: {
      pageIndex: 0,
      pageSize: 50
    },
    totalCount: 0,
    list: [],
    help_dialog_show: false,
    upload_dialog_show: false,
    driver: null,
    template: null
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
        this.page.pageIndex = 0
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
    export_current() {
      // TODO Build Component:<TemplateSelector/>
      this.loading_export = true
      const actions = []
      const filename = '周考月评'
      if (!this.template) {
        actions.push(
          downloadByPath(
            'xlsTemplate',
            `${filename}模板.xlsx`,
            false,
            'arraybuffer'
          ).then(data => {
            this.template = data
          })
        )
      }
      const a = new Promise((res, rej) => {
        const cb = data => {
          res(data)
        }
        this.refresh(cb, { pageIndex: 0, pageSize: 1e4 })
      })
      actions.push(a)
      Promise.all(actions)
        .then(data => {
          data = data[0] || data[1]
          if (this.template.byteLength < 1e2) {
            return this.$message.error('加载模板失败')
          }
          const m = new Date().getMonth() + 1
          data.createDate = `${m}月`
          data.exportDate = `${m}月${new Date().getDate()}日`
          data.list = data.list.map(i => {
            const u = i.user
            if (u) {
              const f = this.formatTime(u.userTitleDate, '{y}.{m}')
              u.titleAndDate = `${u.userTitle}\n${f}`
              u.companyAndDuty = `${u.companyName}${u.dutiesName}`
            }
            return i
          })
          const ratingTypeCycleDesc = this.search.ratingTypeCycleDesc
          const ratingType = this.search.ratingTypeItem[0]
          const valid = ratingTypeCycleDesc && ratingType
          const prefix = valid
            ? `${ratingTypeCycleDesc}${ratingType} - `
            : '常规 - '
          data = exportXlsByTemplate(this.template, data)
          downloadBlob(data, `${prefix}${filename}.xlsx`)
        })
        .finally(() => {
          this.loading_export = false
        })
    },
    refresh(cb, page) {
      if (this.loading) return
      this.searchForm.setRecord(this.search)
      this.loading = true
      const s = Object.assign({}, this.search)
      if (s.onlySelf) s.user = this.currentUser
      if (!cb) {
        cb = d => {
          this.list = d.list
          this.totalCount = d.totalCount
        }
      }
      page = page || this.page
      this.get_rates(Object.assign(s, { page }))
        .then(cb)
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
