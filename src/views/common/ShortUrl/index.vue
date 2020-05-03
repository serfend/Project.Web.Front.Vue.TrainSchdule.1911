<template>
  <el-card>
    <el-form style="justify-content:center" label-width="100px">
      <el-form-item label="原始链接">
        <el-input v-model="target" />
      </el-form-item>
      <el-form-item label="自定id">
        <el-input v-model="urlKey" />
      </el-form-item>
      <el-form-item label="短链接">
        <ShortUrl :url-key.sync="urlKey" />
      </el-form-item>
      <el-button type="success" @click="create">创建</el-button>
      <el-button type="danger" @click="remove">删除</el-button>
      <el-button type="info" @click="loadStatistics">统计情况</el-button>
    </el-form>
  </el-card>
</template>

<script>
import { createDwz, statistics, remove } from '@/api/dwz'
import ShortUrl from './ShortUrl'
export default {
  name: 'ShortUrlView',
  components: { ShortUrl },
  data() {
    return {
      target: '',
      urlKey: '',
      expire: '',
      statisticsData: {},
      statisticsQuery: {
        create: { start: '', end: '' },
        viewBy: '',
        ip: '',
        device: '',
        pages: { pageIndex: 0, pageSize: 999 }
      }
    }
  },
  methods: {
    create() {
      createDwz(this.target, this.urlKey).then(data => {
        this.urlKey = data.key
      })
    },
    remove() {
      remove(this.urlKey).then(() => {
        this.$message.success('已删除')
      })
    },
    loadStatistics() {
      const params = { key: this.urlKey, ...this.statisticsQuery }
      statistics(params).then(data => {
        console.log(data)
      })
    }
  }
}
</script>

<style>
</style>
