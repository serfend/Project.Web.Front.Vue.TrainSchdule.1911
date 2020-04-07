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
              effect="dark"
              size="mini"
              :type="row.request.vocationType==='正休'?'':'danger'"
            >{{ row.request.vocationType }}</el-tag>
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
          <div v-if="row.nowStep">
            <el-tooltip effect="light">
              <div slot="content">
                可审批的共有 {{ row.nowStep.membersFitToAudit.length }} 人，共需要 {{ row.nowStep.requireMembersAcceptCount }} 人
                <el-card style="padding:10px">
                  已审核
                  <el-tag
                    v-for="p in GetUserByArray(row.nowStep.membersAcceptToAudit)"
                    :key="p.name"
                  >
                    <div v-if="p.duties">{{ p.duties }}({{ p.realName }})</div>
                    <div v-else>{{ p.realName }}({{ p.name }})</div>
                  </el-tag>
                </el-card>
                <el-card style="padding:10px">
                  待审核
                  <el-tag
                    v-for="p in GetUserByArray(row.nowStep.membersFitToAudit.concat(row.nowStep.membersAcceptToAudit).filter(v=>!row.nowStep.membersFitToAudit.includes(v)||!row.nowStep.membersAcceptToAudit.includes(v)))"
                    :key="p.name"
                  >
                    <div v-if="p.duties">{{ p.duties }}({{ p.realName }})</div>
                    <div v-else>{{ p.realName }}({{ p.name }})</div>
                  </el-tag>
                </el-card>
              </div>
              <el-tag
                class="caption"
              >{{ row.nowStep.index+1 }}/{{ row.steps.length }}步 {{ row.nowStep.firstMemberCompanyName }}</el-tag>
            </el-tooltip>
          </div>
          <el-tooltip v-else content="未明确审批流程的休假。可能存在问题，请联系人力审查。">
            <span>{{ row.auditStreamSolution }}</span>
          </el-tooltip>
        </template>
      </el-table-column>
      <el-table-column header-align="center" align="center" label="休假时间">
        <template slot-scope="{row}">
          <el-row>
            <el-tooltip content="申请被创建的时间">
              <span>{{ row.create }}</span>
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
      v-show="!multiAuditFormShow"
      style="width:100%"
      type="success"
      @click="showMutilAudit"
    >批量审批</el-button>
    <Pagination
      :pagesetting.sync="pagesetting"
      :hidden="formatedList.length===0"
      @updated="$emit('updated')"
    />
  </div>
</template>
<script>
import { format } from 'timeago.js'
import AuditApplyMutilDialog from '../AuditApplyMutilDialog'
import { datedifference } from '@/utils'
import Pagination from '@/components/Pagination'

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
    }
  },
  watch: {
    list: {
      handler(val) {
        var statusOptions = this.$store.state.vocation.statusDic
        this.formatedList = this.list.map(li =>
          this.formatApplyItem(li, statusOptions)
        )
      },
      immediate: true,
      deep: true
    }
  },
  methods: {
    GetUserByArray(userIdArr) {
      var result = []
      for (var i = 0; i < userIdArr.length; i++) {
        var item = {
          name: userIdArr[i],
          realName: ''
        }
        result.push(item)
      }
      return result
    },
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
      if (column.label === '操作') return
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
.pull-left {
  float: left !important;
}
.pull-right {
  float: right !important;
}
</style>

