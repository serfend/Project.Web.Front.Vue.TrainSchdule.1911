<template>
  <div>
    <el-row :gutter="20">
      <el-col :lg="6" :md="10" :sm="16" :xs="24">
        <el-card>
          <h2 slot="header">账号恢复</h2>
          <p>账号被删除后可通过管理员在此处操作恢复</p>
          <p>功能完善开发中...</p>
        </el-card>
      </el-col>
      <el-col :lg="6" :md="10" :sm="16" :xs="24">
        <el-card>
          <div slot="header">
            <span style="font-size:1.5rem;font-weight:600">恢复账号提交</span>
            <el-popover trigger="hover">
              <div style="width:12rem">
                <p>新恢复的账号将出现在其原所属单位，并恢复其原来的信息。</p>
                <p>被删除的休假记录也会一并被恢复，如需继续删除休假记录，需手动操作。</p>
              </div>
              <i slot="reference" class="el-icon-info blue--text" />
            </el-popover>
          </div>

          <el-form label-width="5rem">
            <el-alert
              v-if="account.id && account.id.length>5"
              :type="is_removed?'success':'error'"
              style="margin-bottom:1rem"
            >{{ errorinfo }}</el-alert>
            <el-form-item label="账号">
              <el-input v-model="account.id" placeholder="输入已被删除的账号" />
            </el-form-item>
            <el-form-item label="恢复原因">
              <el-input v-model="account.reason" type="textarea" rows="5" />
            </el-form-item>
            <AuthCode v-model="account.auth" />
            <el-button
              v-loading="loading"
              :disabled="!is_removed"
              type="success"
              style="margin-top:1rem;width:100%"
              @click="restore_account"
            >恢复</el-button>
          </el-form>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import { restoreAccount } from '@/api/account'
import { getUserBase } from '@/api/user/userinfo'
import { debounce } from '@/utils'
export default {
  name: 'UserRestore',
  components: { AuthCode: () => import('@/components/AuthCode') },
  data: () => ({
    account: {
      auth: {},
      id: '',
      reason: ''
    },
    loading: false,
    is_removed: true
  }),
  computed: {
    errorinfo() {
      return this.is_removed
        ? '当前账号处于不存在状态，可尝试恢复。'
        : '当前账号存在，不可恢复'
    },
    requireCheck() {
      return debounce(() => {
        this.check()
      }, 300)
    }
  },
  watch: {
    'account.id': {
      handler(val) {
        this.$nextTick(() => {
          this.check()
        })
      }
    }
  },
  methods: {
    restoreAccount,
    check() {
      this.loading = true
      getUserBase(this.account.id, true)
        .then(data => {
          this.is_removed = !data || !data.base || !data.base.cid
        })
        .catch(e => {
          this.is_removed = true
        })
        .finally(() => {
          this.loading = false
        })
    },
    restore_account() {
      this.loading = true
      const data = Object.assign({}, this.account)
      delete data.auth
      const auth = this.account.auth
      restoreAccount({ auth, data })
        .then(() => {
          this.$message.success('已成功恢复')
        })
        .finally(() => {
          this.loading = false
          this.check()
        })
    }
  }
}
</script>

<style lang="scss" scoped>
</style>
