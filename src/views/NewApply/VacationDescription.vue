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
      if (this.usersVacation.yearlyLength === 0) return 100
      var fn = parseInt
      var result = Math.floor(
        100 *
        ((fn(this.usersVacation.yearlyLength) -
          fn(this.usersVacation.leftLength) +
          fn(this.thisTimeVacationLength)) /
          fn(this.usersVacation.yearlyLength))
      )
      if (result < 0) result = 0
      if (result > 100) result = 100
      return result
    }
  }
}
</script>
