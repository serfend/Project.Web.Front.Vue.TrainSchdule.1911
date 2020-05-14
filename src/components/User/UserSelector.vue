<template>
  <div>
    <el-tooltip content="点击选择成员">
      <span
        style="cursor:pointer"
        @mouseenter="forgetHasShow=true"
        @mousedown="dialogVisible=true"
      >{{ userRealName }}</span>
    </el-tooltip>
    <el-dialog v-if="forgetHasShow" title="搜索成员" :visible.sync="dialogVisible" append-to-body>
      <FindUserByRealName @change="selectUserChanged" />
    </el-dialog>
  </div>
</template>

<script>
import FindUserByRealName from '@/components/User/FindUserByRealName'
export default {
  name: 'UserSelector',
  components: { FindUserByRealName },
  props: {
    defaultInfo: {
      type: String,
      default: '未选中'
    }
  },
  data: () => ({
    forgetHasShow: false,
    dialogVisible: false,
    userRealName: null
  }),
  watch: {
    defaultInfo: {
      handler(val) {
        if (val) {
          if (!this.userRealName) {
            this.userRealName = val
          }
        }
      },
      immediate: true
    }
  },
  methods: {
    selectUserChanged(u) {
      if (u) {
        this.userRealName = `${u.realName}(${u.id})`
      }
      this.$emit('update:code', u.id)
    }
  }
}
</script>

<style>
</style>
