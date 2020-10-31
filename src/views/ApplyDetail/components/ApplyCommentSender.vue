<template>
  <div class="common-sender">
    <div style="margin-right:7rem;margin-left:5rem">
      <el-image
        :src="avatar"
        :preview-src-list="[avatar]"
        class="avatar"
        style="position:absolute;left:0.5rem;margin-top:1rem"
      />
      <el-input
        v-model="content"
        :disabled="!!sending"
        :autosize="{ minRows: 4, maxRows: 4}"
        class="comment-sender"
        style="width:100%"
        type="textarea"
        placeholder="说些想说的事情"
      />
      <el-button
        class="comment-sender"
        style="width:6rem;position:absolute;right:0.5rem;"
        :disabled="!!sending"
        :type="sending?'info':'primary'"
        @click="send_to"
      >{{ !!sending?sending:'发表评论' }}</el-button>
    </div>
  </div>
</template>

<script>
import { postComments } from '@/api/apply/attach_info'
export default {
  name: 'ApplyCommentSender',
  props: {
    id: {
      type: String,
      default: null,
    },
  },
  data: () => ({
    sending: null,
    content: '',
  }),
  computed: {
    avatar() {
      return this.$store.state.user.avatar
    },
  },
  methods: {
    async send_to() {
      if (!this.content || this.content.length < 1) {
        const f = await this.$confirm(
          '评论没有内容，确定要发送吗？'
        ).catch((e) => {})
        if (!f) return
      }
      this.sending = '发送中...'
      const item = {
        content: this.content,
      }
      postComments({ apply: this.id, content: this.content })
        .then((data) => {
          this.sending = '发送成功'
          item.model = data.model
        })
        .catch((e) => {
          this.sending = e.message
        })
        .finally(() => {
          setTimeout(() => {
            item.sending = this.sending
            this.$emit('newContent', item)
            this.sending = null
            this.content = ''
          }, 1e3)
        })
    },
  },
}
</script>

<style lang="scss">
.comment-sender {
  height: 6rem;
  min-height: 6rem;
  margin-bottom: 2rem;
}
.avatar {
  transition: all 0.5s ease;
  cursor: pointer;
  width: 4em;
  height: 4em;
  border-radius: 50%;
}
</style>
