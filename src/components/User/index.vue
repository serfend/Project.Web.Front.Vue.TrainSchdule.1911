<template>
  <div>
    <el-card>
      <template slot="header">
        <h2>{{ data.realName }}成员的信息</h2>
      </template>
      施工中...应显示成员的姓名，头像，单位等
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
          realName: 'null'
        }
      }
    }
  }
}
</script>

<style>
</style>
