<template>
  <el-card v-if="id">
    <span style="font-size:1.5rem">{{ totalCount }} 评论</span>
    <el-tabs v-model="active_tab" @tab-click="handleClick">
      <el-tab-pane v-for="i in comment_pan" :key="i.name" :label="i.alias" :name="i.name">
        <ApplyComment
          v-show="active_tab==i.name"
          :id="id"
          :ref="i.name"
          :order="i.name"
          :total-count.sync="totalCount"
          @requireDelete="totalCount--"
          @requireAdd="totalCount++"
        />
      </el-tab-pane>
    </el-tabs>
  </el-card>
</template>

<script>
import ApplyComment from './ApplyComment'
const comment_pan = [
  { name: 'as_popularity', alias: '按热度排序' },
  { name: 'as_date', alias: '按时间排序' },
]
export default {
  name: 'ApplyComments',
  components: { ApplyComment },
  props: {
    id: {
      type: String,
      default: null,
    },
  },
  data: () => ({
    totalCount: '...',
    active_tab: 'as_popularity',
    comment_pan: comment_pan,
  }),
  methods: {
    handleClick(tab) {
      const c = this.$refs[tab.name][0]
      if (!c || !c.reload_page) {
        this.$message.error('评论加载失败')
        return
      }
      c.reload_page()
    },
  },
}
</script>
