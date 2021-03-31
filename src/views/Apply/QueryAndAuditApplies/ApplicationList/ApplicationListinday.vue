<template>
  <div>
    <el-table
      v-if="requestTypesDic"
      ref="singleTable"
      v-loading="loading"
      :data="formatedList"
      highlight-current-row
      stripe
      header-align="center"
      :span-method="arraySpanMethod"
      @row-dblclick="showDetail"
    >
      <el-table-column type="selection" />
      <el-table-column label="基本">
        <template slot-scope="{ row }">
          <component :is="!rowCanShow(row) ? 'ElTooltip' : 'div'" effect="light">
            <div slot="content">
              <VacationType
                v-if="rowCanShow(row)"
                v-model="row.request.requestType"
                :entity-type="entityType"
              />
              <el-link
                :href="`#/user/profile?id=${row.userBase.id}`"
                target="_blank"
              >{{ row.userBase.realName }}</el-link>
              <el-tooltip v-if="row.userBase.realName != row.base.realName" content="用户原姓名">
                <span>({{ row.base.realName }})</span>
              </el-tooltip>
              <div>
                <el-link
                  :href="`#/dashboard?companyCode=${row.userBase.companyCode}`"
                  target="_blank"
                >{{ getCDdes(row.userBase, row.base) }}</el-link>
              </div>
            </div>
            <div
              v-if="!rowCanShow(row)"
              style="
                font-size: 1rem;
                color: #ccc;
                letter-spacing: 1rem;
                text-align: center;
              "
            >申请已被撤回</div>
          </component>
        </template>
      </el-table-column>
      <el-table-column header-align="center" align="center" label="创建时间">
        <template v-if="rowCanShow(row)" slot-scope="{ row }">
          <el-tooltip effect="light" :content="`创建于:${row.create}`">
            <span>{{ formatTime(row.create) }}</span>
          </el-tooltip>
        </template>
      </el-table-column>
      <el-table-column header-align="center" align="center" label="请假时间">
        <template v-if="rowCanShow(row)" slot-scope="{ row }">
          <span>
            <el-tooltip effect="light" :content="`离队时间:${parseTime(row.stampLeave)}`">
              <div>{{ formatTime(row.stampLeave,null,true) }}</div>
            </el-tooltip>
            <el-tooltip effect="light" :content="`归队时间:${parseTime(row.stampReturn)}`">
              <div>{{ formatTime(row.stampReturn,null,true) }}</div>
            </el-tooltip>
          </span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="外出去向">
        <template v-if="rowCanShow(row)" slot-scope="{ row }">
          <el-tooltip effect="light">
            <div slot="content">
              <div v-if="row.request.vacationPlaceName">
                <b>详细地址</b>
                <span style="width:10rem">{{ row.request.vacationPlaceName }}</span>
              </div>
              <div v-if="row.request.reason">
                <b>请假原因</b>
                <span style="width:10rem">{{ row.request.reason }}</span>
              </div>
              <div>
                <b>出行方式</b>
                <TransportationType v-model="row.request.byTransportation" />
              </div>
            </div>
            <span>{{ row.request.vacationPlace ? row.request.vacationPlace.name : '未选择' }}</span>
          </el-tooltip>
        </template>
      </el-table-column>
      <el-table-column align="center" label="状态" min-width="150rem">
        <template v-if="rowCanShow(row)" slot-scope="{ row }">
          <div style="display:flex">
            <div style="width:20rem">
              <IndayApplyProgress
                :stamp-leave="row.request && row.request.stampLeave"
                :stamp-return="row.request && row.request.stampReturn"
                :execute-id="row.executeStatusId"
                :show="true"
              />
            </div>
            <el-tooltip content="此申请可能为外出结束后创建">
              <el-tag v-if="row.checkIfIsReplentApply" color="#ff0000" class="white--text">补充申请</el-tag>
            </el-tooltip>
            <el-tag v-if="row.type.isPlan" color="#cccccc" class="white--text">计划</el-tag>
            <ApplyAuditStreamPreview
              v-if="row.statusDesc"
              :audit-status="row.steps"
              :title="row.auditStreamSolution"
              :now-step="row.nowStep ? row.nowStep.index : row.steps.length"
            >
              <el-tag
                slot="content"
                :color="row.statusColor"
                class="white--text"
                style="cursor:pointer;margin-left:0.5rem"
              >{{ row.statusDesc }}</el-tag>
            </ApplyAuditStreamPreview>
          </div>
        </template>
      </el-table-column>
      <el-table-column align="center" label="操作">
        <template v-if="rowCanShow(row)" slot-scope="{ row }">
          <slot :row="row" name="action" />
        </template>
      </el-table-column>
    </el-table>
    <AuditApplyMutilDialog
      :show.sync="multiAuditFormShow"
      :responselist="multiAuditFormSelection"
      :entity-type="entityType"
      @updated="$emit('updated')"
    />
    <el-button
      v-show="!multiAuditFormShow && list.length > 1"
      style="width: 100%; font-size: 1rem; letter-spacing: 1.5rem"
      type="success"
      @click="showMutilAudit"
    >审批当前选中项</el-button>
    <Pagination
      :pagesetting.sync="pagesetting"
      :total-count="pagesTotalCount"
      :hidden="formatedList.length === 0"
    />
    <el-dialog :visible.sync="apply_detail_focus" width="80%">
      <h1 slot="title" style="text-align:center">详细信息</h1>
      <component :is="`${entityType}ApplyDetail`" :focus-id="apply_detail_focus_id" />
    </el-dialog>
  </div>
