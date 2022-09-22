<template>
  <el-dialog v-loading="loading" :visible.sync="inner_show">
    <template #title>
      <h2>发言编辑</h2>
    </template>
    <el-form v-if="inner_data" label-width="5rem">
      <el-form-item label="发言类型" required>
        <ConferRecordContentTypeSelector
          v-model="inner_data.contentType"
          :confer-type="conferType"
          :record-types="recordTypes"
        />
      </el-form-item>
      <el-form-item label="内容">
        <el-input v-model="inner_data.content" v-waves type="textarea" autosize />
      </el-form-item>
      <el-form-item label="发言人" required>
        <el-popover trigger="click">
          <template #reference>
            <el-button type="text">{{ focusDescription }}</el-button>
          </template>
          <el-card style="width:40rem">
            <el-alert
              v-show="recordTypes.length>1"
              type="warning"
            >注意：当选中的多个发言人的参会类型不一致时，他们所能选取发言类型可能不同导致部分类型不可选</el-alert>
            <el-alert type="info">注意：如需修改候选人列表，请在会议详情页切换</el-alert>
            <ConferRecords
              :records="userRecords"
              :focus-users.sync="focusUsers"
              :require-on-double="false"
            />
          </el-card>
        </el-popover>
      </el-form-item>
    </el-form>
    <template #footer>
      <el-button type="success" plain @click="submit">保存</el-button>
      <el-button type="text" style="color:#ccc" @click="inner_show = false">取消</el-button>
    </template>
  </el-dialog>
</template>

<script>
import { postConferRecordContent } from '@/api/zzxt/party-conference/record'
import waves from '@/directive/waves'
import { distinct } from '@/utils'
export default {
  name: 'ConferEdit',
  components: {
    ConferRecordContentTypeSelector: () =>
      import('@/components/Party/ConferRecordContentType/ConferRecordContentTypeSelector'),
    ConferRecords: () => import('../ConferRecords')
  },
  directives: {
    waves
  },
  props: {
    data: { type: Object, default: null },
    show: { type: Boolean, default: false },
    userRecords: { type: Array, default: null },
    userRecordDict: { type: Object, default: null },
    conferType: { type: Number, default: 0 }
  },
  data: () => ({
    inner_data: null,
    loading: false,
    focusUsers: []
  }),
  computed: {
    focusDescription() {
      const u = this.focusUsers
      if (!u || !u.length) return '未选中任何参会人'
      const dict = this.userRecordDict
      const first = dict[u.find(i => dict[i] && dict[i].userSummary)]
      const firstDesc = first ? `${first.userSummary.realName}等` : ''
      return `已选中${firstDesc}${u.length}人`
    },
    recordTypes() {
      const dict = this.userRecordDict // 当前选中的用户的发言类型
      if (!dict) return []
      const u = this.focusUsers
      return distinct(u.map(i => dict[i] && dict[i].type))
    },
    conferContentHost() {
      return this.$store.state.party.conferContentHost
    },
    theme() {
      return this.$store.state.settings.theme
    },
    inner_show: {
      get() {
        return this.show
      },
      set(val) {
        this.$emit('update:show', val)
      }
    }
  },
  watch: {
    data: {
      handler(val) {
        this.inner_data = val
      },
      immediate: true
    }
  },
  methods: {
    submit() {
      const item = this.inner_data
      const extend = { allowOverWrite: true, records: this.focusUsers }
      this.loading = true
      postConferRecordContent(Object.assign(extend, item))
        .then(() => {
          this.$message.success('发言编辑成功')
          this.$emit('requireRefresh')
          this.$emit('update:show', false)
        })
        .finally(() => {
          this.loading = false
        })
    }
  }
}
</script>
