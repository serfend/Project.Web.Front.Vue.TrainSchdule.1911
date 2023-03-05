<template>
  <div
    :class="['btn', flashing ? 'btn-flashing' : '']"
    :style="{
      '--theme-color': theme_color,
      '--background-color': background
    }"
    @click="$emit('click')"
  >
    <slot />
  </div>
</template>
<script>
import variables from '@/styles/element-variables.scss'
export default {
  name: 'CyberBtn',
  props: {
    color: { type: String, default: 'success' },
    background: { type: String, default: '#060545' },
    flashing: { type: Boolean, default: true }
  },
  computed: {
    theme_color() {
      const { color } = this
      if (variables[color]) return variables[color]
      return color
    }
  }
}
</script>
<style lang="scss" scoped>
@import "@/styles/element-variables";
@keyframes rotate {
  100% {
    transform: translate(-50%, -50%) rotate(1turn);
  }
}
@property --theme-color {
  syntax: "color";
  inherits: false;
  initial-value: $--color-primary;
}
@property --background-color {
  syntax: "color";
  inherits: false;
  initial-value: #ccc;
}
.btn-flashing {
  animation: flashing 0.5s linear infinite;
}
.btn {
  border-radius: 0.5rem;

  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;

  z-index: 0;
  color: var(--theme-color);
  font-size: 1.6rem;
  width: 8rem;
  height: 3rem;
  line-height: 3rem;
  padding: 0.5rem;

  margin: auto;
  overflow: hidden;
  cursor: pointer;
  transition: 0.3s;
  box-shadow: 0 0 1px var(--theme-color), 0 0 5px var(--theme-color);
  text-shadow: none;
  &:hover {
    color: #ffffff;
    box-shadow: 0 0 5px var(--theme-color), 0 0 25px var(--theme-color);

    &::after,
    &::before {
      background-color: var(--theme-color);
    }
  }

  &::before {
    transition: 0.3s;
    content: "";
    position: absolute;
    z-index: -2;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    width: 150%;
    height: 300%;
    background-color: var(--background-color);
    background-repeat: no-repeat;
    background-size: 50% 50%;
    background-position: 0 0;
    background-image: conic-gradient(var(--theme-color), var(--theme-color));
    animation: rotate 2s linear infinite;
    box-shadow: 0 0 0.2rem #ffffff;
  }

  &::after {
    content: "";
    position: absolute;
    z-index: -1;
    left: 2px;
    top: 2px;
    width: calc(100% - 4px);
    height: calc(100% - 4px);
    background: var(--background-color);
    border-radius: 0.5rem;
  }
}

@keyframes flashing {
  0% {
    box-shadow: 0 0 1px var(--theme-color), 0 0 5px var(--theme-color);
  }
  100% {
    box-shadow: 0 0 1px var(--theme-color);
  }
}
</style>