</template>

<script>
import { formatTime, parseTime, relativeDate, datedifference } from '@/utils'
import { get_item_type } from '@/utils/vacation'
export default {
  name: 'ApplicationList',
  components: {
    AuditApplyMutilDialog: () => import('../AuditApplyMutilDialog'),
    Pagination: () => import('@/components/Pagination'),
    ApplyAuditStreamPreview: () =>
      import('@/components/ApplicationApply/ApplyAuditStreamPreview'),
    vacationApplyDetail: () =>
      import('@/views/Apply/ApplyDetail/VacationApplyDetail'),
    indayApplyDetail: () =>
      import('@/views/Apply/ApplyDetail/IndayApplyDetail'),
    VacationType: () => import('@/components/Vacation/VacationType'),
    TransportationType: () =>
      import('@/components/Vacation/TransportationType'),
    IndayApplyProgress: () =>
      import('@/views/Apply/MyApply/components/ApplyCard/IndayApplyProgress')
  },
  props: {
    list: {
      type: Array,
      default() {
        return []
      }
    },
    loading: { type: Boolean, default: false },
    pages: {
      type: Object,
      default() {
        return {}
      }
    },
    pagesTotalCount: { type: Number, default: 0 },
    entityType: { type: String, default: 'vacation' }
  },
  data: () => ({
    multiAuditFormShow: false,
    multiAuditFormSelection: [],
    apply_detail_focus_id: null,
    formatedList: [] // 经过格式化过的主列表
  }),
  computed: {
    requestTypesDic() {
      return this.$store.state.vacation.requestTypes
    },
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
    },
    apply_detail_focus: {
      set(val) {
        if (!val) {
          this.apply_detail_focus_id = null // only set if null
        }
      },
      get() {
        return this.apply_detail_focus_id !== null
      }
    }
  },
  watch: {
    list: {
      handler(val) {
        this.formatedList = val.map(li => this.formatApplyItem(li))
      },
      deep: true
    }
  },
  methods: {
    formatTime,
    parseTime,
    relativeDate,
    datedifference,
    rowCanShow(row) {
      return row.status !== 20 // 状态：撤回
    },
    arraySpanMethod({ row, column, rowIndex, columnIndex }) {
      if (!this.rowCanShow(row)) {
        if (columnIndex === 1) {
          return [1, 8]
        } else {
          return [0, 0]
        }
      }
    },
    getCDdes(row, prevRow) {
      const cn = row.companyName
      const prevCn = prevRow.companyName
      const dn = row.dutiesName
      const prevDn = prevRow.dutiesName
      const result = [cn, dn]
      if (cn !== prevCn || dn !== prevDn) {
        result.push('(')
        result.push(prevCn)
        result.push(prevDn)
        result.push(')')
      }
      return result.join(' ')
    },
    formatApplyItem(li) {
      const statusObj = this.statusOptions[li.status]
      li.statusDesc = statusObj ? statusObj.desc : '未知状态'
      li.statusColor = statusObj ? statusObj.color : 'gray'
      li.acessable = statusObj ? statusObj.acessable : []
      if (!this.rowCanShow(li)) return li
      const stampLeave = new Date(li.request.stampLeave)
      const stampReturn = new Date(li.request.stampReturn)
      li.stampLeave = stampLeave
      li.stampReturn = stampReturn
      li.checkIfIsReplentApply = stampLeave <= new Date(li.create)
      li.type = get_item_type(li)
      return li
    },
    countOtherTime(row) {
      return (
        datedifference(row.stampReturn, row.stampLeave) -
        row.onTripLength -
        row.vacationLength
      )
    },
    showMutilAudit() {
      this.multiAuditFormSelection = this.$refs.singleTable.selection
      this.multiAuditFormShow = true
    },
    showDetail(row, column, event) {
      if (column.label === '操作') return
      this.apply_detail_focus_id = row.id
      // this.$router.push(`/vacation/applyDetail?id=${row.id}`)
    }
  }
}
</script>

<style lang='scss'>
</style>