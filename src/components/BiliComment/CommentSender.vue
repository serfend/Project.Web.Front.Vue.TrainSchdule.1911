<template>
  <div class="common-sender">
    <div class="comment-avatar">
      <el-image :src="avatar" :preview-src-list="[avatar]" class="avatar" />
    </div>
    <div class="comment-content">
      <el-input
        ref="input"
        v-model="content"
        class="comment-text"
        :disabled="!!sending"
        :autosize="{ minRows: 4, maxRows: 4}"
        type="textarea"
        placeholder="说些想说的事情"
      />
      <button
        :disabled="!!sending"
        class="comment-submit"
        :type="sending?'info':'primary'"
        @click="send_to"
      >{{ !!sending?sending:'发表评论' }}</button>
    </div>
  </div>
</template>

<script>
import { postComments } from '@/api/apply/attach_info'
export default {
  name: 'CommentSender',
  props: {
    id: { type: String, default: null },
    reply: { type: String, default: null },
    defaultContent: { type: String, default: null }
  },
  data: () => ({
    sending: null,
    content: ''
  }),
  computed: {
    avatar() {
      return this.$store.state.user.avatar
    }
  },
  watch: {
    defaultContent: {
      handler(val) {
        this.content = val
      },
      immediate: true
    }
  },
  methods: {
    focus() {
      this.$refs.input.focus()
    },
    async send_to({ content, cb }) {
      content = content || this.content
      if (!content || content < 1) {
        const f = await this.$confirm('评论没有内容，确定要发送吗？')
        if (!f) return cb && cb()
      }
      this.sending = '发送中...'
      const reply = this.reply
      const apply = this.id
      const item = {
        apply,
        content,
        reply
      }
      postComments(item)
        .then(data => {
          this.sending = '发送成功'
          item.model = data.model
        })
        .catch(e => {
          this.sending = e.message
        })
        .finally(() => {
          setTimeout(() => {
            item.sending = this.sending
            this.$emit('newContent', item)
            this.sending = null
            this.content = ''
            cb && cb(item)
          }, 1e3)
        })
    }
  }
}
</script>

<style lang="scss">
.common-sender {
  margin: 10px 0;
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
