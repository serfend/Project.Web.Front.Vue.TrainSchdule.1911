<template>
  <div class="alert-container" :style="{ height: `${width * 2}rem` }">
    <div
      :class="[`alert-stripe-${direction?'left':'right'}`]"
      :style="{
        top: `${width * 0.5}rem`,
        height: `${width}rem`,
        'background-size': `${width * 3}rem ${width * 3}rem`
      }"
    />
  </div>
</template>
<script>
export default {
  name: 'AlertStripe',
  props: {
    width: { type: Number, default: 1 },
    direction: { type: Boolean, default: false }
  }
}
</script>

<style lang="scss" scoped>
.alert-container {
  overflow-x: hidden;
  width: 100%;
}
@mixin alert-stripe-body() {
  position: relative;
  width: 400%;
  filter: drop-shadow(0 0 0.2rem #fff);
}
.alert-stripe-left {
  background: linear-gradient(
    -45deg,
    #ffed49 30%,
    transparent 30%,
    transparent 50%,
    #ffed49 50%,
    #ffed49 80%,
    transparent 80%,
    transparent
  );
  animation: move-smooth-left 5s linear none infinite;
  @include alert-stripe-body;
}
.alert-stripe-right {
  background: linear-gradient(
    45deg,
    #ffed49 30%,
    transparent 30%,
    transparent 50%,
    #ffed49 50%,
    #ffed49 80%,
    transparent 80%,
    transparent
  );
  animation: move-smooth-right 5s linear none infinite;
  @include alert-stripe-body;
}
@keyframes move-smooth-left {
  0% {
    left: 0;
  }
  100% {
    left: -12rem;
  }
}
@keyframes move-smooth-right {
  0% {
    left: -12rem;
  }
  100% {
    left: 0;
  }
}
</style>
