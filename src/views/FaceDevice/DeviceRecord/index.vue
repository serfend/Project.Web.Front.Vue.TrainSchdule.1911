<template>
  <el-card v-loading="loading">
    <el-form inline label-width="5rem">
      <el-form-item label="用户">
        <UserSelector
          :code.sync="search.user"
          default-info="搜索成员"
          style="display:inline"
        />
      </el-form-item>
      <el-form-item label="授权时间起" label-width="120">
        <el-date-picker
          v-model="search.timeStart"
          type="daterange"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          format="yyyy年MM月dd日"
          value-format="yyyy-MM-dd"
          clearable
        />
      </el-form-item>
      <el-form-item label="授权时间止" label-width="120">
        <el-date-picker
          v-model="search.timeEnd"
          type="daterange"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          format="yyyy年MM月dd日"
          value-format="yyyy-MM-dd"
          clearable
        />
      </el-form-item>
      <el-form-item label="归属单位">
        <CompanySelector ref="companiesSelector" v-model="search.company" />
      </el-form-item>
    </el-form>

    <el-table v-if="datas && datas.length" v-loading="loading" :data="datas">
      <el-table-column label="序号" width="40rem">
        <template slot-scope="data">
          {{ data["$index"] + 1 }}
        </template>
      </el-table-column>
      <el-table-column label="创建时间">
        <template slot-scope="{ row }">
          <div style="text-wrap:nowrap">{{ formatTime(row.created) }}</div>
        </template>
      </el-table-column>
      <el-table-column label="授权">
        <template slot-scope="{ row }">
          {{ row.is_Open?'允许':'禁止' }}
        </template>
      </el-table-column>
      <el-table-column label="单位" min-width="150">
        <template slot-scope="{ row }">
          <CompanyFormItem :id="row.companyCode" />
        </template>
      </el-table-column>
      <el-table-column label="用户" min-width="150">
        <template slot-scope="{ row }">
          <UserFormItem :userid="row.userId" />
        </template>
      </el-table-column>
      <el-table-column label="授权时间起">
        <template slot-scope="{ row }">
          <el-tooltip :content="parseTime(row.time_Start)">
            <div style="text-wrap:nowrap">{{ formatTime(row.time_Start) }}</div>
          </el-tooltip>
        </template>
      </el-table-column>
      <el-table-column label="授权时间止">
        <template slot-scope="{ row }">
          <el-tooltip :content="parseTime(row.time_End)">
            <div style="text-wrap:nowrap">{{ formatTime(row.time_End) }}</div>
          </el-tooltip>
        </template>
      </el-table-column>
    </el-table>
    <NoData v-else />
    <Pagination
      :pagesetting.sync="pagesetting"
      :total-count="pagesTotalCount"
    />
  </el-card>
</template>
<script>
import { locationChildren } from '@/api/common/static'
import { parseTime, formatTime, debounce } from '@/utils'
import { faceLockRecords } from '@/api/securityManage/face/face-record'
export default {
  name: 'DeviceRecord',
  components: {
    Pagination: () => import('@/components/Pagination'),
    UserFormItem: () => import('@/components/User/UserFormItem'),
    UserSelector: () => import('@/components/User/UserSelector'),
    CompanySelector: () => import('@/components/Company/CompanySelector'),
    CompanyFormItem: () => import('@/components/Company/CompanyFormItem'),
    NoData: () => import('@/views/Loading/NoData')
  },
  data: () => ({
    search: {
      device: null,
      user: null,
      company: null,
      created: null,
      description: null,
    },
    pagesetting: {
      pageIndex: 0,
      pageSize: 20
    },
    pagesTotalCount: 0,
    datas: [],
    auth: null,
    loading: false
  }),
  computed: {
    requireRefresh() {
      return debounce(() => {
        this.refresh()
      }, 300)
    }
  },
  watch: {
    search: {
      handler() {
        this.requireRefresh()
      },
      deep: true
    },
    pagesetting: {
      handler() {
        this.requireRefresh()
      },
      deep: true
    }
  },
  mounted() {
    this.requireRefresh()
  },
  methods: {
    locationChildren,
    parseTime,
    formatTime,
    refresh () {
      const page = Object.assign({}, { page: this.pagesetting })
      const payload = Object.assign(page, this.search)
      payload.company = payload.company && payload.company.code
      this.loading = true
      faceLockRecords(payload)
        .then(data => {
          this.datas = data.list
          this.pagesTotalCount = data.totalCount
        })
        .finally(() => {
          this.loading = false
        })
    }
  }
}
</script>
