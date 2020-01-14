<template>
  <div>
    <el-table
      ref="singleTable"
      v-loading="loading"
      :data="formatedList"
      highlight-current-row
      @row-dblclick="showDetail"
    >
      <el-table-column type="selection" width="42px" />
      <el-table-column label="申请人" min-width="100px">
        <template slot-scope="{row}">
          <el-tag>{{ row.base.realName }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column align="center" label="休假类别">
        <template slot-scope="{row}">
          <el-tag
            effect="dark"
            :type="row.request.vocationType==='正休'?'':'danger'"
          >{{ row.request.vocationType }}</el-tag>
        </template>
      </el-table-column>

      <el-table-column align="center" label="职务">
        <template slot-scope="{row}">
          <el-tag class="caption">{{ row.base.dutiesName }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column align="center" label="单位">
        <template slot-scope="{row}">
          <el-tag class="caption">{{ row.base.companyName }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column align="center" label="当前审批">
        <template slot-scope="{row}">
          <el-tag class="caption">{{ row.nowAuditCompanyName }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column align="center" label="创建">
        <template slot-scope="{row}">
          <span>{{ row.create }}</span>
        </template>
      </el-table-column>
      <el-table-column header-align="center" align="center" label="休假时间" width="160">
        <template slot-scope="{row}">
          <el-tag>{{ row.stampLeave }}</el-tag>
          <el-tag>{{ row.stampReturn }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column align="center" label="休假地点">
        <template slot-scope="{row}">
          <span>{{ row.request.vocationPlace? row.request.vocationPlace.name :'' }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="休假总天数">
        <template slot-scope="{row}">
          <el-dropdown>
            <span class="el-dropdown-link">
              <span>{{ datedifference(row.request.stampLeave, row.request.stampReturn) + 1 }}天</span>
              <i class="el-icon-arrow-down el-icon--right" />
            </span>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item>正休假{{ row.request.vocationLength }}天</el-dropdown-item>
              <el-dropdown-item>路途{{ row.request.onTripLength }}天</el-dropdown-item>
              <el-dropdown-item
                v-for="additial in row.request.additialVocations"
                v-show="row.request.additialVocations.length>0"
                :key="additial.name"
              >
                <el-tooltip :content="additial.description">
                  <el-tag>{{ additial.name }} {{ additial.length }}天</el-tag>
                </el-tooltip>
              </el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </template>
      </el-table-column>

      <el-table-column align="center" label="状态">
        <template slot-scope="{row}">
          <el-tooltip content="此申请可能为休假结束后创建">
            <el-tag v-if="row.checkIfIsReplentApply" color="#ff0000" class="white--text">补充申请</el-tag>
          </el-tooltip>
          <el-tag :color="row.statusColor" class="white--text">{{ row.statusDesc }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column align="center" label="操作" min-width="120">
        <template slot-scope="{row}">
          <slot :row="row" name="action" />
        </template>
      </el-table-column>
    </el-table>
    <AuditApplyMutilDialog
      :show.sync="multiAuditFormShow"
      :responselist="multiAuditFormSelection"
      @updated="$emit('updated')"
    />
    <el-button v-show="!multiAuditFormShow" @click="showMutilAudit">批量审批</el-button>
    <Pagination
      :pagesetting.sync="pagesetting"
      :hidden="formatedList.length===0"
      @updated="$emit('updated')"
    />
  </div>
</template>
<script>
import { format } from 'timeago.js'
import moment from 'moment'
import AuditApplyMutilDialog from '../AuditApplyMutilDialog'
import { datedifference } from '@/utils'
import Pagination from '@/components/Pagination'
moment.locale('zh-cn')

export default {
  name: 'ApplicationList',
  components: {
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
      return this.list.map(li => this.formatApplyItem(li, statusOptions))
    },
    myUserid() {
      return this.$store.state.user.userid
    }
  },
  methods: {
    formatApplyItem(li, statusOptions) {
      const { ...item } = li
      const statusObj = statusOptions[item.status]
      item.statusDesc = statusObj ? statusObj.desc : '不明类型'
      item.statusColor = statusObj ? statusObj.color : 'gray'
      item.acessable = statusObj ? statusObj.acessable : []
      var stampLeave = new Date(item.request.stampLeave)
      item.checkIfIsReplentApply = stampLeave <= new Date(item.create)
      var nowYear = new Date().getFullYear()
      item.stampLeave = `${
        stampLeave.getFullYear() !== nowYear
          ? stampLeave.getFullYear() + '年'
          : ''
      }${stampLeave.getMonth() + 1}月${stampLeave.getDate()}日`
      var stampReturn = new Date(item.request.stampReturn)
      item.stampReturn = `${
        stampReturn.getFullYear() !== nowYear
          ? stampReturn.getFullYear() + '年'
          : ''
      }${stampReturn.getMonth() + 1}月${stampReturn.getDate()}日`
      item.create = format(item.create, 'zh_CN')
      return item
    },
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
    showDetail(row, column, event) {
      this.$store.state.vocation.vacationDetail = row
      this.$router.push('/application/applyDetail')
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

