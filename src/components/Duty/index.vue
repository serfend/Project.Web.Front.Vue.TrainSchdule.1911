<template>
  <div>
    <el-card>
      <template slot="header">
        <h2>{{ data.name }}职务的信息</h2>
      </template>
      施工中...应显示职务的名称，类型，基本类型等
    </el-card>
  </div>
</template>

<script>
export default {
  name: 'Duty',
  props: {
    data: {
      type: Object,
      default() {
        return {
          name: 'null'
        }
      }
    }
  }
}
</script>

<style>
</style>
