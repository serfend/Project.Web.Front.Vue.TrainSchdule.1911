<template>
  <div>
    <el-table
      ref="singleTable"
      v-loading="loading"
      :data="formatedList"
      highlight-current-row
      stripe
      header-align="center"
      @row-dblclick="showDetail"
    >
      <el-table-column type="selection" />
      <el-table-column label="基本">
        <template slot-scope="{row}">
          <el-row>
            <el-tag
              v-if="row.request.vacationType"
              effect="dark"
              size="mini"
              :type="row.request.vacationType==='正休'?'':'danger'"
            >{{ row.request.vacationType }}</el-tag>
            <span
              style="font-size:10px;margin:2px;color:#3f3f3f"
            >{{ row.base.companyName }} {{ row.base.dutiesName }}</span>
          </el-row>
          <el-row>
            <span>{{ row.base.realName }}</span>
          </el-row>
        </template>
      </el-table-column>
      <el-table-column align="center" label="当前审批">
        <template slot-scope="{row}">
          <ApplyAuditStreamPreview
            slot="content"
            :audit-status="row.steps"
            :title="row.auditStreamSolution"
            :now-step="row.nowStep?row.nowStep.index:row.steps.length"
          />
        </template>
      </el-table-column>
      <el-table-column header-align="center" align="center" label="休假时间">
        <template slot-scope="{row}">
          <el-row>
            <el-tooltip :content="`创建于:${row.create}`">
              <span>{{ format(row.create, 'zh_CN') }}</span>
            </el-tooltip>
          </el-row>
          <el-row>
            <el-tooltip content="休假起始和结束的时间">
              <span>{{ row.stampLeave }}-{{ row.stampReturn }}</span>
            </el-tooltip>
          </el-row>
        </template>
      </el-table-column>
      <el-table-column align="center" label="休假地点">
        <template slot-scope="{row}">
          <el-tooltip
            :content="`详细地址:${row.request.vacationPlaceName?row.request.vacationPlaceName:'未填写'}`"
          >
            <span>{{ row.request.vacationPlace? row.request.vacationPlace.name :'未选择' }}</span>
          </el-tooltip>
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
              <el-dropdown-item>正休假{{ row.request.vacationLength }}天</el-dropdown-item>
              <el-dropdown-item>路途{{ row.request.onTripLength }}天</el-dropdown-item>
              <el-dropdown-item
                v-for="additial in row.request.additialVacations"
                v-show="row.request.additialVacations.length>0"
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
          <el-tag
            v-if="row.statusDesc"
            :color="row.statusColor"
            class="white--text"
          >{{ row.statusDesc }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column align="center" label="操作">
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
    <el-button
      v-show="!multiAuditFormShow&&list.length>1"
      style="width:100%"
      type="success"
      @click="showMutilAudit"
    >批量审批</el-button>
    <Pagination
      :pagesetting.sync="pagesetting"
      :total-count="pagesTotalCount"
      :hidden="formatedList.length===0"
    />
  </div>
</template>
<script>
import { format } from 'timeago.js'
import AuditApplyMutilDialog from '../AuditApplyMutilDialog'
import { datedifference } from '@/utils'
import Pagination from '@/components/Pagination'
import ApplyAuditStreamPreview from '@/components/ApplicationApply/ApplyAuditStreamPreview'

export default {
  name: 'ApplicationList',
  components: {
    AuditApplyMutilDialog,
    Pagination,
    ApplyAuditStreamPreview
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
    },
    pagesTotalCount: {
      type: Number,
      default: 0
    }
  },
  data() {
    return {
      multiAuditFormShow: false,
      multiAuditFormSelection: [],
      formatedList: [] // 经过格式化过的主列表
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
    myUserid() {
      return this.$store.state.user.userid
    },
    statusOptions() {
      return this.$store.state.vacation.statusDic
    }
  },
  watch: {
    list: {
      handler(val) {
        this.formatedList = val.map(li =>
          this.formatApplyItem(li)
        )
      },
      deep: true
    }
  },
  methods: {
    format,
    formatApplyItem(li) {
      const { ...item } = li
      const statusObj = this.statusOptions[item.status]
      item.statusDesc = statusObj ? statusObj.desc : '不明类型'
      item.statusColor = statusObj ? statusObj.color : 'gray'
      item.acessable = statusObj ? statusObj.acessable : []
      var stampLeave = new Date(item.request.stampLeave)
      item.checkIfIsReplentApply = stampLeave <= new Date(item.create)
      var nowYear = new Date().getFullYear()
      var nowYearDes = stampLeave.getFullYear() !== nowYear
        ? `${stampLeave.getFullYear()}年`
        : ''
      item.stampLeave = `${nowYearDes}${stampLeave.getMonth() + 1}月${stampLeave.getDate()}日`
      var stampReturn = new Date(item.request.stampReturn)
      var stampReturnYearDes = stampReturn.getFullYear() !== nowYear
        ? `${stampReturn.getFullYear()}年`
        : ''
      item.stampReturn = `${stampReturnYearDes}${stampReturn.getMonth() + 1}月${stampReturn.getDate()}日`
      return item
    },
    datedifference,
    countOtherTime(row) {
      return (
        datedifference(row.stampLeave, row.stampReturn) -
        row.onTripLength -
        row.vacationLength
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
      if (column.label === '操作') return
      this.$router.push(`/application/applyDetail?id=${row.id}`)
    }
  }
}
</script>

<style lang='scss'>
</style>

