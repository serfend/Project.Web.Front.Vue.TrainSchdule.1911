<template>
  <div>
    <div class="banner" />
    <el-card style="width:60rem;margin: 2rem auto">
      <el-tabs v-model="activeTab" tab-position="left">
        <el-tab-pane label="个人中心" disabled name="profile" />
        <el-tab-pane v-for="page in pages" :key="page.name" :name="page.name">
          <template #label>
            <div class="label-item">
              <SvgIcon :icon-class="page.icon" />
              <span>{{ page.label }}</span>
            </div>
          </template>
          <component :is="page" />
        </el-tab-pane>
      </el-tabs>
    </el-card>
  </div>
</template>

<script>
import importAll from '@/utils/common/importAll'
const modules = importAll(
  require.context('./pages', true, /\.vue$/),
  (keys, item) => {
    if (keys.length > 2 || (!item || !item.label)) return null
    return keys
      .join('.')
      .replace('.index', '')
      .replace('.vue', '')
  }
)
export default {
  name: 'Profile',
  components: {
    SvgIcon: () => import('@/components/SvgIcon'),
    ...modules
  },
  data: () => ({
    activeTab: null,
    pages: null
  }),
  computed: {
    nowuser() {
      return this.$store.state.user.data
    }
  },
  mounted() {
    this.pages = Object.values(modules).sort((a, b) => a.index - b.index)
    this.activeTab = this.pages[0].name
  },
  methods: {}
}
</script>
<style lang="scss" scoped>
@import '@/styles/element-variables';
.banner {
  background-color: $--color-primary;
  height: 6rem;
  margin: -1rem;
  opacity: 0.7;
  box-shadow: 1px 1px 1px 1px rgba(0, 0, 0, 0.2);
}
.label-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
</style>
