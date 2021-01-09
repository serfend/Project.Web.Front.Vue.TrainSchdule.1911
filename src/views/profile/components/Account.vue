<template>
  <div>建设中</div>
</template>

<script>
export default {
  props: {
    user: {
      type: Object,
      default: () => {
        return {
          name: '',
          email: '',
        }
      },
    },
  },
  methods: {
    submit() {
      this.$message({
        message: '功能被禁用，修改数据失败',
        type: 'warning',
        duration: 5 * 1000,
      })
    },
  },
}
</script>
