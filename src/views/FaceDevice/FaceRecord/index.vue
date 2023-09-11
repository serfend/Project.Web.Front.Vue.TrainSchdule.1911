<template>
  <el-card v-loading="loading">
    <el-form inline label-width="5rem">
      <el-form-item label="设备id">
        <el-input v-model="search.device" />
      </el-form-item>
      <el-form-item label="内容">
        <el-input v-model="search.description" />
      </el-form-item>

      <el-form-item label="用户">
        <UserSelector
          :code.sync="search.user"
          default-info="搜索成员"
          style="display:inline"
        />
      </el-form-item>
      <el-form-item label="时间" label-width="120">
        <el-date-picker
          v-model="search.created"
          type="daterange"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          format="yyyy年MM月dd日"
          value-format="yyyy-MM-dd"
          clearable
        />
      </el-form-item>
      <el-form-item label="单位">
        <CompanySelector ref="companiesSelector" v-model="search.company" />
      </el-form-item>
      <el-form-item label="操作">
        <el-button type="success" @click="requireRefresh()">刷新</el-button>
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
      <el-table-column label="内容" min-width="150">
        <template slot-scope="{ row }">
          {{ row.description }}
        </template>
      </el-table-column>
      <el-table-column label="用户" min-width="150">
        <template slot-scope="{ row }">
          <UserFormItem v-if="row.user" :userid="row.user" />
        </template>
      </el-table-column>
      <el-table-column label="单位" min-width="150">
        <template slot-scope="{ row }">
          <CompanyFormItem v-if="row.company" :id="row.company" />
        </template>
      </el-table-column>
      <el-table-column label="设备名称" min-width="150">
        <template
          slot-scope="{ row }"
        >{{ row.device && row.device.name }}
        </template>
      </el-table-column>
      <el-table-column label="设备归属" min-width="150">
        <template slot-scope="{ row }">
          <CompanyFormItem v-if="row.device" :id="row.device.company" />
        </template>
      </el-table-column>
      <el-table-column label="区域" min-width="200">
        <template slot-scope="{ row }">
          <CascaderSelector
            v-if="row.device"
            :data="{ code: row.device.district, name: row.device.districtName }"
            :disabled="true"
            :child-getter-method="locationChildren"
            :value-name="'code'"
            :label-name="'name'"
            width="100%"
          />
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
import { faceRecords } from '@/api/securityManage/face/face-record'
export default {
  name: 'FaceRecord',
  components: {
    Pagination: () => import('@/components/Pagination'),
    UserFormItem: () => import('@/components/User/UserFormItem'),
    UserSelector: () => import('@/components/User/UserSelector'),
    CompanySelector: () => import('@/components/Company/CompanySelector'),
    CompanyFormItem: () => import('@/components/Company/CompanyFormItem'),
    CascaderSelector: () => import('@/components/CascaderSelector'),
    NoData: () => import('@/views/Loading/NoData')
  },
  data: () => ({
    refresher: null,
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
  created() {
    this.requireRefresh()
    this.refresher = setInterval(() => {
      this.requireRefresh()
    }, 10e3)
  },
  destroyed() {
    clearInterval(this.refresher)
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
      faceRecords(payload)
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
