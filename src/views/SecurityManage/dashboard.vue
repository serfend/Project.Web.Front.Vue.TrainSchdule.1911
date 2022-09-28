<template>
  <History />
</template>
<script>
export default {
  name: 'SecurityManageDashboard',
  components: {
    History: () => import('./history')
  }
}
</script>
