<template>
  <el-popover :placement="placement" width="200" trigger="hover" @show="isActive=true">
    <User :data="innerData" :can-load-avatar="isActive" />
    <el-tag slot="reference">
      <i class="el-icon-user-solid" />
      {{ innerData.realName }}
    </el-tag>
  </el-popover>
</template>

<script>
import { getUserSummary } from '@/api/userinfo'
import User from './index'
export default {
  name: 'UserFormItem',
  components: { User },
  props: {
    data: {
      type: Object,
      default() {
        return {
          realName: 'null'
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
      getUserSummary(userid, true).then(data => {
        this.innerData = data
      })
    }
  }
}
</script>

<style>
</style>
