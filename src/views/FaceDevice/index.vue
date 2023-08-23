<template>
  <el-card v-loading="loading">
    <el-form label-width="5rem">
      <el-form-item label="搜索">
        <el-input v-model="search_name" />
      </el-form-item>
      <el-form-item label="ip">
        <el-input v-model="search.ip" />
      </el-form-item>
      <el-form-item label="归属单位">
        <CompaniesSelector ref="companiesSelector" v-model="search.companies" />
      </el-form-item>
      <el-form-item label="操作">
        <el-button type="success" @click="onEdit({})">添加</el-button>
        <el-button type="success" @click="refresh()">刷新</el-button>
      </el-form-item>
    </el-form>

    <el-table v-if="devices && devices.length" :data="devices">
      <el-table-column label="序号" width="40rem">
        <template slot-scope="data">
          {{ data["$index"] + 1 }}
        </template>
      </el-table-column>
      <el-table-column label="是否启用" min-width="60">
        <template slot-scope="{ row }">
          <el-switch v-model="row.enabled" @change="onEnable(row)" />
        </template>
      </el-table-column>
      <el-table-column label="是否入口" min-width="60">
        <template slot-scope="{ row }">
          <el-switch v-model="row.isEntrence" disabled />
        </template>
      </el-table-column>

      <el-table-column label="昵称" min-width="150">
        <template slot-scope="{ row }">
          <el-tooltip :content="row.offlineReason" placement="right">
            <el-tag :type="row.isAlived ? 'success' : 'danger'">
              {{ row.name || '正常运行' }}</el-tag>
          </el-tooltip>
        </template>
      </el-table-column>
      <el-table-column label="设备名称" min-width="150">
        <template
          slot-scope="{ row }"
        >{{ row.deviceName }}
        </template>
      </el-table-column>
      <el-table-column label="ip" width="150">
        <template slot-scope="{ row }">
          <div style="text-wrap:nowrap">{{ row.ip }}</div>
        </template>
      </el-table-column>
      <el-table-column label="归属" min-width="150">
        <template slot-scope="{ row }">
          <CompanyFormItem :id="row.company" />
        </template>
      </el-table-column>
      <el-table-column label="区域" min-width="200">
        <template slot-scope="{ row }">
          <CascaderSelector
            :data="{ code: row.district, name: row.districtName }"
            :disabled="true"
            :child-getter-method="locationChildren"
            :value-name="'code'"
            :label-name="'name'"
            width="100%"
          />
        </template>
      </el-table-column>
      <el-table-column label="备注">
        <template slot-scope="{ row }">
          {{ row.type }}
        </template>
      </el-table-column>
      <el-table-column label="账号">
        <template slot-scope="{ row }">
          {{ row.userName }}
        </template>
      </el-table-column>
      <el-table-column label="密码">
        <template slot-scope="{ row }">
          {{ row.password ? "******" : "无密码" }}
        </template>
      </el-table-column>
      <el-table-column label="创建时间">
        <template slot-scope="{ row }">
          <div style="text-wrap:nowrap">{{ formatTime(row.create) }}</div>
        </template>
      </el-table-column>
      <el-table-column label="修改时间">
        <template slot-scope="{ row }">
          <div style="text-wrap:nowrap">{{ formatTime(row.update) }}</div>
        </template>
      </el-table-column>
      <el-table-column label="操作" fixed="right" width="120">
        <template slot-scope="{ row }">
          <el-button type="text" @click="onEdit(row)">修改</el-button>
          <el-button type="text" @click="onRemove(row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <NoData v-else />
    <Pagination
      :pagesetting.sync="pagesetting"
      :total-count="pagesTotalCount"
    />
    <el-dialog :visible.sync="show_add_dialog" width="80%" append-to-body>
      <DeviceForm
        v-if="show_add_dialog"
        v-model="current_device"
        :is-show.sync="show_add_dialog"
        @requireUpdate="edit"
      />
    </el-dialog>
  </el-card>
</template>
<script>
import { isArray } from '@/utils/validate'
import { locationChildren } from '@/api/common/static'
import { parseTime, formatTime, debounce } from '@/utils'
import { search_devices, batchDevice } from '@/api/securityManage/face/device'
export default {
  name: 'FaceDevice',
  components: {
    DeviceForm: () => import('./DeviceForm'),
    Pagination: () => import('@/components/Pagination'),
    CompaniesSelector: () => import('@/components/Company/CompaniesSelector'),
    CompanyFormItem: () => import('@/components/Company/CompanyFormItem'),
    CascaderSelector: () => import('@/components/CascaderSelector'),
    NoData: () => import('@/views/Loading/NoData')
  },
  data: () => ({
    show_add_dialog: false,
    current_device: {},
    search_name: null,
    search: {
      ip: null,
      district: 0,
      companies: [],
      id: null,
      create: null,
      name: null,
      type: null
    },
    pagesetting: {
      pageIndex: 0,
      pageSize: 20
    },
    pagesTotalCount: 0,
    devices: [],
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
    search_name(v) {
      let call_count = 0
      let totalCount = 0
      const result = {}
      const callback = (index, data) => {
        return new Promise((res, rej) => {
          if (index === 0) {
            data.totalCount = -data.totalCount
          }
          totalCount += data.totalCount
          call_count++
          data.list.map(x => {
            result[x.id] = x
          })
          if (call_count < 3) return
          res({
            list: Object.values(result),
            totalCount
          })
        })
      }
      // 重置搜索
      const search = Object.assign({}, this.search)
      search.name = v
      search.type = v
      this.refresh(data => callback(0, data), search)

      search.name = v
      search.type = null
      this.refresh(data => callback(1, data), search)
      search.name = null
      search.type = v
      this.refresh(data => callback(2, data), search)
    },
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
    edit(data_list) {
      if (!data_list) return this.$message.warning('无效的数据提交')
      if (!isArray(data_list)) data_list = [data_list]
      this.loading = true
      const { auth } = this
      batchDevice({
        data: data_list,
        auth
      })
        .then(() => {
          this.$message.success('已保存')
        })
        .finally(() => {
          this.requireRefresh()
          this.loading = false
        })
    },
    refresh(callback, search) {
      this.loading = true
      if (!callback) callback = data => new Promise((res, rej) => res(data))
      search = Object.assign({}, search || this.search)
      const { pagesetting } = this
      search_devices(
        Object.assign(search, {
          company: search && search.companies.map(x => x.code),
          page: pagesetting
        })
      )
        .then(data => {
          callback(data).then(data => {
            this.devices = data.list.map(x => (Object.assign({ enabled: !x.disabled }, x)))
            this.pagesTotalCount = data.totalCount
          })
        })
        .finally(() => {
          this.loading = false
        })
    },
    onEdit(row) {
      this.current_device = row || {}
      this.show_add_dialog = true
    },
    onEnable(row) {
      row.disabled = !row.enabled
      this.edit(row)
    },
    async onRemove(row) {
      const confirmed = await this.$confirm('确定删除吗')
      if (!confirmed) return
      row.isremoved = true
      this.edit([row])
    }
  }
}
</script>
