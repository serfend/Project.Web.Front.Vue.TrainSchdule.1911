<template>
  <Container title="安全管理态势">
    <Dashboard />
  </Container>
</template>
<script>
export default {
  name: 'SecurityManage',
  components: {
    Container: () => import('@/views/welcome/container'),
    Dashboard: () => import('./dashboard'),
  }
}
</script>
