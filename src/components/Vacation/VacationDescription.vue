<template>
  <div>
    <el-tooltip v-if="directShow" effect="light">
      <template #content>
        <VacationDescriptionContent
          :userid="userid"
          :users-vacation.sync="innerUserVacation"
          :loading-result.sync="loading_result"
        />
      </template>
      <div :class="[isCircle?'progress-handler':'']">
        <el-progress
          :percentage="percent"
          :stroke-width="10"
          :color="getColor(percent)"
          :type="graphType"
          :format="format"
        />
      </div>
    </el-tooltip>
    <VacationDescriptionContent
      v-else
      :users-vacation.sync="innerUserVacation"
      :userid="userid"
      :loading-result.sync="loading_result"
    />
  </div>
</template>

<script>
const red = [245, 108, 108]
const green = [103, 194, 58]
import { getColorByPercentage } from '@/utils'
export default {
  name: 'VacationDescription',
  components: {
    VacationDescriptionContent: () => import('./VacationDescriptionContent')
  },
  props: {
    usersVacation: { type: Object, default: () => ({}) },
    thisTimeVacationLength: { type: Number, default: 0 },
    directShow: { type: Boolean, default: true },
    loadingResult: { type: String, default: null },
    userid: { type: String, default: null },
    graphType: { type: String, default: 'line' },
    title: { type: String, default: '休假率' }
  },
  data: () => ({
    innerUserVacation: {},
    innerLoadingResult: null
  }),
  computed: {
    loading_result: {
      get() {
        return this.innerLoadingResult
      },
      set(val) {
        this.innerLoadingResult = val
        this.$emit('update:loadingResult', val)
      }
    },
    isCircle() {
      return this.graphType === 'circle'
    },
    percent() {
      var uv = this.innerUserVacation
      if (!uv.yearlyLength) return 100
      const vl = this.thisTimeVacationLength
      var fn = parseInt
      const spendLength = fn(uv.yearlyLength) - fn(uv.leftLength) + fn(vl)
      var result = Math.floor(100 * (spendLength / fn(uv.yearlyLength)))
      if (result < 0) result = 0
      if (result > 100) result = 100
      return result
    }
  },
  watch: {
    loadingResult: {
      handler(val) {
        this.innerLoadingResult = val
      },
      immediate: true
    },
    usersVacation: {
      handler(val) {
        this.innerUserVacation = val
      },
      deep: true,
      immediate: true
    }
  },
  methods: {
    format() {
      const { title, percent, isCircle } = this
      if (!isCircle) return `${percent}%`
      return `${title}:${percent}%`
    },
    getColor: v => getColorByPercentage(v, red, green)
  }
}
</script>
<style lang="scss">
.progress-handler {
  display: flex;
  justify-content: center;
  .el-progress-circle {
    height: 23rem !important;
    width: 23rem !important;
  }
}
</style>
