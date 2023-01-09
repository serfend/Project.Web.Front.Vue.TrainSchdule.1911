<template>
  <el-card class="single-card">
    <el-form label-width="5rem">
      <el-form-item label="车牌">{{ data.identity }}</el-form-item>
      <el-form-item label="车型">{{ (data.type && data.type.name )|| '未知' }}</el-form-item>
      <el-form-item label="所属单位">{{ (data.company && data.company.name) || '未知' }}</el-form-item>
      <el-form-item label="使用时间">{{ useTime(data.timeAllot) }}</el-form-item>
    </el-form>
  </el-card>
</template>

<script>
import { parseTime, datedifference } from '@/utils'

export default {
  name: 'VehicleItem',
  components: {},
  props: {
    data: {
      type: Object,
      default: () => ({})
    }
  },
  methods: {
    useTime (v) {
      const r = parseTime(v, '{y}-{m}-{d}')
      const y = datedifference(new Date(), new Date(v), 'year')
      return `${r}(${y}年)`
    }
  }
}
</script>
<style lang="scss" scoped>
.single-card {
  width: 30rem;
}
</style>
