<template>
  <div>
    <div v-show="!showDialog" class="display-item" @click="showSetting">设置</div>
    <el-dialog :visible.sync="showDialog" title="设置" append-to-body>
      <el-form v-if="innerSetting">施工中</el-form>
      <el-alert v-else type="error">设置选项未初始化</el-alert>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: 'SettingEngine',
  props: {
    setting: {
      type: Array,
      default() {
        return null
      }
    }
  },
  data: () => ({
    showDialog: false,
    innerSetting: null
  }),
  watch: {
    setting: {
      handler(val) {
        if (val) {
          this.innerSetting = this.setting
        }
      },
      immediate: true
    }
  },
  methods: {
    showSetting() {
      this.showDialog = true
    }
  }
}
</script>

<style lang="scss" scoped>
.display-item {
  color: #aaa;
  font-size: 0.05rem;
  cursor: pointer;
}
</style>
