<template>
  <div v-loading="loading" class="float-item">
    <el-tag
      :type="pageUnreadCount ? 'danger' : 'info'"
      effect="dark"
      :class="[
        (pageUnreadCount || failLoad) ? 'warning-light' : 'warning-normal',
        failLoad ? 'warning-disabled' : 'warning-item'
      ]"
      @click="onShowDetail"
    >
      <el-badge :value="pageUnreadCount" :hidden="!pageUnreadCount" :max="99">
        <span>告警事件</span>
        <span v-if="failLoad">({{ failLoad.message }})</span>
        <span v-else-if="pageUnreadCount">[{{ firstEventMessage }}]</span>
      </el-badge>
      <el-dialog
        :visible.sync="showDialog"
        append-to-body
        class="styled-primary-dialog"
      >
        <el-card class="styled-primary-card">
          <template #header>
            <h2>告警事件</h2>
          </template>
          <el-table
            :data="events"
            :row-class-name="tableRowClassName"
            class="styled-primary-table"
            @row-click="onEventClick"
          >
            <el-table-column label="告警时间">
              <template slot-scope="{ row }">{{
                parseTime(row.create)
              }}</template>
            </el-table-column>
            <el-table-column label="告警名称">
              <template slot-scope="{ row }">{{ row.title }}</template>
            </el-table-column>
            <el-table-column label="摘要信息">
              <template slot-scope="{ row }">{{ row.summary }}</template>
            </el-table-column>
          </el-table>
          <el-button type="text" style="width:100%;margin:auto" @click="onMarkAllAsRead">全部标记为已读</el-button>
          <el-row style="text-align:center">
            <Pagination
              class="styled-primary-pagination"
              :pagesetting.sync="pages"
              :total-count="pageTotalCount"
              layout="total,prev,pager,next,jumper"
              small
              background
              hide-on-single-page
            />
          </el-row>
        </el-card>
      </el-dialog>
      <el-dialog
        v-loading="loading"
        :visible.sync="showDetailDialog"
        append-to-body
        class="styled-primary-dialog"
      >
        <el-card v-if="cur_event" class="styled-primary-card">
          <template #header>
            <h1>{{ cur_event.title }}告警</h1>
          </template>
          <el-form label-width="5rem">
            <el-form-item label="告警时间">{{ cur_event.create }}</el-form-item>
            <el-form-item label="告警名称">{{ cur_event.title }}</el-form-item>
            <el-form-item label="告警内容">
              <div class="warning-detail-content">
                <div
                  v-for="(x, index) in (
                    (cur_event.detail && cur_event.detail.split('。')) ||
                    []
                  ).filter(x => x)"
                  :key="index"
                >
                  {{ x }}。
                </div>
              </div>
            </el-form-item>
            <el-button type="primary" :disabled="!cur_event.reference" @click="onShowReference">查看详情</el-button>
            <el-button type="danger" @click="onDeleteItem">删除</el-button>
            <el-button
              type="info"
              @click="showDetailDialog = false"
            >返回</el-button>
          </el-form>
        </el-card>
      </el-dialog>
    </el-tag>
  </div>
