<template>
  <div id="container" class="container">
    <Header :title="title" :style="{height:isActive?'5rem':0,transition:'all ease 0.5s'}">
      <template #setting>
        <slot v-if="slots.setting" name="setting" />
        <el-form v-else>
          <el-form-item label="配置">
            <span />
          </el-form-item>
        </el-form>
      </template>
    </Header>
    <div class="container-bg">
      <Breadcrumb style="margin-left:2rem;margin-top:-0.5rem;position:absolute" />
      <slot />
    </div>
    <Footer />
  </div>
</template>

<script>
export default {
  name: 'DashboardContainer',
  components: {
    Header: () => import('@/views/welcome/Header'),
    Footer: () => import('@/views/welcome/Footer'),
    Breadcrumb: () => import('@/components/Breadcrumb'),
  },
  props: {
    title: { type: String, default: null }
  },
  data: () => ({
    isActive: false,
    wattingHide: null
  }),
  mounted () {
    window.addEventListener('mousemove', this.callback)
  },
  destroyed() {
    window.removeEventListener('mousemove', this.callback)
  },
  methods: {
    callback(e) {
      const should_hide = e.clientY > 50
      if (this.isActive && should_hide) {
        if (!this.wattingHide) {
          this.wattingHide = setTimeout(() => {
            this.wattingHide = null
            this.isActive = false
          }, 2e3)
        }
      } else if (!this.isActive && !should_hide) {
        this.isActive = true
        clearTimeout(this.wattingHide)
        this.wattingHide = null
      }
    }
  }
}
</script>
<style lang="scss" >
@import '@/views/dashboard/Statistics/style/index.scss';
</style>
