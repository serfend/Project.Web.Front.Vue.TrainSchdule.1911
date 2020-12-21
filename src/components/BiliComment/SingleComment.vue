<template>
  <div v-if="data" v-loading="loading">
    <el-row :gutter="20">
      <el-col :span="2.5" style="justify-content:center;display:flex">
        <el-image
          v-loading="loading_avatar"
          :src="avatar"
          :preview-src-list="[avatar]"
          class="avatar"
        />
      </el-col>
      <el-col :span="21">
        <el-popover trigger="hover" placement="left" @show="userIsActive=true">
          <User :data="data.from" :can-load-avatar="userIsActive" />
          <span slot="reference" class="user">
            <span class="user-name">{{ data.from?data.from.realName:'未知用户' }}</span>
          </span>
        </el-popover>
        <p style="margin-top:1rem">
          <span v-for="(i,index) in data.content.split('\n')" :key="index">
            {{ i }}
            <br>
          </span>
        </p>
        <div class="footer">
          <el-tooltip effect="light" :content="parseTime(data.create)">
            <span class="time">{{ formatTime(new Date(data.create)) }}</span>
          </el-tooltip>
          <span class="like" @click="handle_like">
            <SvgIcon :icon-class="liked?'like_filled':'like'" style-normal="color:#c33" />
            <span>{{ like_count }}</span>
          </span>
          <span class="like" @click="handle_delete">
            <SvgIcon icon-class="delete" style-normal="color:#c33" />
            <span>删除</span>
          </span>
        </div>
      </el-col>
    </el-row>
    <el-divider />
  </div>
</template>

<script>
import { formatTime, parseTime } from '@/utils'
import { getUserAvatar } from '@/api/user/userinfo'
import { likeComments, postComments } from '@/api/apply/attach_info'
import SvgIcon from '@/components/SvgIcon'
import User from '@/components/User'
export default {
  name: 'SingleComment',
  components: { SvgIcon, User },
  props: {
    data: {
      type: Object,
      default: null,
    },
  },
  data: () => ({
    avatar: '',
    liked: false,
    like_count: 0,
    loading_avatar: false,
    loading: false,
    userIsActive: false,
  }),
  watch: {
    data: {
      handler(val) {
        const d = this.data || {}
        this.like_count = d.like || 0
        this.liked = d.myLike
        if (d.from) this.load_avatar()
      },
      immediate: true,
      deep: true,
    },
  },
  methods: {
    formatTime,
    parseTime,
    load_avatar() {
      const user = this.data.from
      this.loading_avatar = true
      getUserAvatar(user.id, user.avatar, true)
        .then((d) => {
          this.avatar = d.url
        })
        .finally(() => {
          this.loading_avatar = false
        })
    },
    sending_like() {
      if (this.loading_like) return
      this.loading_like = true
      const this_time_like = this.liked
      likeComments({ id: this.data.id, like: this_time_like }).finally(() => {
        setTimeout(() => {
          this.loading_like = false
          if (this_time_like !== this.liked) this.sending_like()
        }, 2000)
      })
    },
    handle_like() {
      this.liked = !this.liked
      this.like_count += this.liked ? 1 : -1
      this.sending_like()
    },
    async handle_delete() {
      const check = await this.$confirm('确定要删除评论吗', {
        type: 'warning',
      }).catch((e) => {})
      if (!check) return
      this.loading = true
      postComments({ id: this.data.id, isRemove: true })
        .then(() => {
          this.$emit('requireDelete')
        })
        .finally(() => {
          this.loading = false
        })
    },
  },
}
</script>
<style lang="scss" scoped>
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
