<template>
  <el-card v-if="data" v-loading="loading" shadow="hover">
    <h3 slot="header">动态（施工中）</h3>
    <el-row :gutter="10">
      <el-col :span="16">
        <div>
          <span>物联网设备安装上线后，此处将显示</span>
          <el-tag>授权（取消授权）通行记录</el-tag>
          <el-tag>通行（进出门）记录</el-tag>
        </div>
      </el-col>
    </el-row>
  </el-card>
</template>

<script>
import { formatTime, parseTime } from '@/utils'
export default {
  name: 'ApplyExecuteRecords',
  components: {
  },
  props: {
    data: { type: Object, default: null },
    loading: { type: Boolean, default: false },
    entityType: { type: String, default: null }
  },
  data: () => ({}),
  computed: {
  },
  watch: {
  },
  methods: {
    formatTime,
    parseTime,
  }
}
</script>

<style scoped>

</style>
