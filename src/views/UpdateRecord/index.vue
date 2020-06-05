<template>
  <div>
    <AuthCode :form.sync="auth" />
    <el-table :data="list">
      <el-table-column label="版本">
        <template slot-scope="scope">
          <el-input v-model="scope.row.version" />
        </template>
      </el-table-column>
      <el-table-column label="更新时间">
        <template slot-scope="scope">
          <el-date-picker
            v-model="scope.row.create"
            format="yyyy-MM-dd HH:mm:ss"
            value-format="yyyy-MM-dd HH:mm:ss"
          />
        </template>
      </el-table-column>
      <el-table-column label="描述">
        <template slot-scope="scope">
          <el-input v-model="scope.row.description" />
        </template>
      </el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button
            :disabled="isEqual(prev[scope.row.version],scope.row)"
            type="info"
            @click="handleAction(scope.row,'cancel')"
          >取消</el-button>
          <el-button type="success" @click="handleAction(scope.row,'save')">保存</el-button>
          <el-button
            :disabled="!scope.row.saved"
            type="danger"
            @click="handleAction(scope.row,'delete')"
          >删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <Pagination :pagesetting.sync="pages" :total-count="pagesTotalCount" />
    <el-button icon="el-icon-plus" type="success" style="width:100%" @click="addNew">添加记录</el-button>
  </div>
</template>

<script>
import AuthCode from '@/components/AuthCode'
import Pagination from '@/components/Pagination'
import { modifyUpdateRecord, getUpdateRecord } from '@/api/common/version'
export default {
  name: 'UpdateRecord',
  components: { AuthCode, Pagination },
  data: () => ({
    list: [],
    prev: {}, // 记录上次保存的记录
    auth: {
      authByUserId: null,
      code: ''
    },
    pagesTotalCount: 0,
    pages: { pageIndex: 0, pageSize: 10 }
  }),
  watch: {
    pages: {
      handler(val) {
        this.$nextTick(() => {
          this.refresh()
        })
      }
    }
  },
  mounted() {
    this.refresh()
  },
  methods: {
    refresh() {
      getUpdateRecord(this.pages.pageIndex, this.pages.pageSize).then(data => {
        this.list = data.list.map(i => {
          this.prev[i.version] = i
          this.prev[i.version].saved = true
          return Object.assign({ saved: true }, i)
        })

        this.pagesTotalCount = data.totalCount
      })
    },
    update(model) {
      var m = Object.assign({}, model)
      delete m.saved
      modifyUpdateRecord(m, this.auth).then(data => {
        this.$message.success(model.isRemoved ? '已删除' : '已更新')
        if (model.isRemoved) {
          var rIndex = this.list.findIndex(i => i.version === model.version)
          this.list.splice(rIndex, 1)
        }
      })
    },
    addNew() {
      this.list.push({
        version: '版本号',
        description: '描述信息',
        create: new Date(),
        saved: false
      })
    },
    isEqual(a, b) {
      if (!a || !b) return true
      return (
        a.version === b.version &&
        a.description === b.description &&
        a.create === b.create
      )
    },
    async handleAction(item, action) {
      switch (action) {
        case 'delete': {
          if (await this.$confirm('删除将无法恢复,是否继续')) {
            item.isRemoved = true
          } else {
            return
          }
          break
        }
        case 'save': {
          break
        }
        case 'cancel': {
          if (!this.prev[item.version]) {
            return this.$message.error('无历史记录')
          } else {
            item = Object.assign({}, this.prev[item.version])
            return
          }
        }
      }
      this.update(item)
    }
  }
}
</script>

<style>
</style>
