<template>
  <div class="container">
    <div v-if="company" style="position:absolute;width:100%">
      <div class="statistics-title">
        <span class="content">{{ company.name }}休假情况统计</span>
      </div>
    </div>
  </div>
</template>

<script>
import { getUserCompany } from '@/api/userinfo'
export default {
  name: 'Statistics',
  data: () => ({
    company: null
  }),
  mounted() {
    getUserCompany().then((data) => {
      this.company = data.company
    })
  }
}
</script>

<style lang="scss" scoped>
@import './style/index.scss';
</style>
