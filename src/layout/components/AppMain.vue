<template>
  <section v-if="isAlive" class="app-main">
    <transition name="fade-transform">
      <keep-alive :include="cachedViews">
        <router-view :key="key" />
      </keep-alive>
    </transition>
    <Footer :show="canShow" />
  </section>
</template>

<script>
import Footer from '@/views/welcome/Footer'
export default {
  name: 'AppMain',
  components: { Footer },
  data: () => ({
    isAlive: true,
    canShow: false
  }),
  computed: {
    cachedViews() {
      return this.$store.state.tagsView.cachedViews
    },
    key() {
      return this.$route.fullPath
    }
  },
  watch: {
    key: {
      handler(val) {
        this.canShow = false
        setTimeout(() => {
          this.canShow = true
        }, 2000)
      }, immediate: true
    },
    '$store.state.app.isReloading': {
      handler(val) {
        if (val) {
          this.$store.dispatch('app/reload', { complete: true })
          this.initUserInfo()
        }
      },
      immediate: true
    }
  },
  created() {
    this.$store.dispatch('app/reload', { complete: false })
  },
  methods: {
    reload() {
      this.isAlive = false
      this.$nextTick(() => {
        this.isAlive = true
        this.initUserInfo()
      })
    },
    async initUserInfo() {
      this.$store.dispatch('vacation/initDic')
      await this.$store.dispatch('user/initBase').then(() => {
        this.$store.dispatch('user/initAvatar')
        this.$store.dispatch('user/initVacation')
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.app-main {
  /* 50= navbar  50  */
  min-height: calc(100vh - 50px);
  width: 100%;
  position: relative;
  overflow: hidden;
}

.fixed-header + .app-main {
  padding-top: 50px;
}

.hasTagsView {
  .app-main {
    /* 84 = navbar + tags-view = 50 + 34 */
    min-height: calc(100vh - 84px);
  }

  .fixed-header + .app-main {
    padding-top: 84px;
  }
}
</style>

