<template>
  <el-row class="row">
    <el-button
      class="setting-btn"
      type="text"
      @click="showSetting = true"
    >设置</el-button>
    <EventConfig v-model="searchSetting" :show.sync="showSetting" :name="database" :key-name="title" />
    <div v-if="!engineOnly">
      <h2
        :style="{
          'text-align': 'center',
          'font-size': `${3 * size}rem`,
          height: `${3 * size}rem`,
          'line-height': `${3 * size}rem`
        }"
      >
        {{ title }}
      </h2>
      <el-card v-infinite-scroll="onScrollToBottom" class="styled-primary-card">
        <div
          ref="primary_container"
          v-loading="loading"
          :style="{
            position: 'relative',
            transition: 'all ease 1.5s',
            top: auto_play_top_value
          }"
        >
          <div v-if="innerList && innerList.length">
            <SingleItem
              v-for="(i, index) in innerList"
              :key="i.id"
              :size="size"
              :index="index"
              :data="i"
              :show-stick-content="
                index === 0 || innerList[index - 1].tag.banner !== i.tag.banner
              "
              :focus="i.id === focusId"
              @itemClick="handleItemClick(i)"
            />
            <el-button
              v-if="haveNext"
              :loading="loading"
              type="text"
              style="width:100%"
              @click="requireRefresh"
            >{{ loading ? "加载中..." : "点击加载更多记录" }}</el-button>
            <div v-else class="divider" />
          </div>
          <NoData v-show="!innerList || !innerList.length" />
        </div>
      </el-card>
    </div>
  </el-row>
</template>

<script>
import { eventList } from '@/api/securityManage/security-event/event'
import { debounce, parseTime } from '@/utils'
export default {
  name: 'EventList',
  components: {
    SingleItem: () => import('./SingleItem'),
    NoData: () => import('@/views/Loading/NoData'),
    EventConfig: () => import('./EventConfig')
  },
  model: {
    prop: 'list',
    event: 'change'
  },
  props: {
    title: { type: String, default: '' },
    database: { type: String, required: true },
    autoExpand: { type: Boolean, default: true },
    list: { type: Array, default: () => [] }, // 同步数据输出
    showAddNewItem: { type: Boolean, default: false },
    type: { type: Number, default: 0 },
    size: { type: Number, default: 1 },
    engineOnly: { type: Boolean, default: false },
    defaultConfig: { type: Object, default: null }
  },
  data: () => ({
    loading: false,
    focusId: null,
    focusIndex: -1,
    auto_focuser: null,
    auto_loader: null,
    auto_play_top: 0,
    auto_play_top_player: null,
    auto_reload: null,
    page: {
      pageIndex: 0,
      pageSize: 10
    },
    totalCount: -1,
    inner_list: [],
    showSetting: false,
    searchSetting: {
      databaseName: null,
      securityEventType: null,
      securityEventPeriod: null,
      eventType: null,
      eventTag: null,
      company: null,
      title: null,
      detail: null,
      summary: null,
      type: null,
      tag: null,
      time: null,
      filterDate: null,
    }
  }),
  computed: {
    dict() {
      return this.$store.state.secEvent.securityEventTypesDict
    },
    auto_play_top_value() {
      return `${this.auto_play_top}rem`
    },
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
    }
  },
  watch: {
    defaultConfig: {
      handler (v) {
        this.searchSetting = v
      },
      deep: true,
      immediate: true
    },
    database: {
      handler (val) {
        const { searchSetting } = this
        if (!searchSetting) return
        searchSetting.databaseName = val
      },
      immediate: true
    },
    list: {
      handler(val) {
        this.innerList = val
      },
      immediate: true
    },
    searchSetting: {
      handler (val) {
        this.reload()
      },
      deep: true
    }
  },
  mounted() {
    this.auto_loader = setInterval(this.requireRefresh, 5e3)
    this.auto_reload = setInterval(this.reload, 3600e3)
    this.reload()
    this.next_play_top()
    this.focusNext()

    this.$store.dispatch('secEvent/initDictionary')
  },
  destroyed() {
    clearTimeout(this.auto_loader)
    clearTimeout(this.auto_play_top_player)
    clearInterval(this.auto_focuser)
  },
  methods: {
    next_play_top() {
      this.auto_play_top -= 10
      const v = this.$refs.primary_container
      if (v && v.offsetHeight + v.offsetTop < 700 * this.size) {
        this.auto_play_top = 0
      }
      const time = 3e3 + Math.random() * 2e3
      this.auto_play_top_player = setTimeout(this.next_play_top, time
      )
    },
    focusNext() {
      this.focusIndex += 1
      if (this.focusIndex >= this.innerList.length) {
        this.focusIndex = 0
        this.auto_play_top = 0
      }
      const item = this.innerList[this.focusIndex]
      if (item) {
        this.focusId = item.id
      }
      this.auto_focuser = setTimeout(this.focusNext, 3e3 + Math.random() * 2e3)
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
    convert_card(item, index) {
      const type = this.dict[item.type]
      item.type = (type && type.fullName) || '未知类型'
      item.tag = {
        title: parseTime(item.date, '{y}年'),
        banner: item.type,
        desc: null
      }
      item.content =
        item.summary || item.detail && `${item.detail.substring(0, 50)}${item.detail.length > 50 ? '...' : ''}`
      if (!item.content)item.content = '无内容'
      return item
    },
    refresh() {
      if (this.loading || !this.haveNext || !this.dict) return
      this.loading = true
      const { searchSetting, page } = this
      eventList(Object.assign({ page }, searchSetting))
        .then(data => {
          const length = this.innerList.length + 1 // 当前序号
          let previous_item = null // 记录上一个项目用于去重
          const tmp_list = this.innerList.concat(
            data.list.map((i, index) => this.convert_card(i, index + length))
          )
          this.innerList = tmp_list.map(r => {
            if (!r.tag.title || r.tag.title === previous_item) {
              r.tag.title = null
            } else {
              previous_item = r.tag.title
            }
            return r
          })
          this.totalCount = data.totalCount
          this.page.pageIndex += 1

          this.$emit('change', this.innerList)
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
.setting-btn {
  position: absolute;
  top: -0.1rem;
  left: 0.4rem;
}
@import "../../style";
@import "@/views/dashboard/Statistics/style";
</style>
