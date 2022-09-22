<template>
  <div>
    <el-button-group>
      <el-button type="success" icon="el-icon-plus" @click="handleAdd">添加{{ conferTypesName }}</el-button>
    </el-button-group>
    <h3 class="table-title">{{ globalCompanyName }}{{ conferTypesName ? `${conferTypesName}登记表` : '会议记录' }}</h3>
    <el-table v-loading="loading" :data="list" border highlight-current-row>
      <el-table-column label="序号" type="index" :width="50">
        <template slot-scope="scope">
          <span>{{ scope.$index + page.pageIndex*page.pageSize + 1 }}</span>
        </template>
      </el-table-column>
      <el-table-column label="时间" prop="startTime" :width="160" />
      <el-table-column label="教育安排来源" prop="educationSource" :width="120" />
      <el-table-column label="教育类型" prop="educationType" :width="120" />
      <el-table-column label="教育方法" prop="educationMethod" :width="120" />
      <el-table-column
        :label="config.formAppend.title||'名称'"
        prop="title"
        width="200px"
        show-overflow-tooltip
      />
      <el-table-column label="时长" width="80">
        <template slot-scope="{row}">{{ row.length && `${row.length/3600}小时` }}</template>
      </el-table-column>
      <el-table-column label="主持人" width="150">
        <template slot-scope="{row}">
          <UserItem :userid="row.host&&row.host.userId" />
        </template>
      </el-table-column>
      <el-table-column label="地点" prop="place" width="150">
        <template slot-scope="{row}">{{ row.place }}</template>
      </el-table-column>
      <el-table-column label="参会人数" prop="countAttend" width="50" />
      <el-table-column label="缺席人数" prop="countAbsent" width="50" />
      <el-table-column :label="extendConfig.formAppend.contend||'内容'" prop="content" />
      <el-table-column fixed="right" label="操作" width="240">
        <template slot-scope="scope">
          <el-button size="mini" @click="handleDetails(scope.row)">详情</el-button>
          <el-button size="mini" @click="handleEdit(scope.row)">编辑</el-button>
          <el-button size="mini" type="danger" @click="handleDelete(scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <ConferEditor
      :show.sync="showNewItem"
      :data="conferenceContent"
      :config="extendConfig"
      @requireRefresh="requireRefresh"
    />
    <Pagination :pagesetting.sync="page" :total-count="totalCount" />
  </div>
</template>
<script>
import { patchConference } from '@/api/zzxt/party-conference/confer'
import getConferenceExtendFields from './details/EventBaseInfo/conferenceExtendFields'
import { getExtendTypes } from '@/api/zzxt/party-conference/confer-extend-fields'
import { companyDetail } from '@/api/company'
import { parseTime, debounce } from '@/utils'
export default {
  name: 'Confer',
  components: {
    Pagination: () => import('@/components/Pagination'),
    UserItem: () => import('@/components/User/UserFormItem'),
    ConferEditor: () => import('./details/EventBaseInfo/Edit'),
    // ExtendFields: () => import('./ConferenceExtendField/index')
  },
  props: {
    config: { type: Object, default: null }
  },
  data: () => ({
    list: null,
    page: { pageIndex: 0, pageSize: 10 },
    totalCount: 0,
    loading: false,
    conferType: null,
    showNewItem: false,
    conferenceContent: null,
    extendConfig: null,
    globalCompanyName: ''
  }),
  computed: {
    requireRefresh() {
      return debounce(() => {
        this.refresh()
      }, 5e2)
    },
    currentCompany() {
      return this.$store.state.user.globalCompany
    },
    conferTypesDict() {
      return this.$store.state.party.conferTypesDict
    },
    conferTypesName() {
      if (!this.conferType) return this.$message.error('无效的会议类型预设')
      if (!this.conferTypesDict) return
      return this.conferTypesDict[this.conferType].alias
    }
  },
  watch: {
    config: {
      handler(val) {
        const temp = Number(val.type).toString(2)
        this.conferType = 1 << (temp.length - 1)
        this.extendConfig = Object.assign(val, { conferType: this.conferType })
        this.dataInit()
        this.requireRefresh()
      },
      deep: true,
      immediate: true
    },
    currentCompany: {
      handler(val) {
        if (!val) return
        this.requireRefresh()
        this.refreshCompanyName(val)
      },
      immediate: true
    },
    page: {
      handler(val) {
        this.loading = true
        this.requireRefresh()
      },
      deep: true
    }
  },
  mounted() {
    this.$store.dispatch('party/initDictionary')
    this.$store.dispatch('party/initConferenceExtendFieldsDictionary', {})
  },
  methods: {
    parseTime,
    refreshCompanyName(companyCode) {
      companyDetail(companyCode).then(data => {
        this.globalCompanyName = data.model.name
      })
    },
    dataInit() {
      getExtendTypes({ conferenceType: this.conferType }).then(data => {
        this.extendConfig.extendTypes = data.list
      })
    },
    refresh() {
      this.loading = true
      const query = {
        partyConferenceType: this.config.type,
        page: this.page,
        company: this.currentCompany
      }
      getConferenceExtendFields(query)
        .then(data => {
          this.list = data.conferences
          this.totalCount = data.totalCount
          this.loading = false
        })
        .catch(e => {
          this.loading = false
        })
    },
    handleEdit(row) {
      this.conferenceContent = row
      this.showNewItem = true
    },
    handleAdd() {
      this.conferenceContent = null
      this.showNewItem = true
    },
    handleDetails(row) {
      this.$router.push({
        path: '/Organization/conference-details',
        query: { id: row.id }
      })
    },
    handleDelete(row) {
      this.$confirm('确认删除？').then(_ => {
        patchConference({ id: row.id, isRemoved: true })
          .then(() => {
            this.$message.success('删除成功')
          })
          .finally(() => {
            this.requireRefresh()
          })
      })
    },
    resetForm(form) {
      form = {}
    }
  }
}
</script>
<style lang="scss" scoped>
.table-title {
  font-weight: 500px;
  margin-top: 1rem;
  margin-bottom: 1rem;
  text-align: center;
}
</style>
<style lang="scss">
.el-table .cell {
  white-space: pre-line;
}
</style>
