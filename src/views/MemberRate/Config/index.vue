<template>
  <div>
    <el-form>
      <AuthCode :form.sync="form.auth" />
    </el-form>
  </div>
</template>

<script>
import AuthCode from '@/components/AuthCode'
export default {
  name: 'MemberRateConfig',
  components: { AuthCode },
  data: () => ({
    form: {
      auth: {
        authByUserName: '',
        code: ''
      }
    }
  })
}
</script>

<style>
</style>
