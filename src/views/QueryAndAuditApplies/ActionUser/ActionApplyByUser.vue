<template>
  <el-collapse>
    <el-collapse-item :title="sensitiveAction" :disabled="innerIsOnlyToShowRecallMsg">
      <AuthCode :form.sync="auditForm.auth" :auth-check-method="checkAuthCode" />
    </el-collapse-item>
  </el-collapse>
</template>

<script>
export default {

}
</script>

<style>

</style>