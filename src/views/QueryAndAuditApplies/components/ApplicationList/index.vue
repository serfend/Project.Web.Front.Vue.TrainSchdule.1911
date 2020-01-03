<template>
  <div>
    <el-table
      :key="tableKey"
      ref="singleTable"
      v-loading="onLoading"
      :data="formatedList"
      highlight-current-row
    >
      <el-table-column v-if="multi" type="selection" width="42px" />
      <el-table-column label="申请人" min-width="100px">
        <template slot-scope="{row}">
          <el-tooltip content="点击查看详情" effect="dark">
            <!-- content to trigger tooltip here -->
            <el-button plain size="mini" type="info" @click="handleDetail(row, row.id)">
              <i class="el-icon-info blue--text" />
              {{ row.base.realName }}
            </el-button>
          </el-tooltip>
          <el-button
            v-for="additialVocation in row.request.additialVocations"
            :key="additialVocation.name"
            plain
            size="mini"
            type="info"
          >
            <span class="info--text">{{ additialVocation.name }}</span>
          </el-button>
        </template>
      </el-table-column>
      <el-table-column align="center" label="单位">
        <template slot-scope="{row}">
          <span class="caption">{{ row.base.companyName }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="当前审批">
        <template slot-scope="{row}">
          <span class="caption">{{ row.nowAuditCompany }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="创建">
        <template slot-scope="scope">
          <span>{{ scope.row.create }}</span>
        </template>
      </el-table-column>
      <el-table-column header-align="center" align="center" label="休假时间" width="160">
        <template slot-scope="scope">
          <span>{{ scope.row.stampLeave+'-'+scope.row.stampReturn }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="休假地点">
        <template slot-scope="scope">
          <span>{{ scope.row.request.vocationPlace? scope.row.request.vocationPlace.name :'' }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="休假总天数">
        <template slot-scope="scope">
          <el-dropdown>
            <span class="el-dropdown-link">
              <span>{{ datedifference(scope.row.request.stampLeave, scope.row.request.stampReturn) + 1 }}天</span>
              <i class="el-icon-arrow-down el-icon--right" />
            </span>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item>正休假时长{{ scope.row.request.vocationLength }}天</el-dropdown-item>
              <el-dropdown-item>路途时长{{ scope.row.request.onTripLength }}天</el-dropdown-item>
              <el-dropdown-item
                v-for="additial in scope.row.request.additialVocations"
                v-show="scope.row.request.additialVocations.length>0"
                :key="additial.name"
              >{{ additial.name }} {{ additial.length }}天</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </template>
      </el-table-column>

      <el-table-column align="center" label="状态">
        <template slot-scope="{row}">
          <el-tag :color="row.statusColor" class="white--text">{{ row.statusDesc }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column align="center" label="操作" min-width="120">
        <template slot-scope="{row}">
          <slot v-if="myUserid" :applyid="row.id" :row="row" name="action" />
          <span v-else>
            请先
            <a href="login">登录</a>
          </span>
        </template>
      </el-table-column>
    </el-table>
    

    <el-card>
      <Pagination
        :pagesetting="pages"
        @updatepage="updatepage"
        @handleCurrentChange="searchData"
        @handleSizeChange="searchData"
      />
    </el-card>
  </div>
</template>
<script>
import { format } from 'timeago.js'
import moment from 'moment'
import { detail } from '@/api/apply'
import ApplicationDetail from './ApplicationDetail'
import waves from '@/directive/waves' // waves directive
import { parseTime, datedifference } from '@/utils'
moment.locale('zh-cn')

export default {
  name: 'ApplicationList',
  directives: { waves },
  components: {
    ApplicationDetail
  },
  props: {
    dataList: {
      type: Array,
      default() {
        return []
      }
    },
    onLoading: {
      type: Boolean,
      default: false
    },
    multi: {
      type: Boolean,
      default: false
    }
  },

  data() {
    return {
      tableKey: 0,
      detailDrawer: {
        show: false,
        data: null,
        basic: null,
        id: null
      },
      list: [],
      listLoading: true,
      downloadLoading: false
    }
  },
  computed: {
    formatedList() {
      var statusOptions = this.$store.state.vocation.statusDic
      return this.dataList.map(li => {
        const { ...item } = li
        const statusObj = statusOptions[item.status]
        item.statusDesc = statusObj ? statusObj.desc : '不明类型'
        item.statusColor = statusObj ? statusObj.color : 'gray'
        item.acessable = statusObj ? statusObj.acessable : []
        var stampLeave = new Date(item.request.stampLeave)
        item.stampLeave =
          stampLeave.getMonth() + 1 + '月' + stampLeave.getDate() + '日' // moment(item.request.stampLeave).format('LLLL')
        var stampReturn = new Date(item.request.stampReturn)
        item.stampReturn =
          stampReturn.getMonth() + 1 + '月' + stampReturn.getDate() + '日' // moment(item.request.stampReturn).format('LLLL')
        item.create = format(item.create, 'zh_CN')
        // item.stampLeave = parseTime(item.stampLeave, 'YYYY年MM月dd日')
        // item.stampReturn = parseTime(item.stampReturn, 'YYYY年MM月dd日')
        // item.create = parseTime(item.create, 'YYYY年MM月dd日')
        return item
      })
    },
    myUserid() {
      return this.$store.state.user.userid
    }
  },
  async created() {},
  methods: {
    LoadPage() {
      this.$emit('LoadPage')
    },
    datedifference(date1, date2) {
      return datedifference(date1, date2)
    },
    countOtherTime(row) {
      // 休假其他时间
      return (
        datedifference(row.stampLeave, row.stampReturn) -
        row.onTripLength -
        row.vocationLength
      )
    },
    getChecked() {
      // 获取选中的
      return this.$refs['singleTable'].selection
    },
    changeApply(oper) {
      const { id } = this.detailDrawer
      const matchedItemIndex = this.formatedList.findIndex(
        item => item.id === id
      )
      const listLen = this.formatedList.length
      let nextIndex = 0
      // 上一个
      if (oper === 'prev') {
        nextIndex =
          matchedItemIndex - 1 < 0 ? listLen - 1 : matchedItemIndex - 1
      } else if (oper === 'next') {
        nextIndex =
          matchedItemIndex + 1 > listLen - 1 ? 0 : matchedItemIndex + 1
      }
      const newRow = this.formatedList[nextIndex]
      const newId = newRow.id
      this.$refs.singleTable.setCurrentRow(newRow)
      this.handleDetail(newRow, newId)
    },

    /**
     * 查询详情
     */
    handleDetail(row, id) {
      detail(id).then(data => {
        if (data) {
          this.detailDrawer.show = true
          this.detailDrawer.data = data
          this.detailDrawer.basic = row
          this.detailDrawer.id = id
        }
      })
    },

    /**
     * 执行导出
     */
    handleDownload() {
      this.downloadLoading = true
      import('@/vendor/Export2Excel').then(excel => {
        const tHeader = ['timestamp', 'title', 'type', 'importance', 'status']
        const filterVal = ['timestamp', 'title', 'type', 'importance', 'status']
        const data = this.formatJson(filterVal, this.list)
        excel.export_json_to_excel({
          header: tHeader,
          data,
          filename: 'table-list'
        })
        this.downloadLoading = false
      })
    },

    /**
     * 格式json数据
     */
    formatJson(filterVal, jsonData) {
      return jsonData.map(v =>
        filterVal.map(j => {
          if (j === 'timestamp') {
            return parseTime(v[j])
          } else {
            return v[j]
          }
        })
      )
    },

    /**
     * 请求刷新
     */
    emitRefresh() {
      this.$emit('refresh')
    }
  }
}
</script>

<style lang='scss'>
.p-fixed {
  position: fixed !important;
  top: 0;
  bottom: 0;
  background: white;
}
.f-right {
  right: 0 !important;
}
.el-dialog.apply-detail {
  margin-right: 0;
  z-index: 10000;
  .el-dialog__header,
  .apply-detail-header {
    background: #304156;
    color: whitesmoke;
  }
}
.el-dialog.apply-detail .el-dialog__body {
  padding: 0;
}
</style>

