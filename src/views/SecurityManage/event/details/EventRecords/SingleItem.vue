<template>
  <div
    v-if="inner_data"
    v-waves
    v-loading="loading"
    :class="['single-item',inner_selected?'selected':null]"
    @click="handleClick"
    @dblclick="hdlDblClick"
  >
    <el-button class="item-remove" type="text" icon="el-icon-delete" @click.stop="handleDelete" />
    <el-tooltip content="备注">
      <el-button
        :class="[showEdit?'item-remove-active':'item-remove']"
        type="text"
        icon="el-icon-edit"
        @click.stop="showEdit = true"
      />
    </el-tooltip>
    <span>
      <UserAvatar :avatar="inner_data.userSummary && inner_data.userSummary.avatar" />
    </span>
    <div class="user-name">{{ companyAndDuties }}</div>
    <div v-if="!showEdit" class="user-description">{{ inner_data.remark }}</div>
    <div v-else class="user-description" style="display:flex" @click.stop>
      <el-input
        ref="remark-input"
        v-model="inner_data.remark"
        placeholder="在此处输入情况备注"
        @keypress.enter.native.stop="handleChange"
      />
      <el-button
        :class="[anyChange?'item-remove-active':'item-remove','margin-left']"
        type="text"
        @click.stop="handleChange"
      >备注</el-button>
    </div>
    <div style="width:3rem">
      <ConferRecordType :type="inner_data.type" style="float:right" />
    </div>
  </div>
</template>

<script>
import { postConferRecord } from '@/api/zzxt/party-conference/record'
import waves from '@/directive/waves'
export default {
  name: 'ConferRecordSingleItem',
  components: {
    ConferRecordType: () => import('@/components/Party/ConferRecordType'),
    UserAvatar: () => import('@/components/User/UserAvatar')
  },
  prop: {
    requireOnDouble: { type: Boolean, default: true }
  },
  directives: { waves },
  model: {
    prop: 'data',
    event: 'change'
  },
  props: {
    data: { type: Object, default: null },
    selected: { type: Boolean, default: false }
  },
  data: () => ({
    loading: false,
    inner_selected_value: false,
    showEdit: false,
    anyChange: false,
    inner_data: null
  }),
  computed: {
    inner_selected: {
      get() {
        return this.inner_selected_value
      },
      set(val) {
        this.inner_selected_value = val
        this.$emit('update:selected', val)
      }
    },
    companyAndDuties() {
      const d = this.inner_data.userSummary
      if (!d) return '无'
      return `${d.companyName}${d.dutiesName} ${d.realName}`
    }
  },
  watch: {
    showEdit: {
      handler(val) {
        if (!val) return
        this.$nextTick(() => {
          const d = this.$refs['remark-input']
          if (d) d.focus()
        })
      }
    },
    data: {
      handler(val) {
        this.inner_data = val
      },
      immediate: true
    }
  },
  methods: {
    handleChange() {
      this.anyChange = false
      this.showEdit = false
      this.loading = true
      const data = Object.assign({ allowOverWrite: true }, this.inner_data)
      data.userId = [data.userId]
      postConferRecord(data)
        .then(() => {
          this.$message.success('已编辑备注')
        })
        .catch(e => {
          this.$emit('requireRefresh')
        })
        .finally(() => {
          this.loading = false
        })
    },
    handleClick() {
      if (this.requireOnDouble) return
      this.handleCallBack()
    },
    hdlDblClick() {
      if (!this.requireOnDouble) return
      this.handleCallBack()
    },
    handleCallBack() {
      this.inner_selected = !this.inner_selected
      this.$emit('onSelect', this.inner_selected)
    },
    handleDelete() {
      const summary = this.inner_data.userSummary
      if (!summary) return this.$emit('onDelete')
      this.$confirm('确定删除吗？').then(() => {
        this.requireDelete()
      })
    },
    requireDelete() {
      this.loading = true
      postConferRecord({ id: this.inner_data.id, isRemoved: true })
        .then(() => {
          this.$emit('onDelete')
        })
        .finally(() => {
          this.loading = false
        })
    }
  }
}
</script>
<style lang="scss" scoped>
@import '@/styles/element-variables';
.selected {
  background-color: #0000002f;
  .user-name {
    color: $--color-primary !important;
  }
}
.single-item {
  width: 100%;
  overflow: hidden;
  transition: all 0.5s ease;
  display: flex;
  align-items: center;
  border-bottom: 1px solid #ccc;
  opacity: 0.8;
  cursor: pointer;
  user-select: none;
  &:hover {
    opacity: 1;
    .item-remove {
      margin-left: 0;
      margin-right: 0.5rem;
      opacity: 1;
    }
    .item-remove-active {
      opacity: 0;
    }
  }
  .margin-left {
    margin-left: 0.5rem;
  }
  padding: 0.2rem 0.5rem 0.2rem 0.5rem;
  .item-remove {
    transition: all 0.5s ease;
    display: flex;
    :hover {
      color: #f00;
    }
    margin-left: -1rem;
    opacity: 0;
    color: #888;
  }
  .user-name {
    font-size: 10px;
    color: #888;
    width: 80%;
  }
  .user-description {
    text-align: right;
    margin-right: 0.5rem;
    width: 100%;
    color: #666;
  }
}
</style>
