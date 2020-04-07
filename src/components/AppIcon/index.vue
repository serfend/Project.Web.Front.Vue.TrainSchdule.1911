<template>
  <el-tooltip :content="description">
    <div :style="{ width:size+'px'}">
      <img
        :class="isActive?'icon-buttonactive':'icon-button'"
        :src="icon"
        @click="$emit('click')"
        @mouseenter="activeMe"
        @mouseleave="disactiveMe"
      />
      <div :class="isActive?'icon-labelactive':'icon-label'">{{ label }}</div>
    </div>
  </el-tooltip>
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
      default: '无'
    },
    size: {
      type: Number,
      default: 30
    },
    description: {
      type: String,
      default: '无'
    }
  },
  data() {
    return {
      isActive: false
    }
  },
  methods: {
    activeMe() {
      this.isActive = true
      this.$forceUpdate()
    },
    disactiveMe() {
      this.isActive = false
      this.$forceUpdate()
    }
  }
}
</script>

<style lang="scss" scoped>
.icon-button {
  border-radius: 10%;
  border-color: #000000;
  width: 100%;
  height: 100%;
  transition: all 0.5s;
}
.icon-buttonactive {
  border-radius: 10%;
  border-color: #000000;

  width: 100%;
  height: 100%;
  box-shadow: 3px 3px 6px 3px rgba(0, 0, 0, 0.3);
  transform: translateY(4px);
  transition: all 0.5s;
}
.icon-label {
  font-size: 20px;
  background-color: #000000;
  opacity: 0.8;
  text-align: center;
  color: #ffffff;
  transition: all 0.5s;
}

.icon-labelactive {
  font-size: 20px;
  background-color: #000000;
  opacity: 0.8;
  text-align: center;
  color: #ffffff;
  transform: translateY(4px);
  transform: scale(1.5);
  transition: all 0.5s;
}
</style>
