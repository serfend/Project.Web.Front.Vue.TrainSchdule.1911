<template>
  <el-popover trigger="click">
    <el-alert type="error" :closable="false">不允许仅休部分法定节假日</el-alert>
    <div>{{ name }}:{{ description }}</div>
    <div>共 {{ maxLength }} 天</div>
    <el-slider
      v-model="length"
      disabled
      show-stops
      :max="maxLength"
      :min="0"
      :format-tooltip="formatTooltip"
    />
    <el-tag slot="reference" style="cursor:pointer">{{ name }} {{ length }} 天</el-tag>
  </el-popover>
</template>

<script>
import { parseTime } from '@/utils'
export default {
  name: 'LawVacation',
  model: {
    prop: 'useLength',
    event: 'change'
  },
  props: {
    useLength: {
      type: Number,
      default: 0
    },
    maxLength: {
      type: Number,
      default: 0
    },
    name: {
      type: String,
      default: '无名称'
    },
    description: {
      type: String,
      default: null
    },
    start: {
      type: String,
      default: null
    }
  },
  data: () => ({
    lengthRange: null
  }),
  computed: {
    length: {
      get() {
        return this.useLength
      },
      set(val) {
        // 2 day in calendar should be 1 day in length
        this.$emit('change', val)
      }
    }
  },
  methods: {
    parseTime(val) {
      return parseTime(val, '{y}年{m}月{d}日')
    },
    formatTooltip(val) {
      return `${val}天`
      // const end = val * 86400000 + (new Date(this.start) - 0)
      // return this.parseTime(new Date(end))
    }
  }
}
</script>

<style>
</style>
