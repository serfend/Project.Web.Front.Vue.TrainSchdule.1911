<template>
  <el-image v-bind="$attrs" :src="data.src" class="img">
    <slot slot="placeholder" name="placeholder" />
  </el-image>
</template>

<script>
import { getUserAvatar } from '@/api/user/userinfo'
import defaultAvatar from '@/assets/plain/defaultAvatar.js'
export default {
  name: 'UserAvatar',
  props: {
    user: { type: String, default: null }
  },
  data: () => ({
    loading: false,
    data: {
      src: defaultAvatar
    }
  }),
  watch: {
    user: {
      handler(val) {
        if (!val) {
          this.data.src = defaultAvatar
          return
        }
        this.refresh()
      },
      immediate: true
    }
  },
  methods: {
    refresh() {
      this.loading = true
      getUserAvatar(this.user, null, true)
        .then(d => {
          this.data.src = d.url
        })
        .finally(() => {
          this.loading = false
        })
    }
  }
}
</script>
