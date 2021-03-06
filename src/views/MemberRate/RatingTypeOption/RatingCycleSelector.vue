<template>
  <span>
    <el-radio-group v-if="ratingType==8" v-model="ratingCycleDate">
      <el-radio-button label="一季度" />
      <el-radio-button label="二季度" />
      <el-radio-button label="三季度" />
      <el-radio-button label="四季度" />
    </el-radio-group>
    <el-date-picker v-else v-model="ratingCycleDate" :type="ratingTypeDict[ratingType][2]" />
    <span v-if="value" style="color:#eee">{{ value }}期</span>
  </span>
</template>

<script>
import { ratingTypeDict } from '../setting'
export default {
  name: 'RatingCycleSelector',
  model: {
    prop: 'v',
    event: 'change'
  },
  props: {
    v: {
      type: Number,
      default: 0
    },
    ratingType: {
      type: Number,
      default: 0
    }
  },
  data: () => ({
    value: 0,
    ratingCycleDateValue: null,
    ratingTypeDict
  }),
  computed: {
    ratingCycleDate: {
      get() {
        return this.ratingCycleDateValue
      },
      set(v) {
        this.ratingCycleDateValue = v
        this.value = this.convertDateToCycle()
      }
    }
  },
  watch: {
    value: {
      handler(val) {
        this.$emit('change', val)
      }
    },
    v: {
      handler(val) {
        this.value = val
      },
      immediate: true
    }
  },
  methods: {
    // TODO 其他类别的选取
    convertDateToCycle() {
      const v = this.ratingCycleDate
      if (!v) return 0
      switch (this.ratingType) {
        case 4: {
          return (v.getFullYear() - 2000) * 12 + v.getMonth() + 1
        }
      }
    }
  }
}
</script>
