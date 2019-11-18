<template>
  <div class="dashboard-container">
    <component :is="currentRole" />
  </div>
</template>

<script>
import adminDashboard from './admin'

export default {
  name: 'Dashboard',
  components: { adminDashboard },
  data() {
    return {
      currentRole: 'adminDashboard'
    }
  },
  created() {
    // if (!this.roles.includes('admin')) {
    this.currentRole = 'adminDashboard'
    // }
  }
}
</script>
