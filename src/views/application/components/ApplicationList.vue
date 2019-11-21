<template>
  <el-card class="application-list">
    <div class="layout row justify-space-between px-2 pb-3">
      <el-button v-waves icon="el-icon-search" type="primary" @click="emitRefresh">刷新</el-button>
      <div>
        <slot name="headeraction" />
        <!-- <el-button
          v-waves
          :loading="downloadLoading"
          icon="el-icon-download"
          type="primary"
          @click="handleDownload"
        >导出</el-button>-->
      </div>
    </div>
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
              <span class="info--text">{{ row.base.realName }}</span>
            </el-button>
          </el-tooltip>
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
      <el-table-column header-align="center" label="申请时间">
        <el-table-column align="center" label="申请离队时间">
          <template slot-scope="scope">
            <span>{{ scope.row.stampLeave }}</span>
          </template>
        </el-table-column>
        <el-table-column align="center" label="预计归队时间">
          <template slot-scope="scope">
            <span>{{ scope.row.stampReturn }}</span>
          </template>
        </el-table-column>
      </el-table-column>
      <el-table-column align="center" label="休假地点">
        <template slot-scope="scope">
          <span>{{ scope.row.request.vocationPlace? scope.row.request.vocationPlace.name :"" }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="正休假时长" width="50">
        <template slot-scope="scope">
          <span>{{ scope.row.request.vocationLength }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="路途时长" width="50">
        <template slot-scope="scope">
          <span>{{ scope.row.request.onTripLength }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="其他假时长" width="50">
        <template slot-scope="scope">
          <span>{{ countOtherTime(scope.row.request) }}</span>
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
    <el-dialog
      :show-close="false"
      :visible.sync="detailDrawer.show"
      custom-class="p-fixed f-right apply-detail"
      top="0"
      width="408px"
    >
      <div slot="title" class="apply-detail-header">
        <div class="layout row justify-space-between align-center">
          详情
          <div class="d-flex align-center">
            <el-button-group>
              <el-button
                icon="el-icon-caret-left"
                size="small"
                type="primary"
                @click="changeApply('prev')"
              />
              <el-button
                icon="el-icon-caret-right"
                size="small"
                type="primary"
                @click="changeApply('next')"
              />
            </el-button-group>
            <el-tooltip content="关闭" effect="dark">
              <i class="el-icon-remove red--text title ml-2" @click="detailDrawer.show = false" />
              <!-- content to trigger tooltip here -->
            </el-tooltip>
          </div>
        </div>
      </div>
      <ApplicationDetail
        :apply-id="detailDrawer.id"
        :basic="detailDrawer.basic"
        :detail="detailDrawer.data"
      >
        <slot
          v-if="myUserid"
          slot="action"
          slot-scope="{applyid, row}"
          :applyid="applyid"
          :row="row"
          name="action"
        />
        <span v-else>
          请先
          <a href="login">登录</a>
        </span>
      </ApplicationDetail>
    </el-dialog>
    <!-- card body -->
  </el-card>
</template>

<script>
import { format } from 'timeago.js'
import moment from 'moment'
import { getAllStatus, detail } from '../../../api/apply'
import ApplicationDetail from './ApplicationDetail'
import waves from '@/directive/waves' // waves directive
import { parseTime } from '../../../utils'
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
      // @TODO 查询条件
      listQuery: {
        // page: 1,
        // limit: 20,
        // importance: undefined,
        // keyword: undefined,
        status: undefined,
        userid: '',
        company: ''
      },
      statusOptions: {},
      downloadLoading: false
    }
  },
  computed: {
    /**
     * 状态字典翻译
     */
    formatedList() {
      const { statusOptions } = this
      return this.dataList.map(li => {
        const { ...item } = li
        const statusObj = statusOptions[item.status]
        item.statusDesc = statusObj ? statusObj.desc : '不明类型'
        item.statusColor = statusObj ? statusObj.color : 'white'
        item.stampLeave = moment(item.request.stampLeave).format('LLLL')
        item.stampReturn = moment(item.request.stampReturn).format('LLLL')
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
  async created() {
    await this.getAllStatus()
  },
  // mounted() {
  //   detailDrawer
  // },
  methods: {
    countOtherTime(row) {
      return (
        this.datedifference(row.stampLeave, row.stampReturn) -
        row.onTripLength -
        row.vocationLength
      )
    },
    datedifference(sDate1, sDate2) {
      // sDate1和sDate2是2006-12-18格式
      var dateSpan, iDays
      sDate1 = Date.parse(sDate1)
      sDate2 = Date.parse(sDate2)
      dateSpan = sDate2 - sDate1
      dateSpan = Math.abs(dateSpan)
      iDays = Math.floor(dateSpan / (24 * 3600 * 1000))
      return iDays
    },
    getChecked() {
      // 获取选中的
      return this.$refs['singleTable'].selection
    },
    // 获取所有的状态字典
    getAllStatus() {
      return getAllStatus().then(status => {
        if (status.list) {
          this.statusOptions = status.list
        }
      })
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
      this.getAllStatus()
      this.$emit('refresh')
    }
  }
}
</script>

<style lang="scss">
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

