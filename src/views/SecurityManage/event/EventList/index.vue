<template>
  <el-row class="row">
    <el-card v-infinite-scroll="onScrollToBottom" class="main-card">
      <el-divider />
      <div v-loading="loading">
        <div v-if="innerList && innerList.length">
          <SingleItem
            v-for="(i,index) in innerList"
            :key="i.id"
            :index="index"
            :data="i"
            :show-stick-year="index===0||innerList[index-1].tag.year!==i.tag.year"
            :focus="i.id===conferenceId"
            @itemClick="handleItemClick(i)"
          />
          <el-button
            v-if="haveNext"
            :loading="loading"
            type="text"
            style="width:100%"
            @click="requireRefresh"
          >{{ loading?'加载中...':'点击加载更多记录' }}</el-button>
          <div v-else class="divider" />
        </div>
        <NoData v-show="!innerList || !innerList.length" />
      </div>
    </el-card>
  </el-row>
</template>

<script>
const item_time_getter = i => new Date(i.create)
import { tag_all_item } from '@/utils/timeline-handler'
import { companyConferList } from '@/api/zzxt/party-conference/confer'
import { debounce, parseTime } from '@/utils'
export default {
  name: 'ConferenceList',
  components: {
    SingleItem: () => import('./SingleItem'),
    NoData: () => import('@/views/Loading/NoData')
  },
  props: {
    autoExpand: { type: Boolean, default: true },
    list: { type: Array, default: () => [] },
    showAddNewItem: { type: Boolean, default: false },
    type: { type: Number, default: 0 },
    conferenceId: { type: String, default: null },
    company: { type: String, default: null },
    group: { type: String, default: null }
  },
  data: () => ({
    loading: false,
    page: {
      pageIndex: 0,
      pageSize: 5
    },
    totalCount: -1,
    inner_list: [],
    errorMsg: null,
    conferenceContent: null
  }),
  computed: {
    requireRefresh() {
      return debounce(() => {
        this.refresh()
      }, 1e2)
    },
    haveNext() {
      const { page } = this
      const total = this.totalCount
      const current = page.pageIndex * page.pageSize
      return total === -1 || current <= total
    },
    innerList: {
      get() {
        return this.inner_list
      },
      set(val) {
        this.inner_list = val
        this.$emit('update:list', val)
      }
    },
    partyGroupItemDict() {
      return this.$store.state.party.partyGroupItemDict
    },
    conferTypesDict() {
      return this.$store.state.party.conferTypesDict
    }
  },
  watch: {
    list: {
      handler(val) {
        this.innerList = val
      },
      immediate: true
    },
    company: {
      handler(val) {
        this.reload()
      }
    },
    group: {
      handler(val) {
        this.reload()
      }
    }
  },
  mounted() {
    this.reload()
  },
  methods: {
    initConference() {
      const { group, type } = this
      const userId = this.$store.state.user.userid
      const g = this.partyGroupItemDict[group]
      const t = this.conferTypesDict[type]
      const groupName = (g && g.name) || '未定的党团组织'
      const typeName = (t && t.alias) || '未定的类型会议'
      const now = parseTime(new Date(), '{m}月{d}日')
      const result = {
        title: `${now} - ${typeName}`,
        type,
        content: `在${groupName}召开${typeName}，就XXXX进行讨论。\n经过${typeName}，产生XXXX成果、XXXX成果和XXXXX成果，达到了预期效果。`,
        createByGroup: group,
        host: { userId },
        startTime: parseTime(Math.ceil(new Date() / 1800e3) * 1800e3),
        length: 7200
      }
      return result
    },
    handleItemClick(i) {
      i.show = !i.show
      this.$emit('requireDetail', i.id)
    },
    reload() {
      this.clear_data()
      this.$nextTick(() => {
        this.requireRefresh()
      })
    },
    clear_data() {
      this.innerList = []
      this.page.pageIndex = 0
    },
    onScrollToBottom() {
      this.requireRefresh()
    },
    refresh() {
      if (this.loading || !this.haveNext) return
      this.loading = true
      const { page, type, group, company } = this
      companyConferList({ page, partyConferenceType: type, company, partyGroup: group })
        .then(data => {
          this.innerList = this.innerList.concat(data.list)
          this.totalCount = data.totalCount
          this.page.pageIndex += 1
          tag_all_item(this.innerList, item_time_getter)
        })
        .finally(() => {
          this.loading = false
        })
    }
  }
}
</script>

<style lang="scss" scoped>
.divider {
  height: 1px;
  background-color: #dcdfe6;
  margin: 0.5rem 0.2rem;
}
.right-button {
  transition: all 1s ease;
  position: absolute;
  right: -10rem;
  overflow: hidden;
  z-index: 1;
  .el-button--medium {
    padding: 0 !important;
  }
}
.main-card {
  position: relative;
  :hover {
    .right-button {
      right: 0.5rem;
    }
  }
}
</style>
