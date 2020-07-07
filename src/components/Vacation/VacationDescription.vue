<template>
  <el-tooltip effect="light">
    <VacationDescriptionContent slot="content" :users-vacation="usersVacation" />
    <el-progress :percentage="percent" :color="getColor(percent)" />
  </el-tooltip>
</template>

<script>
const red = [245, 108, 108]
const green = [103, 194, 58]
import { rgbToHex } from '@/utils'
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
  computed: {
    percent() {
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
  },
  methods: {
    getColor(percent) {
      percent = percent / 100
      let r = (1 - percent) * red[0] + percent * green[0]
      let g = (1 - percent) * red[1] + percent * green[1]
      let b = (1 - percent) * red[2] + percent * green[2]
      r = Math.floor(r)
      g = Math.floor(g)
      b = Math.floor(b)
      const c = rgbToHex(`rgba(${r},${g},${b},255)`)
      return c
    }
  }
}
</script>
