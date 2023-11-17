<template>
  <span>
    <el-tooltip v-if="!showText" :content="description">
      <SvgIcon :icon-class="iconClass" />
    </el-tooltip>
    <span v-else>
      <SvgIcon :icon-class="iconClass" />
      <span>{{ description }}</span>
    </span>
  </span>
</template>

<script>
import transportationType from './types.js'
export default {
  name: 'TransportationType',
  components: { SvgIcon: () => import('@/components/SvgIcon') },
  model: { prop: 'value', event: 'change' },
  props: {
    value: { type: Number, default: 0 },
    showText: { type: Boolean, default: false },
  },
  computed: {
    type() {
      const v = this.value
      return transportationType[v] || transportationType['default']
    },
    description() {
      return this.type[1]
    },
    iconClass() {
      return this.type[0]
    }
  }
}
</script>
