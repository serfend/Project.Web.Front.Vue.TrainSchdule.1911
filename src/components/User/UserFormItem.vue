<template>
  <span v-loading="loading">
    <User v-if="directShowCard" ref="card" :data="innerData" :can-load-avatar="true" @expandChange="v=>$emit('expandChange',v)" />
    <el-popover v-else :placement="placement" trigger="hover" @show="isActive=true">
      <User v-if="isActive" ref="card" :data="innerData" :can-load-avatar="isActive" @expandChange="v=>$emit('expandChange',v)" />
      <el-tag slot="reference" class="user-item" :type="type" v-bind="$attrs">
        <i class="el-icon-user-solid" />
        <span v-if="innerData">{{ innerData.realName }}</span>
        <span v-else>
          <el-tooltip :content="errorMsg">
            <span>{{ userid }}无效</span>
          </el-tooltip>
        </span>
      </el-tag>
    </el-popover>
  </span>
</template>

<script>
import { getUserSummary } from '@/api/user/userinfo'
import User from './index'
export default {
  name: 'UserFormItem',
  components: { User },
  props: {
    data: { type: Object, default: () => ({ realName: null }) },
    userid: { type: String, default: null },
    placement: { type: String, default: 'right' },
    directShowCard: { type: Boolean, default: false },
    type: { type: String, default: 'primary' },
  },
  data: () => ({
    isActive: false,
    innerData: {
      realName: 'null'
    },
    lastUserId: null,
    loading: false,
    errorMsg: null
  }),
  watch: {
    data: {
      handler(val) {
        if (val) {
          this.innerData = val
        }
      },
      immediate: true
    },
    userid: {
      handler(val) {
        this.loadUser(val)
      },
      immediate: true
    }
  },

  methods: {
    switchExpand(isExpand) {
      const card = this.$refs.card
      if (!card) return
      card.isHover = isExpand
    },
    loadUser(userid) {
      if (!userid) {
        if (this.lastUserId) this.innerData = null
        return
      }
      this.loading = true
      this.lastUserId = userid
      getUserSummary(userid, true)
        .then(data => {
          this.innerData = data
        })
        .catch(e => {
          this.innerData = null
          this.errorMsg = e.message
        })
        .finally(() => {
          this.loading = false
        })
    }
  }
}
</script>

<style lang="scss" scoped>
.user-item {
  transition: transform 0.5s;
}
</style>
