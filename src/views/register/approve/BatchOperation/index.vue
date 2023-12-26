<template>
  <div>
    <el-card>
      <template #header>
        <h2>批量操作</h2>
      </template>
      <div>{{ currentFinalUsers.length }}人已选中</div>
      <el-button type="primary" @click="showMoveTo = true">移动到...</el-button>
    </el-card>
    <el-dialog :visible.sync="showMoveTo" append-to-body>
      <el-form label-width="6rem">
        <el-form-item label="待调整人员">
          <UserBatchSelector
            :users="currentFinalUsers"
            :selected-users.sync="data.ids"
            :btn-edit-label="null"
            @requireEdit="handleEdit"
          />
        </el-form-item>
        <el-form-item label="单位类型" :error="validator.companyType">
          <CompanyTypeSelector v-model="data.companyType" />
        </el-form-item>
        <el-form-item label="目标单位" :error="validator.modifyTo">
          <CompanySelector :code.sync="data.modifyTo" />
        </el-form-item>
        <el-form-item label="操作授权">
          <AuthCode :form.sync="auth" select-name="UserBatchOperation" />
        </el-form-item>

        <el-button
          v-loading="loading"
          type="success"
          @click="handleEdit"
        >提交</el-button>
        <el-button type="info" @click="showMoveTo = false">取消</el-button>
        <el-button
          type="text"
          style="color:#ff0000"
          @click="clearSelect"
        >清空选中</el-button>
      </el-form>
    </el-dialog>
  </div>
</template>

<script>
import { postUserCompany } from '@/api/user/userinfo'
export default {
  name: 'BatchOperation',
  components: {
    CompanyTypeSelector: () =>
      import('@/components/Company/CompanyTypeSelector'),
    CompanySelector: () => import('@/components/Company/CompanySelector'),
    UserBatchSelector: () => import('@/components/User/UserBatchSelector'),
    AuthCode: () => import('@/components/AuthCode')
  },
  model: {
    event: 'change',
    prop: 'currentFocusUsers'
  },
  props: {
    currentFocusUsers: { type: Array, default: () => [] }
  },
  data: () => ({
    loading: false,
    showMoveTo: false,
    data: {
      companyType: null,
      modifyTo: null,
      ids: []
    },
    hasTriedSubmit: false,
    auth: null,
    currentCachedUsers: {}, // 用于保留徐那种
    currentFinalUsers: []
  }),
  computed: {
    validator() {
      if (!this.hasTriedSubmit) return {}
      const { data } = this
      const r = {
        modifyTo: data.modifyTo ? null : '未填写',
        companyType: data.companyType !== null ? null : '未填写'
      }
      const v = !(Object.values(r).findIndex(i => i) > -1)
      return Object.assign({ v }, r)
    }
  },
  watch: {
    'currentFocusUsers.length': {
      handler(v) {
        this.data.ids = this.currentFocusUsers.map(i => i.id || i)
        this.attachUsersToCache()
        this.currentFinalUsers = Object.values(this.currentCachedUsers)
      },
      immediate: true,
    }
  },
  methods: {
    attachUsersToCache() {
      const { currentFocusUsers, currentCachedUsers } = this
      currentFocusUsers.map(x => {
        currentCachedUsers[x.id] = x
      })
    },
    clearSelect() {
      this.$emit('change', [])
      this.data.ids = []
      this.currentCachedUsers = {}
    },
    async handleEdit() {
      if (!this.hasTriedSubmit) {
        this.hasTriedSubmit = true
        return this.$nextTick(() => {
          this.handleEdit()
        })
      }
      const { auth, data } = this
      const modifies = data.ids.map(i => ({
        companyType: data.companyType,
        modifyTo: data.modifyTo,
        id: i
      }))
      if (!this.validator.v) { return this.$message.warning('信息有误，请检查填写项') }
      await this.$confirm(
        `即将批量更改${modifies.length}名人员的信息，确定吗？`,
        '确定更改'
      )
      this.loading = true
      postUserCompany(modifies, auth)
        .then(data => {})
        .finally(() => {
          this.$message.success('已批量更改完成')
          this.$emit('requireUpdate')
          this.loading = false
        })
    }
  }
}
</script>
