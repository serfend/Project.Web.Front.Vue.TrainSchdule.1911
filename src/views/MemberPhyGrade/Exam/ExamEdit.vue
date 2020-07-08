<template>
  <el-dialog :visible.sync="show">施工中</el-dialog>
</template>

<script>
export default {
  name: 'ExamEdit',
  model: {
    prop: 'data',
    event: 'change'
  },
  props: {
    data: {
      type: Object,
      default: null
    }
  },
  data: () => ({
    show: false
  })
}
</script>

<style>
</style>
