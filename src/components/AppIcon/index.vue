<template>
  <el-tooltip placement="top" effect="light" :content="description">
    <div :style="{ width:size+'px',height:size+'px'}">
      <el-image
        v-if="icon"
        :class="isActive?'icon-buttonactive':'icon-button'"
        :src="icon"
        @click="$emit('click')"
        @mouseenter="activeMe"
        @mouseleave="disactiveMe"
      />
      <svg-icon
        v-if="svg"
        :icon-class="svg"
        :class="isActive?'icon-buttonactive':'icon-button'"
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
    svg: {
      type: String,
      default: ''
    },
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
  color: #3f3fff;
  background-color: #ffffff;
  opacity: 0.7;
  width: 100%;
  height: 100%;
  box-shadow: 1px 1px 1px 1px rgba(0, 0, 0, 1);
  transition: all 0.5s;
}
.icon-buttonactive {
  border-radius: 10%;
  color: #00009f;
  background-color: #8f8fef;
  opacity: 1;
  width: 100%;
  height: 100%;
  box-shadow: 3px 3px 6px 3px rgba(0, 0, 0, 0.3);
  transform: translateY(4px);
  transition: all 0.2s;
  cursor: pointer;
}
.icon-label {
  border-radius: 5px;
  font-size: 20px;
  background-color: #00009f;
  opacity: 0.8;
  text-align: center;
  color: #ffffff;
  transition: all 0.5s;
  box-shadow: 2px 2px 1px 1px rgba(0, 0, 0, 0.7);
  margin: 20px 0;
}

.icon-labelactive {
  border-radius: 5px;
  font-size: 20px;
  background-color: #0000ff;
  opacity: 0.8;
  text-align: center;
  color: #ffffff;
  transform: translateY(4px);
  transform: scale(1.5);
  transition: all 0.5s;
}
</style>
