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
            <el-form-item label="账号">
              <el-input v-model="account.id" placeholder="输入已被删除的账号" />
            </el-form-item>
            <el-form-item label="恢复原因">
              <el-input v-model="account.reason" type="textarea" rows="5" />
            </el-form-item>
            <AuthCode v-model="account.auth" />
            <el-button type="success" style="margin-top:1rem;width:100%" @click="restore_account">恢复</el-button>
          </el-form>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import { restoreAccount } from '@/api/account'

export default {
  name: 'UserRestore',
  components: { AuthCode: () => import('@/components/AuthCode') },
  data: () => ({
    account: {
      auth: {},
      id: '',
      reason: ''
    }
  }),
  methods: {
    restoreAccount,
    restore_account() {
      restoreAccount(this.account).then(() => {
        this.$message.success('已成功恢复')
      })
    }
  }
}
</script>

<style lang="scss" scoped>
</style>
