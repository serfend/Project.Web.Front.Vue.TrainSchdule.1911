<template>
  <el-tooltip placement="right" effect="light">
    <div slot="content">
      <User :data="data" />
    </div>
    <el-tag>
      <i class="el-icon-user-solid" />
      {{ data.realName }}
    </el-tag>
  </el-tooltip>
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
  mounted() {}
}
</script>

<style>
</style>
