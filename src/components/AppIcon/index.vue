<template>
  <div @click="location.href=href" :style="{ width:size+'px'}">
    <el-avatar class="icon-button" shape="square" :size="size" :src="icon" />
    <div class="icon-label">{{ label }}</div>
  </div>
</template>

<script>
export default {
  name: 'AppIcon',
  props: {
    icon: {
      type: String,
      default: ''
    },
    label: {
      type: String,
      default: ''
    },
    href: {
      type: String,
      default: ''
    },
    size: {
      type: Number,
      default: 30
    }
  }
}
</script>

<style lang="scss" scoped>
.icon-button {
  border-radius: 10%;
  box-shadow: 3px 3px 6px 3px rgba(0, 0, 0, 0.3);
}
.icon-label {
  font-size: 20px;
  background-color: #000000;
  opacity: 0.8;
  text-align: center;
  color: #ffffff;
}
</style>
