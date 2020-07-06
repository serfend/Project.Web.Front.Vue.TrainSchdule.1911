<template>
  <div>
    <User v-if="directShowCard" :data="innerData" :can-load-avatar="true" />
    <el-popover v-else :placement="placement" width="200" trigger="hover" @show="isActive=true">
      <User :data="innerData" :can-load-avatar="isActive" />
      <el-tag v-show="innerData.realName" slot="reference" class="user-item" v-bind="$attrs">
        <i class="el-icon-user-solid" />
        {{ innerData.realName }}
      </el-tag>
    </el-popover>
  </div>
</template>

<script>
import { getUserSummary } from '@/api/user/userinfo'
import User from './index'
export default {
  name: 'UserFormItem',
  components: { User },
  props: {
    data: {
      type: Object,
      default() {
        return {
          realName: null
        }
      }
    },
    userid: {
      type: String,
      default: null
    },
    placement: {
      type: String,
      default: 'right'
    },
    directShowCard: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      isActive: false,
      innerData: {
        realName: 'null'
      }
    }
  },
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
        if (val) {
          this.loadUser(val)
        }
      },
      immediate: true
    }
  },

  methods: {
    loadUser(userid) {
      if (!userid) {
        return
      }
      getUserSummary(userid, true).then(data => {
        this.innerData = data
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
