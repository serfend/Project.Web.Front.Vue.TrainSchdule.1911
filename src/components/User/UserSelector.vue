<template>
  <div>
    <span
      style="cursor: pointer;display: flex;"
      @click="dialogVisible = true"
      @mouseenter="forgetHasShow = true"
    >
      <span style="line-height:2rem;">当前选中：</span>
      <UserFormItem v-if="code" :userid="code" />
      <span v-else :class="[code ? 'active' : 'inactive', 'sel-btn']">{{
        `${defaultInfo} ${code ? code : ""}`
      }}</span>
    </span>
    <el-dialog
      v-if="forgetHasShow"
      title="搜索成员"
      :visible.sync="dialogVisible"
      append-to-body
    >
      <div>
        <el-tooltip content="选择后所有的成员选择器都将在选中人员后被关闭">
          <el-switch
            v-model="closeOnSelectGlobal"
            active-text="全局选择后关闭"
          />
        </el-tooltip>
        <el-tooltip
          :content="current_selector_autoclose_desc"
          style="margin-left:1rem"
        >
          <el-switch
            v-model="closeOnSelectCurrent"
            :disabled="!selectName"
            active-text="此位置选择后关闭"
          />
        </el-tooltip>
        <div v-if="code">
          <span>当前选中:{{ userRealName || code }}</span>
          <el-button type="text" @click="clearSelect">清除选中</el-button>
        </div>
      </div>
      <el-divider />
      <FindUserByRealName
        v-model="nowUserCode"
        :avatar.sync="avatar"
        :select-name="selectName"
        @change="selectUserChanged"
      />
    </el-dialog>
  </div>
</template>

<script>
import { getUserBase } from '@/api/user/userinfo'
export default {
  name: 'UserSelector',
  components: {
    FindUserByRealName: () => import('./FindUserByRealName'),
    UserFormItem: () => import('./UserFormItem')
  },
  model: {
    prop: 'code',
    event: 'change'
  },
  props: {
    code: { type: String, default: null },
    defaultInfo: { type: String, default: '搜索成员' },
    placeholder: { type: String, default: null },
    selectName: { type: String, default: null }
  },
  data: () => ({
    loading: false,
    forgetHasShow: false,
    dialogVisible: false,
    userRealName: null,
    avatar: null,
    icloseOnSelectGlobal: false,
    icloseOnSelectCurrent: false
  }),
  computed: {
    closeOnSelectGlobal: {
      get() {
        return this.icloseOnSelectGlobal
      },
      set(val) {
        this.icloseOnSelectGlobal = val
        localStorage.setItem(`selector.global`, val)
      }
    },
    closeOnSelectCurrent: {
      get() {
        return this.icloseOnSelectCurrent
      },
      set(val) {
        this.icloseOnSelectCurrent = val
        localStorage.setItem(`selector.${this.selectName}`, val)
      }
    },
    current_selector_autoclose_desc() {
      const s = this.selectName
      if (!s) return '当前选择器不支持局部选取'
      return `选择后仅【${s}】位置的成员选择器将在选中人员后被关闭`
    },
    nowUserCode: {
      get() {
        return this.code
      },
      set(val) {
        this.$emit('update:code', val)
      }
    }
  },
  watch: {
    avatar: {
      handler(val) {
        this.$emit('update:avatar', val)
      }
    },
    nowUserCode: {
      handler(val) {
        if (val) this.loadUserName()
      }
    }
  },
  mounted() {
    this.icloseOnSelectGlobal = JSON.parse(
      localStorage.getItem(`selector.global`)
    )
    this.icloseOnSelectCurrent = JSON.parse(
      localStorage.getItem(`selector.${this.selectName}`)
    )
  },
  methods: {
    setDialog(show) {
      this.dialogVisible = show
    },
    clearSelect() {
      this.userRealName = null
      this.nowUserCode = null
      this.$emit('change', null)
    },
    selectUserChanged(u) {
      if (u) {
        this.userRealName = `${u.realName}(${u.id})`
        if (this.closeOnSelectCurrent || this.closeOnSelectGlobal) {
          this.setDialog(false)
        }
      }
      this.nowUserCode = u.id
      this.$emit('change', u)
    },
    loadUserName() {
      if (this.userRealName || !this.nowUserCode) return
      this.loading = true
      getUserBase(this.nowUserCode)
        .then(data => {
          this.$nextTick(() => {
            this.userRealName = data.base.realName
          })
        })
        .finally(() => {
          this.loading = false
        })
    }
  }
}
</script>
<style lang="scss" scoped>
@import "@/styles/element-variables";
.sel-btn {
  text-decorate: underline;
}
.active {
  color: $--color-primary;
}
.inactive {
  color: $--color-info;
}
</style>
