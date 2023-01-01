<template>
  <el-card v-loading="loading">
    <template slot="header">
      <el-button type="success" icon="el-icon-refresh-right" round @click="refresh" />
    </template>
    <el-row :gutter="20">
      <el-col>
        <div style="display:flex">
          <span style="width:3rem">搜索</span>
          <el-input v-model="search" @input="refresh" />
        </div>
        <el-table :data="configs">
          <el-table-column label="名称">
            <template slot-scope="scope">{{ scope.row.name }}</template>
          </el-table-column>
          <el-table-column label="创建时间">
            <template slot-scope="scope">{{ formatTime(scope.row.create) }}</template>
          </el-table-column>
          <el-table-column label="修改时间">
            <template slot-scope="scope">{{ formatTime(scope.row.update) }}</template>
          </el-table-column>
          <el-table-column label="修改人">
            <template slot-scope="scope">{{ scope.row.updateBy }}</template>
          </el-table-column>
          <el-table-column label="生效">
            <template slot-scope="scope">
              <el-switch v-model="scope.row.enable" @change="handleSwitch(scope.row)" />
            </template>
          </el-table-column>
          <el-table-column label="操作" width="300rem">
            <template slot-scope="scope">
              <el-button
                type="warning"
                icon="el-icon-edit-outline"
                @click="showNodeDialoag('edit',scope.row)"
              >编辑</el-button>
              <el-button
                type="info"
                icon="el-icon-circle-close"
                @click="showNodeDialoag('delete',scope.row)"
              >删除</el-button>
            </template>
          </el-table-column>
        </el-table>
        <Pagination :pagesetting.sync="pages" :total-count="pagesTotalCount" />
      </el-col>
    </el-row>
    <el-button
      plain
      type="success"
      icon="el-icon-circle-plus-outline"
      style="width:100%"
      @click="showNodeDialoag('new',null)"
    >添加</el-button>
    <el-dialog
      :visible.sync="nodeDialogShow"
      :title="newNode.mode=='new'?'新增':newNode.mode=='edit'?'编辑':'删除'"
    >
      <el-form v-loading="loading" label-width="120px">
        <el-form-item label="名称" style="width:400px">
          <el-input v-model="newNode.name" placeholder="填入独一无二的名称" />
        </el-form-item>
        <el-form-item label="描述">
          <el-input
            v-model="newNode.description"
            placeholder="节点描述，可自定义"
            style="width:400px"
            type="textarea"
            autosize
          />
        </el-form-item>
        <el-form-item label="数据">
          <MonacoEditor
            v-model="newNode.data"
            height="20rem"
          />
        </el-form-item>
        <el-form-item label="单位" style="width:400px">
          <CompanySelector :code.sync="newNode.companyRegion" />
        </el-form-item>
        <el-form-item label="激活">
          <el-switch v-model="newNode.enable" />
        </el-form-item>
        <AuthCode :form.sync="newNode.auth" select-name="通用设置配置" />
        <el-button-group style="width:100%">
          <el-button
            v-loading="loading"
            type="success"
            style="width:50%"
            @click="submitNode"
          >保存</el-button>
          <el-button
            v-loading="loading"
            type="danger"
            style="width:50%"
            @click="deleteNode"
          >删除</el-button>
        </el-button-group>
      </el-form>
    </el-dialog>
  </el-card>
</template>

<script>
import { formatTime } from '@/utils'
import { postConfig, getConfig, allConfig } from '@/api/common/general_config'
export default {
  name: 'GeneralConfig',
  components: {
    MonacoEditor: () => import('@/components/JsonEditor/MonacoEditor'),
    AuthCode: () => import('@/components/AuthCode'),
    CompanySelector: () => import('@/components/Company/CompanySelector'),
    Pagination: () => import('@/components/Pagination')
  },
  data: () => ({
    loading: false,
    pages: {
      pageIndex: 0,
      pageSize: 5
    },
    pagesTotalCount: 0,
    configs: [],
    nodeDialogShow: false,
    newNode: { mode: null, name: null, data: null, dataType: null, enable: false, description: null, companyRegion: null, auth: {}},
    userSelect: {},
    search: null
  }),
  computed: {
  },
  watch: {
    pages: {
      handler(val) {
        this.refresh()
      },
      immediate: true,
      deep: true
    }
  },
  mounted() {
  },
  methods: {
    formatTime,
    handleSwitch (val) {
      this.submitNode(val)
    },
    onSearch (key, callback) {
      debugger
      allConfig({ search: key, pageIndex: 0, pageSize: 10 }).then(data => {
        callback(data.list.map(i => i.name))
      })
    },
    submitNode (obj) {
      const { auth } = this.newNode
      const data_raw = Object.assign({}, this.newNode)
      obj = obj || {}
      const data = Object.assign(data_raw, obj)
      delete data.auth
      delete data.mode
      this.loading = true
      postConfig({ data, auth }).then(() => {
        this.$message.success('已提交')
      }).finally(() => {
        this.refresh()
      })
    },
    deleteNode () {
      return this.submitNode({ isRemove: true })
    },
    showNodeDialoag(mode, target) {
      const node = this.newNode
      this.nodeDialogShow = true
      node.mode = mode
      if (target) {
        Object.assign(node, target)
        return
      }
      node.enable = true
    },
    refresh () {
      const { pages, search } = this
      this.loading = true
      allConfig(Object.assign({ search }, pages))
        .then((data) => {
          this.configs = data.list
          this.pagesTotalCount = data.totalCount
        })
        .finally(() => {
          this.loading = false
        })
    },
    detail () {
      getConfig()
    }
  }
}
</script>

<style>
</style>
