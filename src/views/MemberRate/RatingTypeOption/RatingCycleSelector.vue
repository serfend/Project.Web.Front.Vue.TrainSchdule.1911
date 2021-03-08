<template>
  <span>
    <span v-if="ratingType==8">
      <el-date-picker v-model="ratingCycleDate" type="year" />
      <el-radio-group v-model="ratingCycleDesc" @change="onChange">
        <el-radio-button v-for="(i,index) in descList" :key="index" :label="i" />
      </el-radio-group>
    </span>
    <el-date-picker v-else v-model="ratingCycleDate" :type="ratingTypeDict[ratingType][2]" />
    <span v-if="value" style="color:#eee">{{ value }}期</span>
  </span>
</template>

<script>
import { ratingTypeDict } from '../setting'
import {
  descList,
  dateValueToCycleCount,
  dateValueToCycleDesc
} from './converter'
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
    dateName: {
      type: String,
      default: null
    },
    ratingType: {
      type: Number,
      default: 0
    }
  },
  data: () => ({
    value: 0,
    ratingCycleDateValue: null,
    ratingCycleDesc: null,
    descList,
    ratingTypeDict
  }),
  computed: {
    ratingCycleDate: {
      get() {
        return this.ratingCycleDateValue
      },
      set(v) {
        this.ratingCycleDateValue = v
        this.onChange()
      }
    }
  },
  watch: {
    ratingType: {
      handler(val) {
        this.onChange()
      }
    },
    v: {
      handler(val) {
        this.value = val
        this.onChange()
      },
      immediate: true
    }
  },
  methods: {
    onChange() {
      const v = this.ratingCycleDateValue
      const { ratingType, ratingCycleDesc } = this
      this.value = dateValueToCycleCount(ratingType, v, ratingCycleDesc)
      this.$emit('change', this.value)
      if (!this.value) return this.$emit('update:dateName', null)
      const descName = dateValueToCycleDesc(ratingType, v, ratingCycleDesc)
      this.$emit('update:dateName', descName)
    }
  }
}
</script>
