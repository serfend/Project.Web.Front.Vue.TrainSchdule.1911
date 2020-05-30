<template>
  <el-tooltip effect="light">
    <VacationDescriptionContent slot="content" :users-vacation="usersVacation" />
    <el-progress :percentage="caculatevacationPercentage()" />
  </el-tooltip>
</template>

<script>
import VacationDescriptionContent from './VacationDescriptionContent'
export default {
  name: 'VacationDescription',
  components: {
    VacationDescriptionContent
  },
  props: {
    usersVacation: {
      type: Object,
      default() {
        return {}
      }
    },
    thisTimeVacationLength: {
      type: Number,
      default: 0
    }
  },
  methods: {
    caculatevacationPercentage() {
      if (!this.usersVacation.yearlyLength) return 100
      var uv = this.usersVacation
      const vl = this.thisTimeVacationLength
      var fn = parseInt
      const spendLength = fn(uv.yearlyLength) - fn(uv.leftLength) + fn(vl)
      var result = Math.floor(100 * (spendLength / fn(uv.yearlyLength)))
      if (result < 0) result = 0
      if (result > 100) result = 100
      return result
    }
  }
}
</script>
