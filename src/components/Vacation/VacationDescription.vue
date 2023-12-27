<template>
  <div>
    <el-tooltip v-if="directShow" effect="light">
      <template #content>
        <VacationDescriptionContent
          :userid="userid"
          :users-vacation.sync="innerUserVacation"
          :loading-result.sync="loading_result"
          :vacation-year="nowSelectYear"
        />
      </template>
      <div :class="[isCircle ? 'progress-handler' : '', 'flex']">
        <el-dropdown
          v-if="showYearSelector"
          trigger="click"
          class="drop-menu"
          @command="handleCommand"
        >
          <span class="el-dropdown-link">
            {{ nowSelectYear }}<i class="el-icon-arrow-down" />
          </span>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item
              v-for="y in yearRange"
              :key="y"
              :command="y"
              :class="[
                'drop-menu-item',
                nowSelectYear === y ? 'year-focus' : 'year-normal'
              ]"
            >{{ y }}</el-dropdown-item>
            <el-dropdown-item divided>
              <el-button
                type="text"
                icon="el-icon-arrow-down"
                @click.stop="onSwitch(-10)"
              >更早</el-button>
              <el-button
                type="text"
                icon="el-icon-arrow-up"
                @click.stop="onSwitch(10)"
              >更晚</el-button>
            </el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
        <div class="full-width">
          <el-progress
            :percentage="percent"
            :stroke-width="isCircle ? 10 : 5"
            :color="getColor(percent)"
            :type="graphType"
            :format="format"
            class="full-width"
          />
        </div>
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
const currentYear = new Date().getFullYear()
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
    title: { type: String, default: '休假率' },
    showYearSelector: { type: Boolean, default: true },
    yearSelect: { type: Number, default: null }
  },
  data: () => ({
    innerUserVacation: {},
    innerLoadingResult: null,
    nowFocusYear: currentYear,
    nowSelectYear: currentYear
  }),
  computed: {
    yearRange() {
      const { nowFocusYear } = this
      const targetMax = nowFocusYear + 3
      const allowMax = currentYear + 1
      const max = targetMax > allowMax ? allowMax : nowFocusYear + 3
      const result = new Array(6).fill(0).map((x, index) => max - index)
      return result
    },
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
    },
    yearSelect: {
      handler(v) {
        this.nowSelectYear = v
      }
    }
  },
  methods: {
    handleCommand(x) {
      this.nowSelectYear = x
      this.$emit('update:yearSelect', x)
    },
    onSwitch(delta) {
      this.nowFocusYear += delta
    },
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
.full-width {
  width: 100%;
}
.drop-menu {
  cursor: pointer;
  width: 4rem;
}
.flex {
  display: flex;
}
.drop-menu-item {
  text-align: center;
}
.year-focus {
  color: #409eff;
}
.progress-handler {
  display: flex;
  justify-content: center;
  .el-progress-circle {
    height: 23rem !important;
    width: 23rem !important;
  }
}
</style>
