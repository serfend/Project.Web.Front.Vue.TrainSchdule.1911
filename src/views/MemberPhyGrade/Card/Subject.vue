<template>
  <div v-if="data">
    <el-table :data="[scorePair]">
      <el-table-column v-for="(p,i) in scorePair" :key="i" :label="p[0]?p[0]:null">
        <template slot-scope="scope">
          <span
            :style="{color:scope.row[i][1]==currentStandard.baseStandard?'#88f':'#ccc'}"
          >{{ scope.row[i][1] }}</span>
        </template>
      </el-table-column>
    </el-table>
    <el-form label-width="5rem">
      <el-form-item label="成绩">
        <el-input v-model="rawValue" :placeholder="`${data.alias}成绩`" />
      </el-form-item>
    </el-form>
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
    }
  },
  data: () => ({
    rawValue: ''
  }),
  computed: {
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
        this.rawValue = this.standardRawValue
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
  }
}
</script>

<style>
</style>
