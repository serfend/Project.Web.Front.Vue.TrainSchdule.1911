<template>
  <Container title="安全管理态势" :show-footer="false">
    <Dashboard />
  </Container>
</template>
<script>
export default {
  name: 'SecurityManage',
  components: {
    Container: () => import('@/views/welcome/container'),
    Dashboard: () => import('./dashboard'),
  },
  props: {
  }
}
</script>
