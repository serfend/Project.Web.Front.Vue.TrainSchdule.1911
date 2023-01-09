<template>
  <div v-loading="loading">
    <slot v-if="directShowCard" :data="innerData" :can-load-avatar="true" />
    <el-popover v-else :placement="placement" width="200" trigger="hover" @show="isActive=true">
      <slot v-if="isActive" :data="innerData" :can-load-avatar="isActive" />
      <el-tag slot="reference" class="user-item" v-bind="$attrs">
        <i class="el-icon-user-solid" />
        <span v-if="label">{{ label }}</span>
        <span v-else>
          <el-tooltip :content="errorMsg">
            <span>{{ userid }}无效</span>
          </el-tooltip>
        </span>
      </el-tag>
    </el-popover>
  </div>
</template>

<script>
export default {
  name: 'EntityFormItem',
  props: {
    data: { type: Object, default: () => ({ }) },
    userid: { type: String, default: null },
    placement: { type: String, default: 'right' },
    directShowCard: { type: Boolean, default: false },
    dataLoader: {
      type: Function, default: (userid, is) => ({})
    },
    dataMapper: { type: Function, default: (d) => d && d.realName }
  },
  data: () => ({
    isActive: false,
    innerData: null,
    label: null,
    lastUserId: null,
    loading: false,
    errorMsg: null
  }),
  watch: {
    data: {
      handler(val) {
        if (val) {
          this.setInnerData(val)
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
    setInnerData (v) {
      this.innerData = v
      this.label = this.dataMapper(v)
      this.$emit('change', v)
    },
    loadUser (userid) {
      if (!userid) {
        if (this.lastUserId) this.setInnerData(null)
        return
      }
      this.loading = true
      this.lastUserId = userid
      this.dataLoader(userid, true)
        .then(data => {
          this.setInnerData(data)
        })
        .catch(e => {
          this.setInnerData(null)
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
