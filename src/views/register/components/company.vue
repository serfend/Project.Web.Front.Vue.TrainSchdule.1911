<template>
  <div>
    <el-form-item prop="company">
      <span class="svg-container">
        <svg-icon icon-class="company" />
      </span>
    </el-form-item>
  </div>
</template>

<script>
export default {
  name: 'Company',
  data() {
    return {
      company: {
        code: 'Root'
      },
      duties: {
        name: '干事'
      }
    }
  }
}
</script>

<style>
</style>
