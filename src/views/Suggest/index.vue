<template>
  <div>
    <el-alert type="warning">意见反馈栏目建设中...</el-alert>
    <BiliComment id="7927df03-bb1e-4a2a-b8cb-04a1039c3d23">
      <template slot="sender">
        <MarkdownEditor v-model="comment" :options="options" />
        <div class="cmd-bar">
          <el-button type="success" class="cmd-btn">发送</el-button>
        </div>
      </template>
    </BiliComment>
  </div>
</template>

<script>
import BiliComment from '@/components/BiliComment'
import MarkdownEditor from '@/components/MarkdownEditor/Editor'
export default {
  name: 'Suggest',
  components: { BiliComment, MarkdownEditor },
  data: () => ({
    comment: '',
    options: {
      placeholder: '发一条评论，友善的说说你的看法吧~'
    }
  })
}
</script>
<style lang="scss" scoped>
.cmd-bar {
  margin-top: 1rem;
  float: right;
  .cmd-btn {
    min-width: 8rem;
  }
}
</style>
