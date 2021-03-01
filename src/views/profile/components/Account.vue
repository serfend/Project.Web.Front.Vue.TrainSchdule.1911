<template>
  <div>
    <Loading />
  </div>
</template>

<script>
export default {
  name: 'ProfileAccount',
  components: {
    Loading: () => import('@/views/Loading')
  },
  props: {
    user: {
      type: Object,
      default: () => {
        return {
          name: '',
          email: ''
        }
      }
    }
  },
  methods: {
    submit() {
      this.$message({
        message: '功能被禁用，修改数据失败',
        type: 'warning',
        duration: 5 * 1000
      })
    }
  }
}
</script>
