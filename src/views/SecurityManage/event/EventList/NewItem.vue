<template>
  <div class="center-align">
    <div class="card-title title-second">新增</div>
    <div class="card-description to-add" @click="$emit('click')">
      <div class="center">
        <SvgIcon icon-class="add" style-normal="padding: 0.5rem;font-size: 4rem;color: #fff;" />
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'ConferenceListNewItem',
  components: {
    SvgIcon: () => import('@/components/SvgIcon')
  }
}
</script>
<style lang="scss" scoped>
@import '@/styles/common-list';
.center-align {
  display: flex;
}
.title-second {
  color: #333;
  font-size: 1.5rem;
}
.to-add {
  cursor: pointer;
  &:hover {
    opacity: 0.8;
  }
}
.center {
  background: #ccc;
  width: 4rem;
  height: 4rem;
  text-align: center;
}
.card-description {
  display: inline-block;
  .card-summary-description {
    margin-bottom: 0.3rem;
    color: #aaa;
  }
}
</style>
