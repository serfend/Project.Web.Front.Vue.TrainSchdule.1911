<template>
  <div>
    <Sticky
      v-if="showStickContent"
      :sticky-top="48"
      :class-name="'card-divider-year'"
      :style="{opacity:(now_active_year.length&&now_active_year[now_active_year.length-1]>index)?0:1,transition:'all ease 0.5s','margin-bottom':'0.5rem'}"
      @reset="year_banner_reset()"
      @sticky="year_banner_sticky(index)"
    >{{ data.tag.banner }}</Sticky>
    <div :class="['card-row']">
      <el-tooltip
        :content="data.show?'点击隐藏详情':'点击查看详情'"
        :hide-after="5000"
        :open-delay="1000"
        placement="top-start"
        transition="el-zoom-in-center"
      >
        <div class="single-item">
          <div class="header" style="cursor:pointer" @click="$emit('itemClick')">
            <CardDescription :data="data" :class="['card-description' ,focus?'on-focus':'']" />
          </div>
          <slot
            v-if="data.create"
            name="content"
            :data="data"
            :show="data.show"
            class="single-content"
            @requireRefresh="$emit('requireRefresh',index,data.id)"
          />
        </div>
      </el-tooltip>
    </div>
  </div>
</template>

<script>
export default {
  name: 'ConferenceListSingleItem',
  components: {
    CardDescription: () => import('./CardDescription'),
    Sticky: () => import('@/components/Sticky')
  },
  props: {
    index: { type: Number, default: 0 },
    data: { type: Object, default: null },
    showStickContent: { type: Boolean, default: false },
    focus: { type: Boolean, default: false }
  },
  data: () => ({
    now_active_year: []
  }),
  methods: {
    year_banner_sticky(index) {
      this.now_active_year.push(index)
      console.log(this.now_active_year)
    },
    year_banner_reset() {
      this.now_active_year.pop()
      console.log(this.now_active_year)
    }
  }
}
</script>
<style lang="scss" scoped>
@import '@/styles/common-list';
</style>
