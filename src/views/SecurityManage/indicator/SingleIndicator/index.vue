<template>
  <el-card
    v-loading="!data.range"
    :class="[
      'styled-primary-card',
      inner_focus ? 'focus' : 'un-focus',
      'indicator-card'
    ]"
  >
    <template slot="header">
      <div class="title">
        <span class="content">{{ data.alias }}</span>
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
      <div class="description">{{ description }}</div>
      <div class="range">
        <span
          v-if="data.range"
        >正常范围 {{ data.range[0] }} - {{ data.range[1] }}</span>
        <span>当前值 {{ data.value }}</span>
      </div>
      <div class="warning">{{ data.message }}</div>
    </div>
    <el-dialog :visible.sync="inner_focus" append-to-body>
      <template #title>
        <h2>指标详情：{{ data.alias }}</h2>
      </template>
      <el-form label-width="5rem" style="font-size:2rem">
        <el-form-item label="名称">{{ data.name }}({{ data.alias }})</el-form-item>
        <el-form-item label="说明">{{ data.description }}</el-form-item>
        <el-form-item
          label="正常范围"
        >
          <el-tag type="success">{{ data.range[0] }} - {{ data.range[1] }}</el-tag>
          <el-tag v-for="i,index in data.ranges" :key="index">{{ i.sciMin }} - {{ i.sciMax }}</el-tag>
        </el-form-item>
        <el-form-item label="当前值">{{ data.value }}</el-form-item>
        <el-divider />
        <el-progress
          :percentage="percentage"
          :color="status_color"
          :show-text="false"
        />
        <div v-if="data.message" class="warning-description">
          <div v-for="(i, index) in data.message.split('\n')" :key="index">
            {{ i }}
          </div>
        </div>
      </el-form>
      <WarningList :data="data" />
    </el-dialog>
  </el-card>
</template>
<script>
import { getColorByPercentage } from '@/utils'
export default {
  name: 'SingleIndicator',
  components: {
    WarningList: () => import('./WarningList')
  },
  props: {
    data: { type: Object, required: true },
    focus: { type: Boolean, default: false }
  },
  data: () => ({
    inner_focus: false,
  }),
  computed: {
    is_normal() {
      const { value, range } = this.data
      if (!range) return false
      return value >= range[0] && value <= range[1]
    },
    status_color() {
      return this.getColor(this.percentage)
    },
    percentage() {
      const { range, value } = this.data
      if (!range) return 0
      const v = value - range[0]
      const r = range[1] - range[0]
      if (v < 0) return 0
      if (v >= r) return 100
      return (100 * v) / r
    },
    description () {
      const { data } = this
      const { description } = data
      if (!description) return '无描述'
      if (description.length > 50) return `${description.substring(0, 50)}..`
      return description
    }
  },
  watch: {
    focus: {
      handler(v) {
        this.inner_focus = v
      },
      immediate: true
    },
    inner_focus: {
      handler (v) {
        this.$emit('update:focus', v)
      }
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
.el-card__header{
  padding:0.5rem 1rem;
}
</style>
<style lang="scss" scoped>
@mixin card-focus($color: #ffffff99) {
  background-color: $color !important;
  box-shadow: 0 0 10px #fff;
  cursor: pointer;
}
.warning-description {
  margin: 1rem;
  color:#f00;
}
.warning {
  position: absolute;
  bottom: 0.2rem;
  color: #f00;
  font-weight: 600;
  width: 20rem;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
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
  height: 4.5rem;
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
