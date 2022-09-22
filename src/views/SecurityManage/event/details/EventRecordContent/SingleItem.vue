<template>
  <div v-loading="loading" class="single-item">
    <div v-waves style="display:flex;overflow: hidden;" @dblclick="handleCopy(data.content,$event)">
      <UserAvatar :avatar="userRecord.userSummary.avatar" class="user-avatar" size="4rem" />
      <span class="user-content">
        <div class="user">
          <ConferRecordContentType :type="data.contentType" />
          <span class="user-name">{{ companyAndDuties }}</span>
        </div>
        <div v-if="isMarkdown" style="margin:1rem 0">
          <MarkdownViewer :content="data.content" />
        </div>
        <span v-else style="color:#333;font-size:10px;">
          <div v-for="(line,index) in data.content.split('\n')" :key="index">
            <span>{{ line }}</span>
          </div>
        </span>
        <div class="footer">
          <el-tooltip effect="light" :content="parseTime(data.create)">
            <span class="time">{{ formatTime(new Date(data.create)) }}</span>
          </el-tooltip>
          <span class="like" @click="handle_delete">
            <SvgIcon icon-class="delete" style-normal="color:#c33" />
            <span>删除</span>
          </span>
          <span class="like disabled" @click="handle_edit">
            <SvgIcon icon-class="edit" style-normal="color:#ccc" />
            <span>编辑</span>
          </span>
        </div>
      </span>
    </div>
    <el-divider v-if="!isMini" />
  </div>
</template>

<script>
import { formatTime, parseTime } from '@/utils'
import { postConferRecordContent } from '@/api/zzxt/party-conference/record'
import waves from '@/directive/waves'
import clip from '@/utils/clipboard'
export default {
  name: 'SingleItem',
  components: {
    MarkdownViewer: () => import('@/components/MarkdownEditor/Viewer'),
    SvgIcon: () => import('@/components/SvgIcon'),
    ConferRecordContentType: () =>
      import('@/components/Party/ConferRecordContentType'),
    UserAvatar: () => import('@/components/User/UserAvatar')
  },
  directives: {
    waves
  },
  props: {
    data: { type: Object, default: null },
    userRecord: { type: Object, default: null },
    isMini: { type: Boolean, default: false },
    isMarkdown: { type: Boolean, default: false }
  },
  data: () => ({
    loading: false
  }),
  computed: {
    companyAndDuties() {
      const d = this.userRecord && this.userRecord.userSummary
      if (!d) return '未知用户'
      return `${d.companyName}${d.dutiesName} ${d.realName}`
    }
  },
  watch: {
    userRecord: {
      handler(val) {
        if (!val || !val.userSummary) return
      },
      immediate: true
    }
  },
  methods: {
    formatTime,
    parseTime,
    handleCopy(text, event) {
      clip(text, event)
      this.$message.success(`已复制${this.companyAndDuties}的发言`)
    },
    handle_delete() {
      this.$confirm('确定要删除吗?').then(() => {
        const id = this.data.id
        this.loading = true
        postConferRecordContent({ id, isRemoved: true })
          .then(() => {
            this.$emit('onDelete')
          })
          .finally(() => {
            this.loading = false
          })
      })
    },
    handle_edit() {
      this.$emit('requireEdit')
    }
  }
}
</script>
<style lang="scss">
.disabled {
  cursor: no-drop !important;
}
.el-divider--horizontal {
  margin: 0.5rem 0 0.5rem 0 !important;
}
</style>
<style lang="scss" scoped>
.single-item {
  overflow: hidden;
  margin-top: 0.5rem;
  transition: all 0.5s ease;
  user-select: none;
}
.user-avatar {
  justify-content: center;
  display: flex;
  width: 4rem;
  .avatar {
    height: 4rem;
    border-radius: 50%;
  }
}
.user-content {
  width: 80%;
  padding: 0 1rem 0 1rem;
}
.user {
  font-size: 1rem;
  margin-bottom: 0.5rem;
  cursor: pointer;
  .user-name {
    color: rgb(95, 159, 255);
  }
}

.footer {
  user-select: none;
  overflow: hidden;
  white-space: nowrap;
  width: 100%;
  opacity: 0.5;
  transition: all ease 0.5s;
  margin-top: 0.5rem;
  &:hover {
    opacity: 1;
  }
  .time {
    color: #aaa;
  }
  .like {
    color: #bbb;
    cursor: pointer;
    margin-left: 1rem;
  }
}
</style>
