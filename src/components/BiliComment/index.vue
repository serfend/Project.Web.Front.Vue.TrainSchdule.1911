<template>
  <el-card v-if="id">
    <span style="font-size:1.5rem">{{ totalCount }} {{ config.title }}</span>
    <el-tabs v-model="active_tab" @tab-click="handleClick">
      <el-tab-pane v-for="i in comment_pan" :key="i.name" :label="i.alias" :name="i.name">
        <Comment
          v-if="active_tab==i.name"
          :id="id"
          :ref="i.name"
          :order="i.name"
          :total-count.sync="totalCount"
          :config="config"
          @requireDelete="totalCount--"
          @requireAdd="totalCount++"
        >
          <slot v-if="$slots.sender" slot="sender" name="sender" />
        </Comment>
      </el-tab-pane>
    </el-tabs>
  </el-card>
</template>

<script>
import Comment from './Comment'
const comment_pan = [
  { name: 'as_popularity', alias: '按热度排序' },
  { name: 'as_date', alias: '按时间排序' }
]
export default {
  name: 'Comments',
  components: { Comment },
  props: {
    id: { type: String, default: null },
    config: { type: Object, default: () => ({ title: '评论', allowAdd: true }) },
  },
  data: () => ({
    totalCount: '...',
    active_tab: 'as_date',
    comment_pan: comment_pan
  }),
  methods: {
    comp() {
      const mapper = i => this.$refs[i.name] && this.$refs[i.name].length > 0
      const t = comment_pan.find(mapper)
      return this.$refs[t.name]
    },
    handleClick(tab) {
      // const c = this.$refs[tab.name][0]
      // if (!c || !c.reload_page) {
      //   this.$message.error('评论加载失败')
      //   return
      // }
      // c.reload_page()
    }
  }
}
</script>

<style lang="scss">
.dark-base {
  .el-textarea__inner {
    transition: all 0.5s ease;
  }
}
.dark {
  .el-textarea__inner {
    background-color: #444;
  }
}
.common-sender {
  margin: 10px 0 35px 0;
}
.comment-avatar {
  float: left;
  margin: 7px 0 0 5px;
  position: relative;
}
.comment-content {
  position: relative;
  margin-left: 85px;
  margin-right: 80px;
  .comment-text {
    font-size: 12px;
    overflow: auto;
    color: #555;
    padding: 0 30px;
    line-height: normal;
  }
  .comment-submit {
    width: 100px;
    height: 80px;
    position: absolute;
    right: -80px;
    top: 0;
    padding: 4px 30px;
    font-size: 15px;
    color: #fff;
    border-radius: 4px;
    text-align: center;
    min-width: 60px;
    vertical-align: top;
    cursor: pointer;
    background-color: #00a1d6;
    border: 1px solid #00a1d6;
    user-select: none;
    outline: none;
    z-index: 1;
  }
}
.avatar {
  transition: all 0.5s ease;
  cursor: pointer;
  width: 4em;
  height: 4em;
  border-radius: 50%;
}
</style>
