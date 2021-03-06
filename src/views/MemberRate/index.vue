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
          <CompanySelector v-model="search.company" />
        </el-form-item>
        <el-form-item label="被考评人">
          <UserSelector :code.sync="search.user" />
        </el-form-item>
      </el-form>
    </el-card>
    <el-card v-loading="loading" style="margin-top:1rem">
      <el-table :data="list">
        <el-table-column label="姓名">
          <template #default="scope">
            <el-tooltip content="查看个人详情">
              <el-button type="text">{{ scope.row.realName }}</el-button>
            </el-tooltip>
          </template>
        </el-table-column>
        <el-table-column label="职务">
          <template #default="scope">{{ scope.row.duty }}</template>
        </el-table-column>
        <el-table-column label="单位">
          <template #default="scope">{{ scope.row.company }}</template>
        </el-table-column>
        <el-table-column label="单位内排序">
          <template #default="scope">{{ scope.row.rank }}</template>
        </el-table-column>
        <el-table-column label="评级">
          <template #default="scope">{{ scope.row.result }}</template>
        </el-table-column>
        <el-table-column label="备注">
          <template #default="scope">{{ scope.row.remark }}</template>
        </el-table-column>
      </el-table>
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
export default {
  name: 'MemberRate',
  components: {
    CompanySelector: () => import('@/components/Company/CompanySelector'),
    UserSelector: () => import('@/components/User/UserSelector'),
    Help: () => import('./Help')
  },
  data: () => ({
    loading: false,
    ratingType: ratingTypeDict,
    searchForm: null,
    search: {
      date: null,
      company: null,
      user: null,
      ratingType: 0,
      ratingTypeCycleCount: 0
    },
    list: [],
    help_dialog_show: false
  }),
  watch: {
    search: {
      handler(val) {
        this.refresh()
      },
      deep: true
    }
  },
  mounted() {
    this.searchForm = new FormRecorder('memberRate.summary', this.search)
    this.search = this.searchForm.getRecord()
  },
  methods: {
    show_help() {
      this.help_dialog_show = true
    },
    refresh() {
      this.searchForm.setRecord(this.search)
      this.loading = true
      setTimeout(() => {
        this.list = [{ realName: '施工中' }]
        this.loading = false
      }, 500)
    }
  }
}
</script>

<style lang="scss"  scoped>
</style>
