<template>
  <div>
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
          slot="action"
          slot-scope="{applyid, row}"
          :applyid="applyid"
          :row="row"
          name="action"
        />
      </ApplicationDetail>
    </el-dialog>
    <el-table ref="singleTable" v-loading="loading" :data="formatedList" highlight-current-row>
      <el-table-column type="selection" width="42px" />
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
              <el-dropdown-item>正休假{{ scope.row.request.vocationLength }}天</el-dropdown-item>
              <el-dropdown-item>路途{{ scope.row.request.onTripLength }}天</el-dropdown-item>
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
          <slot :applyid="row.id" :row="row" name="action" />
        </template>
      </el-table-column>
    </el-table>

    <AuditApplyMutilDialog
      :show.sync="multiAuditFormShow"
      :responselist="multiAuditFormSelection"
    />
    <el-button v-show="!multiAuditFormShow" @click="showMutilAudit">批量审批</el-button>
    <Pagination :pagesetting.sync="pagesetting" :hidden="formatedList.length===0" />
  </div>
</template>
<script>
import { format } from 'timeago.js'
import moment from 'moment'
import { detail } from '@/api/apply'
import ApplicationDetail from './ApplicationDetail'
import AuditApplyMutilDialog from '../AuditApplyMutilDialog'
import { datedifference } from '@/utils'
import Pagination from '@/components/Pagination'
moment.locale('zh-cn')

export default {
  name: 'ApplicationList',
  components: {
    ApplicationDetail,
    AuditApplyMutilDialog,
    Pagination
  },
  props: {
    list: {
      type: Array,
      default() {
        return []
      }
    },
    loading: {
      type: Boolean,
      default: false
    },
    pages: {
      type: Object,
      default() {
        return {}
      }
    }
  },

  data() {
    return {
      detailDrawer: {
        show: false
      },
      multiAuditFormShow: false,
      multiAuditFormSelection: []
    }
  },
  computed: {
    pagesetting: {
      get() {
        return this.pages
      },
      set(val) {
        this.$emit('update:pages', val)
      }
    },
    formatedList() {
      var statusOptions = this.$store.state.vocation.statusDic
      return this.list.map(li => {
        const { ...item } = li
        const statusObj = statusOptions[item.status]
        item.statusDesc = statusObj ? statusObj.desc : '不明类型'
        item.statusColor = statusObj ? statusObj.color : 'gray'
        item.acessable = statusObj ? statusObj.acessable : []
        var stampLeave = new Date(item.request.stampLeave)
        item.stampLeave =
          stampLeave.getMonth() + 1 + '月' + stampLeave.getDate() + '日'
        var stampReturn = new Date(item.request.stampReturn)
        item.stampReturn =
          stampReturn.getMonth() + 1 + '月' + stampReturn.getDate() + '日'
        item.create = format(item.create, 'zh_CN')
        return item
      })
    },
    myUserid() {
      return this.$store.state.user.userid
    }
  },
  methods: {
    datedifference,
    countOtherTime(row) {
      return (
        datedifference(row.stampLeave, row.stampReturn) -
        row.onTripLength -
        row.vocationLength
      )
    },
    showMutilAudit() {
      this.multiAuditFormSelection = this.getChecked()
      this.multiAuditFormShow = true
    },
    getChecked() {
      return this.$refs['singleTable'].selection
    },
    changeApply(oper) {
      const { id } = this.detailDrawer
      const matchedItemIndex = this.formatedList.findIndex(
        item => item.id === id
      )
      const listLen = this.formatedList.length
      let nextIndex = 0
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
    handleDetail(row, id) {
      var info = `${row.base.realName}的休假申请详情`
      this.$message.info(info)
      detail(id).then(data => {
        this.$message.success(info)
        this.detailDrawer.show = true
        this.detailDrawer.data = data
        this.detailDrawer.basic = row
        this.detailDrawer.id = id
      })
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

