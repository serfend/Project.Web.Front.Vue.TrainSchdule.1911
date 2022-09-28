<template>
  <el-row class="row">
    <h2 style="text-align: center;font-size:3rem;">{{ title }}</h2>
    <el-card v-infinite-scroll="onScrollToBottom" class="main-card">
      <div ref="primary_container" v-loading="loading" :style="{position:'relative',transition:'all ease 1.5s',top:auto_play_top_value}">
        <div v-if="innerList && innerList.length">
          <SingleItem
            v-for="(i, index) in innerList"
            :key="i.id"
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
  </el-row>
</template>

<script>
import { eventList } from '@/api/securityManage/security-event/event'
import { debounce, parseTime } from '@/utils'
export default {
  name: 'EventList',
  components: {
    SingleItem: () => import('./SingleItem'),
    NoData: () => import('@/views/Loading/NoData')
  },
  props: {
    title: { type: String, default: '' },
    database: { type: String, required: true },
    autoExpand: { type: Boolean, default: true },
    list: { type: Array, default: () => [] }, // 同步数据输出
    showAddNewItem: { type: Boolean, default: false },
    type: { type: Number, default: 0 },
  },
  data: () => ({
    loading: false,
    focusId: null,
    focusIndex: -1,
    auto_focuser: null,
    auto_loader: null,
    auto_play_top: 0,
    auto_play_top_player: null,
    page: {
      pageIndex: 0,
      pageSize: 10
    },
    totalCount: -1,
    inner_list: [],
    errorMsg: null,
    conferenceContent: null
  }),
  computed: {
    auto_play_top_value () {
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
    list: {
      handler(val) {
        this.innerList = val
      },
      immediate: true
    }
  },
  mounted () {
    this.auto_loader = setInterval(this.requireRefresh, 5e3)
    this.reload()
    this.next_play_top()
    this.focusNext()
  },
  destroyed() {
    clearTimeout(this.auto_loader)
    clearTimeout(this.auto_play_top_player)
    clearInterval(this.auto_focuser)
  },
  methods: {
    next_play_top () {
      this.auto_play_top -= 10
      const v = this.$refs.primary_container
      if (v.offsetHeight + v.offsetTop < 700) this.auto_play_top = 0
      this.auto_play_top_player = setTimeout(this.next_play_top, 3e3 + Math.random() * 2e3)
    },
    focusNext () {
      this.focusIndex += 1
      if (this.focusIndex >= this.innerList.length) {
        this.focusIndex = 0
        this.auto_play_top = 0
      }
      const item = this.innerList[this.focusIndex]
      if (item) { this.focusId = item.id }
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
      item.tag = {
        title: parseTime(item.record, '{y}年'),
        banner: item.type,
        desc: null
      }
      item.title = item.name
      item.content =
        item.summary || (item.detail && item.detail.substring(0, 20))
      return item
    },
    refresh() {
      if (this.loading || !this.haveNext) return
      this.loading = true
      const { database, page } = this
      eventList({ database_name: database, page })
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
@import "../../style";
@import "@/views/dashboard/Statistics/style";
.main-card {
  position: relative;
  @include common();
  :hover {
    .right-button {
      right: 0.5rem;
    }
  }
}
</style>
