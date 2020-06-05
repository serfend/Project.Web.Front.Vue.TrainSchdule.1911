<template>
  <el-card v-loading="loading">
    <el-collapse accordion>
      <el-collapse-item v-for="item in list" :key="item.id">
        <template slot="title">
          <h3 style="margin-right:1rem">{{ item.title }}</h3>
          <el-link type="primary">{{ item.version }}</el-link>
        </template>
        <div>{{ formatTime(item.create) }}</div>
        <p v-for="l in item.description.split('\n')" :key="l">{{ l }}</p>
      </el-collapse-item>
    </el-collapse>
    <el-button icon="el-icon-plus" @click="refresh">加载更多</el-button>
  </el-card>
</template>

<script>
import { formatTime } from '@/utils'
import { getUpdateRecord } from '@/api/common/version'
export default {
  name: 'VersionDisplay',
  data: () => ({
    loading: false,
    list: [],
    pages: { pageIndex: -1, pageSize: 5 },
    totalCount: 0
  }),
  mounted() {
    this.refresh()
  },
  methods: {
    formatTime(t) {
      return formatTime(new Date(t), '{y}-{m}-{d}')
    },
    refresh() {
      if (this.loading) return
      this.loading = true
      this.pages.pageIndex++
      getUpdateRecord(this.pages.pageIndex, this.pages.pageSize)
        .then(data => {
          this.list = this.list.concat(
            data.list.map(i => {
              var title = ''
              var checkTitle = i.description.substring(0, 2) === '# '
              if (checkTitle) {
                var tPos = i.description.indexOf(' #')
                title = i.description.substring(2, tPos)
                i.description = i.description.substring(tPos + 3)
              } else {
                var pos = i.description.indexOf('\n')
                if (pos > 0) {
                  title = i.description.substring(0, pos)
                }
              }
              if (i.version.substring(0, 1) !== 'v') i.version = `v${i.version}`
              return Object.assign({ title }, i)
            })
          )
          this.totalCount = data.totalCount
        })
        .finally(() => {
          this.loading = false
        })
    }
  }
}
</script>

<style>
</style>

