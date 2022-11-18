<template>
  <el-dialog v-loading="loading" append-to-body :visible.sync="inner_show" width="35rem">
    <template #title>
      <h2>参会记录编辑</h2>
    </template>
    <el-collapse v-model="activeCollapses">
      <el-collapse-item v-for="type in type_list" :key="type.value" :name="type.value">
        <template #title>
          <div class="summary-title">
            <ConferRecordType class="min-margin" :type="type.value" />
            <span v-if="type.users && type.users.length" class="summary-title">
              <User
                v-for="u in type.users.slice(0,3)"
                :key="u.id"
                :userid="u.id"
                class="min-margin"
              />
              <span class="min-margin">{{ type.users.length>3?'等':'' }}{{ type.users.length }}人</span>
            </span>
            <span v-else>暂无用户</span>
          </div>
        </template>
        <el-card class="content-card">
          <div v-if="type.users" class="user-list">
            <div v-for="u in type.users" :key="u.id" class="single-item">
              <el-button
                class="item-remove"
                type="text"
                icon="el-icon-delete"
                @click="handleDelete(type,u)"
              />
              <span>{{ u.companyName }}</span>
              <span>{{ u.dutiesName }}</span>
              <User :userid="u.id" class="min-margin" />
            </div>
          </div>
          <el-button
            class="operation-btn"
            type="text"
            @click="handleShowUserSelect(type)"
          >添加新的参会人员记录</el-button>
        </el-card>
      </el-collapse-item>
    </el-collapse>
    <el-button
      v-show="!showNewType"
      type="success"
      style="width:100%"
      @click="showNewType = true"
    >添加新的类型</el-button>
    <span v-show="showNewType">
      <span>选择新类型</span>
      <ConferRecordTypeSelector
        :value="0"
        :value-range="[0,999]"
        :except="type_list.map(i=>i.value)"
        @change="handleNewType"
      />
    </span>
    <template #footer>
      <el-button type="text" style="color:#ccc" @click="inner_show = false">取消</el-button>
    </template>
    <el-dialog :visible.sync="showUserSelect" append-to-body>
      <template #title>
        <h2>选择成员</h2>
      </template>
      <GroupMemberSelector :except="exceptAlreadHasRecord" @submit="handleUserSelect" />
    </el-dialog>
  </el-dialog>
</template>

<script>
import { postConferRecord } from '@/api/zzxt/party-conference/record'
import { distinct } from '@/utils'
export default {
  name: 'ConferRecordEdit',
  components: {
    ConferRecordTypeSelector: () =>
      import('@/components/Party/ConferRecordType/ConferRecordTypeSelector'),
    ConferRecordType: () => import('@/components/Party/ConferRecordType'),
    User: () => import('@/components/User/UserFormItem'),
    GroupMemberSelector: () =>
      import('@/components/Party/PartyGroup/GroupMemberSelector')
  },
  props: {
    records: { type: Array, default: null, required: true },
    conference: { type: Object, default: null, required: true },
    show: { type: Boolean, default: false }
  },
  data: () => ({
    inner_records: null,
    inner_host: null,
    loading: false,
    showUserSelect: false,
    userSelectFocusType: 0,
    showNewType: false,
    activeCollapses: []
  }),
  computed: {
    conferRecordTypesDict() {
      return this.$store.state.party.conferRecordTypesDict
    },
    exceptAlreadHasRecord() {
      const type = this.userSelectFocusType
      const list = this.inner_records
        .filter(i => i.type === type)
        .map(i => i.userId)
      return list
    },
    record_dict() {
      const dict = {}
      const r = this.inner_records
      if (!r) return dict
      r.forEach(v => {
        dict[`${v.type}${v.userId}`] = v.id
      })
      return dict
    },
    type_list() {
      const r = this.inner_records
      const dict = this.conferRecordTypesDict
      if (!r || !dict) return []
      const list = distinct(r, v => v.type)
      const raw = () => ({ focus: null, users: [] })
      const mapper = v => Object.assign(raw(), dict[v.type])
      const result = list.map(mapper)
      const userDict = {}
      r.forEach(v => {
        if (!v.userSummary) return // 空类型占位
        const t = v.type
        if (!userDict[t]) userDict[t] = []
        userDict[t].push(v.userSummary)
      })
      result.forEach(v => {
        v.users = userDict[v.value]
      })
      return result
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
    records: {
      handler(val) {
        this.inner_records = val
      },
      immediate: true,
      deep: true
    }
  },
  methods: {
    postConferRecord,
    handleShowUserSelect(type) {
      this.showUserSelect = true
      this.userSelectFocusType = type.value
    },
    handleUserSelect(newUsers, cb) {
      this.loading = true
      const type = this.userSelectFocusType
      const conferenceId = this.conference.id
      const action = postConferRecord({
        type,
        userId: newUsers.map(u => u.userName),
        conferenceId
      })
      action
        .then(data => {
          this.showUserSelect = false
          if (cb) cb()
          this.$emit('requireRefresh')
        })
        .finally(() => {
          this.loading = false
        })
    },
    handleDelete(type, u) {
      const key = `${type.value}${u.id}`
      this.$emit('requireDelete', this.record_dict[key])
    },
    handleNewType(val) {
      this.showNewType = false
      this.inner_records.push({ type: val, id: new Date().getTime() })
      this.$nextTick(() => {
        this.activeCollapses.push(val)
      })
    }
  }
}
</script>
<style lang="scss" scoped>
.summary-title {
  display: flex;
  align-items: center;
}
.min-margin {
  margin-left: 0.5rem;
  overflow: hidden;
}
.user-list {
  row-gap: 0.5rem;
}
.single-item {
  width: 100%;
  overflow: hidden;
  transition: all 0.5s ease;
  display: flex;
  align-items: center;
  opacity: 0.8;
  cursor: pointer;
  user-select: none;
  border-bottom: #888 solid 1px;
  &:hover {
    opacity: 1;
    .item-remove {
      margin-left: 0;
      margin-right: 0.5rem;
      opacity: 1;
    }
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
}
@import '@/styles/animation';
.content-card {
  :hover {
    .operation-btn {
      width: 100%;
      animation: flashing-item 5s 1 ease;
    }
  }
  .operation-btn {
    width: 0%;
    transition: all ease 0.5s;
    font-size: 1rem;
  }
}
</style>
