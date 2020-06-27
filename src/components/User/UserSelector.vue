<template>
  <div>
    <el-tooltip>
      <template slot="content">
        <span>点击链接选择成员</span>
        <span style="cursor:pointer" @click="clearSelect">清空</span>
      </template>
      <el-link type="info" @click="dialogVisible=true">
        <span @mouseenter="forgetHasShow=true">{{ userRealName }}</span>
      </el-link>
    </el-tooltip>
    <el-dialog v-if="forgetHasShow" title="搜索成员" :visible.sync="dialogVisible" append-to-body>
      <FindUserByRealName :avatar.sync="avatar" @change="selectUserChanged" />
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
    userRealName: null,
    avatar: null
  }),
  watch: {
    defaultInfo: {
      handler(val) {
        if (val) {
          this.userRealName = val
        }
      },
      immediate: true
    },
    avatar: {
      handler(val) {
        this.$emit('update:avatar', val)
      }
    }
  },
  methods: {
    clearSelect() {
      this.userRealName = null
      this.$emit('update:code', null)
      this.$emit('change', null)
    },
    selectUserChanged(u) {
      if (u) {
        this.userRealName = `${u.realName}(${u.id})`
      }
      this.$emit('update:code', u.id)
      this.$emit('change', u)
    }
  }
}
</script>

<style>
</style>
