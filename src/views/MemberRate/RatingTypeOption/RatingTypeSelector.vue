<template>
  <el-radio-group v-model="value">
    <el-tooltip
      v-for="i in Object.keys(ratingType)"
      :key="i"
      :disabled="!ratingType[i][1]"
      content="未开放此类评比"
    >
      <el-radio-button :label="i" :disabled="ratingType[i][1]">{{ ratingType[i][0] }}</el-radio-button>
    </el-tooltip>
  </el-radio-group>
</template>

<script>
import { ratingTypeDict } from '../setting'
export default {
  name: 'RatingTypeSelector',
  model: {
    prop: 'v',
    event: 'change'
  },
  props: {
    v: {
      type: Number,
      default: 0
    }
  },
  data: () => ({
    value: 0,
    ratingType: ratingTypeDict
  }),
  watch: {
    value: {
      handler(val) {
        this.$emit('change', Number(val))
      }
    },
    v: {
      handler(val) {
        this.value = val
      },
      immediate: true
    }
  }
}
</script>
