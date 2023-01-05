<template>
  <div class="navbar">
    <div class="content" style="text-align:center">
      <span
        v-if="!$route.meta.removeHeader"
        class="main-title"
      >{{ generateTitle($route.meta.title) }}</span>
      <span style="margin-left:1.5rem;float:left">
        <SvgIcon icon-class="security" />
        <span>{{ title || $store.state.settings.title }}</span>
      </span>
      <span class="right-item" @click="show_setting">
        <span class="btn">
          <SvgIcon icon-class="jiekou" />
          <span>设置</span>
        </span>
        <span class="btn" @click="return_home">
          <SvgIcon icon-class="dengchu" />
          <span>返回主页</span>
        </span>
      </span>
    </div>
    <el-dialog v-el-drag-dialog :visible.sync="show_setting_dialog" append-to-body>
      <h3 slot="title" class="dialog-title">设置选项</h3>
      <slot name="setting" />
    </el-dialog>
  </div>
</template>

<script>
import SvgIcon from '@/components/SvgIcon'
import { generateTitle } from '@/utils/i18n'
import elDragDialog from '@/directive/el-drag-dialog'
export default {
  name: 'Header',
  components: { SvgIcon },
  directives: {
    elDragDialog
  },
  props: {
    title: { type: String, default: null }
  },
  data: () => ({
    show_setting_dialog: false
  }),
  methods: {
    generateTitle,
    show_setting() {
      this.show_setting_dialog = true
    },
    return_home() {
      this.$router.push('/')
    }
  }
}
</script>

<style lang="scss" scoped>
@import '~@/styles/element-variables.scss';
.dialog-title {
  color: $--color-primary-light;
}

.right-item {
  .btn {
    cursor: pointer;
    color: $--color-primary-dark;
    transition: all 0.5s ease;
    &:hover {
      color: $--color-primary-light;
    }
  }
  margin-right: 2rem;
  font-size: 1.2rem;
  float: right;
}
.navbar {
  color: $--color-primary-light;
  height: 5rem;
  line-height: 3rem;
  display: flex;
  font-size: 2rem;
  transition-property: background-color;
  transition-duration: 0.5s;
  transition-timing-function: ease;
  .content {
    width: 100%;
    margin-top: auto;
    margin-bottom: auto;
  }
  .main-title {
    color: $--color-warning;
    font-size: 2.4rem;
    letter-spacing: 0.5rem;
    font-family: 'PingFang SC';
  }
  &:hover {
    background-color: $--border-color-light;
    color: rgba(14, 0, 63, 0.8);
    .main-title {
      color: $--color-background-darker;
    }
  }
}
</style>
