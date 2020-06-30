<template>
  <div>
    <el-input v-model="rawScore" placeholder="输入成绩" />
    <el-slider
      v-if="data"
      v-model="nowIndex"
      :min="0"
      :max="scorePair.length"
      :format-tooltip="format"
    />
  </div>
</template>

<script>
export default {
  name: 'SinglePhySubject',
  model: {
    prop: 'data',
    event: 'change'
  },
  props: {
    data: {
      type: Object,
      default: null
    },
    age: {
      type: Number,
      default: 0
    },
    rawValue: {
      type: String,
      default: null
    }
  },
  data: () => ({
    nowIndex: 0
  }),
  computed: {
    rawScore: {
      get() {
        return this.rawValue
      },
      set(val) {
        this.$emit('update:rawValue', val)
      }
    },
    currentStandard() {
      const age = this.age
      const standards = this.data.standards
      if (!standards) return null
      for (let i = 0; i < standards.length; i++) {
        const s = standards[i]
        if (s.maxAge >= age && s.minAge <= age) return s
      }
      return null
    },
    scorePair() {
      const s = this.currentStandard
      if (!s) return null
      const list = s.gradePairs
        .split('|')
        .map(i => i.split(':'))
        .sort((a, b) => a[1] - b[1])
      list.push(['满分后', this.currentStandard.expressionWhenFullGrade])
      return list
    },
    standardRawValue() {
      const c = this.currentStandard
      if (!c) return null
      const s = this.scorePair
      if (!s) return null
      const base = c.baseStandard.toString()
      const r = s.filter(i => i[1] && i[1] === base)
      if (r.length === 0) return s[0][0]
      return r[0][0]
    }
  },
  watch: {
    data: {
      handler(val) {
        this.rawScore = this.standardRawValue
      },
      immediate: true
    },
    rawValue: {
      handler(val) {
        this.$emit('update:data', Object.assign(this.data, { rawValue: val }))
        this.$nextTick(() => {
          this.$emit('gradechange', val)
        })
      },
      immediate: true
    }
  },
  methods: {
    format(val) {
      const item = this.scorePair[val]
      return `标准:${item[0]} 得分:${item[1]}`
    }
  }
}
</script>

<style>
</style>