</template>
<script>
import {
  securityWarnings,
  markAsRead
} from '@/api/securityManage/security-event/warning'
import { parseTime } from '@/utils'
export default {
  name: 'SecurityWarning',
  components: {
    Pagination: () => import('@/components/Pagination'),
  },
  data: () => ({
    loading: false,
    failLoad: null,
    lastRead: null,
    events: [],
    cur_event: null,
    showDetailDialog: false,

    refresher: null,
    pages: {
      pageIndex: 0,
      pageSize: 10
    },
    pageTotalCount: 0,
    pageUnreadCount: 0,
    showDialog: false
  }),
  computed: {
    firstEventMessage () {
      const unread = this.events.find(x => !this.isRead(x))
      if (!unread) return null
      return `${unread.title} ${unread.summary}`
    }
  },
  mounted() {
    this.refresher = setInterval(this.refresh, 60e3)
    this.refresh()
  },
  destroyed() {
    clearInterval(this.refresher)
  },
  methods: {
    parseTime,
    isRead(row) {
      if (!row) return true
      const create = new Date(row.create)
      if (new Date(row.lastRead) > create) return true // 单个已读
      if (new Date(this.lastRead) > create) return true // 全局已读
      return false
    },
    tableRowClassName({ row, rowIndex }) {
      const v = this.isRead(row) ? 'row-read' : 'row-unread'
      return [v, 'row-common']
    },
    refresh() {
      this.loading = true
      const query = Object.assign({}, this.pages)
      securityWarnings(query)
        .then(data => {
          const model = data.model
          this.lastRead = new Date(model.lastRead)
          this.pageTotalCount = model.totalCount
          this.pageUnreadCount = model.unreadCount
          this.events = model.list
          this.failLoad = null
        })
        .catch(e => {
          this.failLoad = e
          this.events = []
          this.pageTotalCount = 0
          this.pageUnreadCount = 0
        })
        .finally(() => {
          this.loading = false
        })
    },
    onShowDetail () {
      if (this.failLoad) return this.$message.warning(`无法查看,因为${this.failLoad.message}`)
      this.showDialog = true
    },
    onEventClick(row, column, event) {
      this.cur_event = row
      this.showDetailDialog = true
      this.$nextTick(() => {
        this.onMarkAsReadItem()
      })
    },
    onDeleteItem() {
      this.cur_event.isRemoved = true
      this.onMarkAsReadItem().then(() => {
        this.$message.success('已处理')
      })
    },
    onMarkAllAsRead () {
      this.onMarkAsReadItem(false, true).then(() => {
      })
    },
    onMarkAsReadItem(isFetch, isMarkAll) {
      this.loading = true
      const { cur_event } = this
      const dict = {
        0: () => [
          {
            id: cur_event.id,
            isRemoved: cur_event.isRemoved
          }
        ],
        1: () => [], // 获取数据
        2: () => [null], // 全局标记
        3: () => [] // 无效
      }
      const v = (isFetch ? 1 : 0) + (isMarkAll ? 2 : 0)
      const query = dict[v]()
      return markAsRead({ items: query })
        .then(data => {
          this.refresh()
        })
        .finally(() => {
          this.loading = false
        })
    },
    onShowReference () {
      const { cur_event } = this
      window.open(cur_event.reference)
    }
  }
}
</script>
<style lang="scss">
@import "../style";
.el-table .row-common {
  cursor: pointer;
  transition: all ease 0.5s;
  &:hover {
    opacity: 0.5;
  }
}
.el-table .row-unread .cell {
  color: #c50000 !important;
  font-weight: 800;
}
.el-table .row-read .cell {
  color: #979797 !important;
}
</style>

<style lang="scss" scoped>
.float-item {
  position: absolute;
  right: 1rem;
  top: 5rem;
  color: #ffffff;
}
.warning-disabled {
  cursor: not-allowed;
  background-color: #808080;
}
.warning-item {
  cursor: pointer;
  &:hover {
    background-color: #ffffff;
    color: #000000;
  }
  transition: all ease 0.5s;
}

.warning-normal {
  box-shadow: 0px 0px 10px 0px #ffffff;
}
.warning-light {
  box-shadow: 0px 0px 10px 0px #ff1e1e;
  animation: flashing 1s infinite;
  &:hover {
    animation: none;
  }
}
@keyframes flashing {
  0% {
    background-color: #d60c0c;
  }
  20% {
    background-color: #ffffff;
  }
  30% {
    background-color: #d60c0c;
  }
  50% {
    background-color: #ffffff;
  }

  100% {
    background-color: #d60c0c;
  }
}
.warning-detail-content {
  border: #000000 dashed 2px;
  border-radius: 1rem;
  padding: 0.5rem;
}
</style>
