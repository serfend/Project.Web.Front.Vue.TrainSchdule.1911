<template>
  <div v-loading="loading">
    <VacationDescription
      :userid="userid"
      :this-time-vacation-length="0"
      :loading-result.sync="loading_result"
      :graph-type="graphType"
    />
  </div>
</template>

<script>
import VacationDescription from '@/components/Vacation/VacationDescription'
export default {
  name: 'ApplyOverview',
  components: { VacationDescription },
  props: {
    userid: { type: String, default: null },
    graphType: { type: String, default: 'line' },
  },
  data() {
    return {
      loading: false,
      loading_result: null
    }
  },
  watch: {}
}
</script>

<style>
</style>
