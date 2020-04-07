<template>
  <el-popover placement="right" width="200" trigger="hover" @show="isActive=true">
    <User :data="data" :canLoadAvatar="isActive" />
    <el-tag slot="reference">
      <i class="el-icon-user-solid" />
      {{ data.realName }}
    </el-tag>
  </el-popover>
</template>

<script>
import User from './index'
export default {
  name: 'UserFormItem',
  components: { User },
  props: {
    data: {
      type: Object,
      default() {
        return {
          realName: 'null'
        }
      }
    }
  },
  data() {
    return {
      isActive: false
    }
  }
}
</script>

<style>
</style>
