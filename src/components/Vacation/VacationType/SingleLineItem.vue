<template>
  <div>
    <div class="label">{{ label }}</div>
    <slot />
  </div>
</template>

<script>
export default {
  name: 'SingleLineItem',
  props: {
    label: {
      type: String,
      default: null
    }
  }
}
</script>
<style lang="scss" scoped>
.label {
  display: inline-block;
  width: 2rem;
  color: #fff;
}
</style>
