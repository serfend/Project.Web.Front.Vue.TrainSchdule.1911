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
    descList: ['一季度', '二季度', '三季度', '四季度'],
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
    ratingType: {
      handler(val) {
        this.onChange()
      }
    },
    value: {
      handler(val) {
        this.onChange()
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
    onChange() {
      this.$emit('change', this.value)
      if (!this.value) return this.$emit('update:dateName', null)
      const val = this.ratingCycleDateValue
      let descName = '无效'
      switch (this.ratingType) {
        case 0: {
          break
        }
        // 日
        case 1: {
          break
        }
        // 周
        case 2: {
          break
        }
        // 月
        case 4: {
          descName = `${val.getFullYear()}年${val.getMonth() + 1}月`
          break
        }
        // 季度
        case 8: {
          const s = this.descList.findIndex(i => i === this.ratingCycleDesc) + 1
          descName = `${val.getFullYear()}年${s}季度`
          break
        }
        // 年
        case 16: {
          descName = `${val.getFullYear()}`
          break
        }
      }
      this.$emit('update:dateName', descName)
    },
    // TODO 其他类别的选取
    convertDateToCycle() {
      const v = this.ratingCycleDate
      if (!v) return 0
      switch (this.ratingType) {
        case 0: {
          break
        }
        // 日
        case 1: {
          break
        }
        // 周
        case 2: {
          break
        }
        // 月
        case 4: {
          return (v.getFullYear() - 2000) * 12 + v.getMonth() + 1
        }
        // 季度
        case 8: {
          const y = (v.getFullYear() - 2000) * 4
          const s = this.descList.findIndex(i => i === this.ratingCycleDesc)
          return y + s + 1
        }
        // 年
        case 16: {
          return v.getFullYear() - 2000
        }
      }
    }
  }
}
</script>
