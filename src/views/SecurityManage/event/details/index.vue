<template>
  <el-row v-loading="loading||!innerConferenceId" :gutter="20" :style="item_style">
    <el-col :md="14" :sm="24">
      <EventBaseInfo
        v-model="conference"
        @requireRefresh="onBaseInfoChange(true)"
      />
      <ConferRecordContent
        v-if="conference"
        v-model="recordContents"
        v-loading="record_content_loading"
        :user-record-dict="userRecordDict"
        :user-records="userRecords"
        :total-count="recordContentCount"
        :conference="conference"
        style="margin-top:2rem"
        :pages.sync="recordContentPages"
        @onDelete="handleRecordContentsDelete"
        @requireRefresh="refreshRecordContents"
      />
    </el-col>
    <el-col :md="10" :sm="24">
      <ConferRecords
        v-if="conference"
        v-model="userRecords"
        v-loading="record_loading"
        :conference="conference"
        :total-count="userRecordCount"
        :focus-users.sync="focusUsers"
        :pages.sync="recordPages"
        style="max-height:80%"
        @onDelete="handleRecordsDelete"
        @requireRefresh="refreshRecords"
      />
    </el-col>
  </el-row>
</template>
<script>
import { getConferDetail } from '@/api/zzxt/party-conference/confer'
import { transition_Array } from '@/utils/data-handle'
import {
  getConferRecord,
  getConferRecordContent
} from '@/api/zzxt/party-conference/record'
const key = 'conferenceId'
export default {
  name: 'ConferDetails',
  components: {
    EventBaseInfo: () => import('./EventBaseInfo'),
    ConferRecords: () => import('./ConferRecords'),
    ConferRecordContent: () => import('./ConferRecordContent')
  },
  model: {
    prop: 'conferenceId',
    event: 'change'
  },
  props: {
    conferenceId: { type: String, default: null }
  },
  data: () => ({
    conference: null,
    userRecords: [],
    recordPages: {},
    userRecordCount: 0,
    userRecordDict: null,
    focusUsers: [],
    recordContents: [],
    recordContentPages: {},
    recordContentCount: 0,
    innerConferenceId: null,
    inner_loading: false,
    item_style: { transition: 'all ease 0.5s', transform: null },
    record_loading: false,
    record_content_loading: false
  }),
  computed: {
    currentCompany() {
      return this.$store.state.user.globalCompany
    },
    conferTypesDict() {
      return this.$store.state.party.conferTypesDict
    },
    conferRecordTypesDict() {
      return this.$store.state.party.conferRecordTypesDict
    },
    conferContentHost() {
      return this.$store.state.party.conferContentHost
    },
    loading: {
      set(val) {
        if (val === this.inner_loading) return
        this.inner_loading = val
      },
      get() {
        return this.inner_loading
      }
    }
  },
  watch: {
    conferenceId: {
      handler(val) {
        this.innerConferenceId = val
        if (!val) return localStorage.removeItem(key)
        localStorage.setItem(key, val)
      },
      immediate: true
    },
    innerConferenceId: {
      handler(val) {
        if (!val) return
        this.$nextTick(() => {
          this.refresh()
        })
      },
      immediate: true
    },
    focusUsers: {
      handler(val) {
        this.refreshRecordContents()
      },
      deep: true
    },
    currentCompany: {
      handler(val) {
        if (val) this.loadConferId()
      },
      immediate: true
    }
  },
  mounted() {
    this.$store.dispatch('party/initDictionary')
    this.loadConferId()
  },
  methods: {
    loadConferId() {
      if (this.conferenceId) return
      const id = this.$route.query.id || localStorage.getItem(key)
      this.innerConferenceId = id
      this.$emit('change', id)
    },
    onBaseInfoChange(onlyBase) {
      this.$emit('conferenceChanged', this.conference)
      this.refresh(onlyBase)
    },
    // 用于刷新页面的数据
    refresh(onlyBase) {
      const id = this.innerConferenceId
      if (!id) return console.warn('会议id未设置')
      this.loading = true
      getConferDetail({ id })
        .then(data => {
          const r = data.model
          if (!r) return console.warn('详细信息不存在')
          const host = this.conferContentHost
          const records = r.userRecords
          if (r.conference && records && host) {
            r.conference.host = records.find(i => i.type === host.value)
          }
          this.conference = r.conference
          if (onlyBase) return
          transition_Array(this.userRecords, records, () => {
            this.userRecords = records
          })
          transition_Array(this.recordContents, r.recordContents, () => {
            this.recordContents = r.recordContents
          })
          this.userRecordCount = r.userRecordCount
          this.recordContentCount = r.recordContentCount
          this.refreshRecordDict(r.userRecords)
        })
        .catch(e => {
          switch (e.status) {
            case 51008: {
              this.$router.push('/')
            }
          }
        })
        .finally(() => {
          this.loading = false
        })
    },
    handleRecordsDelete(id) {
      const records = this.userRecords
      records.splice(records.findIndex(i => i.id === id), 1)
      this.userRecordCount--
    },
    handleRecordContentsDelete(id) {
      const contents = this.recordContents
      contents.splice(contents.findIndex(i => i.id === id), 1)
      this.recordContentCount--
    },
    refreshRecordDict(list) {
      const dict = {}
      list.map(i => {
        dict[i.id] = i
      })
      this.userRecordDict = dict
    },
    refreshRecords(page) {
      this.record_loading = true
      const id = this.innerConferenceId
      getConferRecord({ id, page })
        .then(data => {
          transition_Array(this.userRecords, data.list, () => {
            this.userRecords = data.list
          })
          this.userRecordCount = data.totalCount
        })
        .finally(() => {
          this.record_loading = false
        })
    },
    refreshRecordContents(page) {
      const pages = page || this.recordContentPages
      this.record_content_loading = true
      const conference = this.innerConferenceId
      const records = this.focusUsers
      getConferRecordContent({ conference, records, pages })
        .then(data => {
          transition_Array(this.recordContents, data.list, () => {
            this.recordContents = data.list
          })
          this.recordContentCount = data.totalCount
        })
        .finally(() => {
          this.record_content_loading = false
        })
    }
  }
}
</script>
