<template>
  <el-card
    :class="[
      'styled-primary-card',
      inner_focus ? 'focus' : 'un-focus',
      'indicator-card'
    ]"
  >
    <template slot="header">
      <div class="title">
        <span class="content">{{ data.name }}</span>
        <el-tag
          v-if="is_normal"
          class="status"
          type="success"
          effect="dark"
        >正常</el-tag>
        <el-tag v-else class="status" type="danger" effect="dark">异常</el-tag>
      </div>
    </template>
    <div class="content">
      <el-progress
        :percentage="percentage"
        :color="status_color"
        :show-text="false"
      />
      <div class="description">{{ data.description || "无描述" }}</div>
      <div class="range">
        <span>正常范围 {{ data.range[0] }} - {{ data.range[1] }}</span>
        <span>当前值 {{ data.value }}</span>
      </div>
    </div>
  </el-card>
</template>
<script>
import { getColorByPercentage } from '@/utils'
export default {
  name: 'SingleIndicator',
  components: {},
  props: {
    data: { type: Object, required: true },
    focus: { type: Boolean, default: false }
  },
  data: () => ({
    inner_focus: false
  }),
  computed: {
    is_normal() {
      const { value, range } = this.data
      return value >= range[0] && value <= range[1]
    },
    status_color() {
      return this.getColor(this.percentage)
    },
    percentage() {
      const { range, value } = this.data
      const v = value - range[0]
      const r = range[1] - range[0]
      if (v < 0) return 0
      if (v > r) return 100
      return (100 * v) / r
    }
  },
  watch: {
    focus: {
      handler(v) {
        this.inner_focus = v
      },
      immediate: true
    }
  },
  methods: {
    getColor: v =>
      getColorByPercentage(100 - 2 * Math.abs(v - 50), [255, 0, 0], [0, 255, 0])
  }
}
</script>
<style lang="scss">
@import "../../style";
</style>
<style lang="scss" scoped>
@mixin card-focus($color: #ffffff99) {
  background-color: $color !important;
  box-shadow: 0 0 10px #fff;
  cursor: pointer;
}
.indicator-card {
  width: 22rem;
  transition-duration: 0.5s;
  transition-timing-function: ease;
  transition-property: background-color, box-shadow;
}
.focus {
  @include card-focus();
}
.un-focus {
  &:hover {
    @include card-focus(#ffffff22);
  }
}
.title {
  .status {
    float: right;
  }
  .content {
    font-size: 1.5rem;
  }
}
.content {
  height: 4rem;
  .range {
    display: flex;
    justify-content: space-between;
    font-size: 1.1rem;
  }
  .description {
    color: rgb(31, 180, 17);
    font-size: 0.9rem;
  }
}
</style>
