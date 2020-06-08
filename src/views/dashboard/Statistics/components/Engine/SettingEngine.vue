<template>
  <div>
    <div v-show="!showDialog" class="display-item" @click="showSetting">设置</div>
    <el-dialog :visible.sync="showDialog" title="设置" append-to-body>
      <MagicForm v-if="innerSetting" v-model="innerSetting" />
      <el-alert v-else type="error">设置选项未初始化</el-alert>
    </el-dialog>
  </div>
</template>

<script>
import MagicForm from '@/components/MagicForm'
export default {
  name: 'SettingEngine',
  components: { MagicForm },
  props: {
    setting: {
      type: Object,
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
          this.innerSetting = val
        }
      },
      immediate: true
    },
    innerSetting: {
      handler(val) {
        this.$emit('update:setting', this.innerSetting)
      },
      deep: true
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
