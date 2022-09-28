<template>
  <div class="big-screen-limitation" :style="{height}">
    <el-row :gutter="20" class="row">
      <el-col :span="12" :style="{height:`${size*55}rem`}">
        <EventList :size="size" title="安全保密警钟长鸣" database="security_event" />
      </el-col>
      <el-col :span="12" :style="{height:`${size*55}rem`}">
        <EventList :size="size" title="学习先进积极前行" database="best_event" />
      </el-col>
    </el-row>
  </div>
</template>
<script>
export default {
  name: 'SecurityManage',
  components: {
    EventList: () => import('../event/EventList')
  },
  props: {
    height: { type: String, default: '1080px' },
    size: { type: Number, default: 1 }
  }
}
</script>
<style lang="scss" scoped>
@import "../style";

.big-screen-limitation {
  overflow: hidden;
  @include common();
}
</style>
