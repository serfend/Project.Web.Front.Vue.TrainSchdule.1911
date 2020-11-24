<template>
  <div v-loading="loading">
    <el-form style="margin-bottom:1rem">
      <AuthCode v-model="auth" />
    </el-form>
    <el-card style="margin-top:1rem">
      <span slot="header">单位管理</span>
    </el-card>
    <PermissionManager :user-id="userId" :auth="auth" />
  </div>
</template>

<script>
import AuthCode from '@/components/AuthCode'
import PermissionManager from './PermissionManager'
export default {
  name: 'UserPermission',
  components: { AuthCode, PermissionManager },
  props: {
    userId: {
      type: String,
      default: null,
    },
  },
  data: () => ({
    loading: false,
    auth: {
      authByUserId: '',
      code: '',
    },
  }),
}
</script>

<style lang="scss" scoped>
.custom-tree-node {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 14px;
  padding-right: 8px;
}
</style>
