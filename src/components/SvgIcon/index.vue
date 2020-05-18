<template>
  <span :class="text?'svgLink':''" @click="$emit('click')">
    <svg :class="svgClass" :style="styleNormal" aria-hidden="true" v-on="$listeners">
      <use :xlink:href="iconName" />
    </svg>
    <span v-if="text">{{ text }}</span>
  </span>
</template>

<script>
export default {
  name: 'SvgIcon',
  props: {
    iconClass: {
      type: String,
      required: true
    },
    className: {
      type: String,
      default: ''
    },
    styleNormal: {
      type: String,
      default: ''
    },
    text: {
      type: String,
      default: null
    }
  },
  computed: {
    iconName() {
      return `#icon-${this.iconClass}`
    },
    svgClass() {
      if (this.className) {
        return 'svg-icon ' + this.className
      } else {
        return 'svg-icon'
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.svg-icon {
  vertical-align: -0.15em;
  fill: currentColor;
  width: 1em;
  height: 1em;
}
.svgLink {
  cursor: pointer;
  transition: all 0.5s;
  &:hover {
    color: #25f;
  }
}
</style>
