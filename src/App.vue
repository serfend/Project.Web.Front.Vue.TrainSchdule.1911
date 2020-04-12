<template>
  <div id="app">
    <router-view />
  </div>
</template>

<script>
export default {
  name: 'App',
  mounted() {
    this.$notify.info('按住Ctrl+鼠标滚轮可以缩放哦~')
  }
}
</script>
