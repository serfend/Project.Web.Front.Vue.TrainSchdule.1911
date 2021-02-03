<template>
  <div>
    <div class="label" :style="{color:showTag?'#fff':'#000'}">{{ label }}</div>
    <slot />
  </div>
</template>

<script>
export default {
  name: 'SingleLineItem',
  props: {
    label: {
      type: String,
      default: null,
    },
    showTag: {
      type: Boolean,
      default: false,
    },
  },
}
</script>
<style lang="scss" scoped>
.label {
  display: inline-block;
  width: 2rem;
  color: #fff;
}
</style>
