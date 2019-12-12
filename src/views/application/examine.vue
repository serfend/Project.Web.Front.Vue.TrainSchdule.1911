<template>
  <div class="application-examine ma-4">
    <el-card>
      <ApplySearchCommon
        ref="queryAppliesForm"
        :table-form="queryAppliesForm"
        :on-loading="onLoading"
        @searchData="searchData"
      >
        <template slot="ExtendForm">
          <el-form-item>
            <el-button icon="el-icon-edit" type="primary" @click="showMultiDialog">批量审核</el-button>
          </el-form-item>
          <el-form-item>
            <el-button icon="el-icon-edit" type="primary" @click="handleCreate">添加</el-button>
          </el-form-item>
          <el-form-item>
            <el-button
              icon="el-icon-download"
              type="primary"
              @click="exportUserApplies(queryAppliesForm.createFor.value===''?myUserid:queryAppliesForm.createFor.value)"
            >导出{{ queryAppliesForm.createFor.value===''?myUserid:queryAppliesForm.createFor.value }}申请</el-button>
            <el-button
              icon="el-icon-download"
              type="primary"
              @click="exportCompanyApplies(queryAppliesForm.createCompany.value===''?myCreateCompany:queryAppliesForm.createCompany.value )"
            >导出{{ queryAppliesForm.createCompany.value===''?myCreateCompany:queryAppliesForm.createCompany.value }}的申请</el-button>
          </el-form-item>
        </template>
      </ApplySearchCommon>

      <ApplicationList
        ref="applicationlist"
        :data-list="dataList"
        :on-loading="onLoading"
        multi
        @refresh="searchData"
      >
        <template slot="action" slot-scope="{row}">
          <el-button
            v-if="row.status==100&&row.recallId===null"
            size="mini"
            type="warning"
            @click="recallApply(row)"
          >召回</el-button>
          <div v-else-if="row.status>30&&row.status<100">
            <el-button-group>
              <el-button size="mini" type="success" @click="auditApply(row, 1)">通过</el-button>
              <el-button
                v-if="row.status!='publish'"
                size="mini"
                type="warning"
                @click="auditApply(row, 2)"
              >驳回</el-button>
            </el-button-group>
          </div>
          <el-button v-else-if="row.recallId!==null" @click="showRecallMsg(row)">召回信息</el-button>
        </template>
      </ApplicationList>

      <el-dialog :visible.sync="auditShow" title="提交审核" width="30%">
        <el-form ref="auditForm" :model="auditForm" label-width="80px">
          <el-form-item label="审核结果">
            <el-switch
              v-model="auditForm.action"
              :active-value="1"
              :inactive-value="2"
              active-color="#13ce66"
              active-text="通过"
              class="pt-2"
              inactive-color="#ff4949"
              inactive-text="驳回"
              style="display: block"
            />
          </el-form-item>
          <el-form-item label="备注">
            <el-input v-model="auditForm.remark" placeholder="请输入备注" type="textarea" />
          </el-form-item>
          <el-form-item label="安全码" prop="code">
            <el-input v-model="auditForm.code" placeholder="请输入安全码" />
          </el-form-item>
          <el-form-item label="审核人">
            <el-input v-model="auditForm.authByUserId" placeholder="请输入审核人的id" />
          </el-form-item>
        </el-form>
        <span slot="footer">
          <el-button @click="auditShow = false">取 消</el-button>
          <el-button type="primary" @click="SubmitAuditForm">确 定</el-button>
        </span>
      </el-dialog>

      <el-dialog :visible.sync="recallShow" title="召回" width="30%">
        <el-form ref="auditForm" :model="auditForm" label-width="80px">
          <el-form-item v-show="!isShowRecallWithSubmit" label="召回创建">
            <el-date-picker
              v-model="auditForm.recallData.create"
              format="yyyy-MM-dd"
              value-format="yyyy-MM-dd"
              disabled
            />
          </el-form-item>
          <el-form-item label="原归队时">
            <el-date-picker
              v-model="auditForm.recallData.rawStampReturn"
              format="yyyy-MM-dd"
              value-format="yyyy-MM-dd"
              disabled
            />
          </el-form-item>
          <el-form-item label="召回截止">
            <el-date-picker
              v-model="auditForm.stampReturn"
              format="yyyy-MM-dd"
              value-format="yyyy-MM-dd"
            />
          </el-form-item>
          <el-form-item label="备注">
            <el-input v-model="auditForm.remark" placeholder="请输入备注" type="textarea" />
          </el-form-item>
          <el-form-item v-show="isShowRecallWithSubmit" label="安全码">
            <el-input v-model="auditForm.code" placeholder="请输入安全码" />
          </el-form-item>
          <el-form-item label="审核人">
            <el-input v-model="auditForm.authByUserId" placeholder="请输入审核人的id" />
          </el-form-item>
        </el-form>
        <span slot="footer">
          <el-button-group v-if="isShowRecallWithSubmit">
            <el-button type="info" @click="recallShow = false">取 消</el-button>
            <el-button type="warning" @click="SubmitRecall">召 回</el-button>
          </el-button-group>
          <el-button v-else @click="isShowRecallWithSubmit=recallShow=false">确 定</el-button>
        </span>
      </el-dialog>
      <el-dialog
        :visible.sync="multiAuditForm.show"
        custom-class="p-fixed f-right mr-0"
        title="批量审核"
        top="0"
        width="408px"
      >
        <el-form ref="auditForm" :model="auditForm" label-width="80px">
          <el-form-item label="审核结果">
            <el-switch
              v-model="auditForm.action"
              :active-value="1"
              :inactive-value="2"
              active-color="#13ce66"
              active-text="通过"
              class="pt-2"
              inactive-color="#ff4949"
              inactive-text="驳回"
              style="display: block"
            />
          </el-form-item>
          <el-form-item label="备注" prop="remark">
            <el-input v-model="auditForm.remark" placeholder="请输入备注" type="textarea" />
          </el-form-item>
          <el-form-item label="安全码" prop="code">
            <el-input v-model="auditForm.code" placeholder="请输入安全码" />
          </el-form-item>
          <el-form-item label="审核人" prop="authByUserId">
            <el-input v-model="auditForm.authByUserId" placeholder="请输入审核人的id" />
          </el-form-item>
        </el-form>
        <span slot="footer">
          <el-button @click="multiAuditForm.show = false">取 消</el-button>
          <el-button type="primary" @click="SubmitMultiAuditForm">确 定</el-button>
        </span>
      </el-dialog>
    </el-card>
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
import ApplicationList from './components/ApplicationList'
import ApplySearchCommon from './components/ApplySearchCommon'
import Pagination from '../pagination'

import {
  audit,
  postRecallOrder,
  getRecallOrder,
  queryList
} from '../../api/apply'
import { getOnMyManage } from '../../api/usercompany'
// import { getMembers } from '../../api/company'
import {
  exportUserApplies,
  exportApply,
  exportCompanyApplies
} from '../../api/static'
// 将导出的方法以mixins的方式注入到vm实例
const mixins = {
  methods: {
    exportUserApplies,
    exportApply,
    exportCompanyApplies,
    download(data) {
      if (!data) {
        return
      }
      const url = window.URL.createObjectURL(new Blob([data]))
      const link = document.createElement('a')
      link.style.display = 'none'
      link.href = url
      link.setAttribute('download', 'excel.xlsx')

      document.body.appendChild(link)
      link.click()
    }
  }
}
export default {
  name: 'ApplyExamine',
  components: {
    ApplicationList,
    ApplySearchCommon,
    Pagination
  },
  mixins: [mixins],
  data() {
    return {
      pages: {
        pageIndex: 1,
        pageSize: 20,
        totalCount: 10
      },
      queryAppliesForm: {
        code: '',
        addTime: '',
        stampLeaveTime: '',
        stampReturnTime: '',
        status: {
          status: '',
          end: '',
          arrays: []
        },
        create: {
          start: '',
          end: ''
        },
        createFor: {
          value: ''
        },
        createBy: {
          value: ''
        },
        auditBy: {
          value: ''
        },
        auditByCompany: {
          value: ''
        },
        createCompany: {
          value: ''
        },
        stampLeave: {
          start: '',
          end: ''
        },
        stampReturn: {
          start: '',
          end: ''
        }
      },
      myManages: [],
      dataList: [],
      onLoading: false,
      membersOption: [],
      cacheMembers: [],
      auditShow: false,
      auditForm: this.auditFormInit(),
      // 批量审批表单
      multiAuditForm: {
        show: false
      },
      isShowRecallWithSubmit: false, // 当前的召回窗口是用于提交还是用于显示结果
      recallShow: false // 打开召回弹窗
    }
  },
  computed: {
    myAuditCompany() {
      return this.$store.state.user.data.companycode
    },
    myCreateCompany() {
      return this.$store.state.user.data.companycode
    },
    myUserid() {
      return this.$store.state.user.userid
    }
  },
  created() {
    this.queryAppliesForm.auditByCompany.value = this.myAuditCompany
    this.getOnMyManage()
    this.searchData()
  },
  methods: {
    auditFormInit() {
      return {
        recallData: {
          create: '',
          stampReturn: '',
          rawStampReturn: '',
          recallBy: {}
        },
        action: 1,
        remark: '',
        code: '',
        authByUserId: this.myUserid
      }
    },
    updatepage(newpage) {
      this.pages = newpage
      this.searchData()
    },
    LoadPage() {
      this.searchData()
    }, // 滚动加载
    showMultiDialog() {
      this.clearAuditForm()
      this.multiAuditForm.show = true
    },
    SubmitMultiAuditForm() {
      this.$refs['auditForm'].validate(valid => {
        if (!valid) return
        var dataList = this.$refs['applicationlist'].getChecked()
        var list = []
        const { action, remark, code, authByUserId } = this.auditForm
        for (var i = 0; i < dataList.length; i++) {
          list.push({ id: dataList[i].id, action, remark })
        }
        const Auth = { code, authByUserId: authByUserId }
        audit({ list }, Auth)
          .then(resultlist => {
            resultlist.forEach(result => {
              if (result.status === 0) {
                this.$notify.success('已审批' + result.id)
              } else this.$notify.error(result.message + ':' + result.id)
              this.searchData()
            })
          })
          .catch(err => {
            this.$message.error(err.message)
          })
          .finally(() => {
            this.clearAuditForm()
            this.multiAuditForm.show = false
          })
      })
    },
    clearAuditForm() {
      this.auditForm = this.auditFormInit()
    },
    SubmitAuditForm() {
      const { applyId, action, remark, code, authByUserId } = this.auditForm
      const list = [{ id: applyId, action, remark }]
      const Auth = { code, authByUserId }
      this.auditShow = false
      audit({ list }, Auth)
        .then(resultlist => {
          resultlist.forEach(result => {
            if (result.status === 0) {
              this.$notify.success('已审批' + result.id)
            } else this.$notify.error(result.message + ':' + result.id)
            this.searchData()
          })
        })
        .catch(err => {
          this.$message.error(err.message)
        })
        .finally(() => {
          this.clearAuditForm()
        })
    },

    SubmitRecall() {
      const model = {
        apply: this.auditForm.applyId,
        reason: this.auditForm.remark,
        returnStamp: this.auditForm.stampReturn,
        recallBy: this.myUserid
      }
      const Auth = {
        code: this.auditForm.code,
        authByUserId: this.auditForm.authByUserId
      }
      postRecallOrder({
        data: model,
        Auth: Auth
      })
        .then(result => {
          this.$notify.success('已召回' + result.id)
          this.searchData()
        })
        .catch(err => {
          this.$message.error(err.message)
        })
        .finally(() => {
          this.clearAuditForm()
          this.recallShow = false
        })
    },
    showRecallMsg(row) {
      this.clearAuditForm()
      this.recallShow = true
      this.auditForm.recallData.rawStampReturn = row.request.stampReturn
      getRecallOrder(row.recallId).then(res => {
        this.auditForm.recallData.create = res.create
        this.auditForm.recallData.stampReturn = res.returnStamp
        this.auditForm.remark = res.reason
        this.auditForm.authByUserId = res.recallBy.realName
      })
    },
    recallApply(row) {
      // 打开召回弹框
      this.clearAuditForm()
      this.recallShow = true
      this.isShowRecallWithSubmit = true
      this.auditForm.applyId = row.id
      this.auditForm.recallData.rawStampReturn = row.request.stampReturn
    },
    auditApply(row, action) {
      this.clearAuditForm()
      this.auditShow = true
      this.auditForm.applyId = row.id
      this.auditForm.action = action
    },
    handleCreate() {
      this.$router.push('/application/new')
    },
    getOnMyManage() {
      this.membersOption = []
      this.cacheMembers = []
      this.queryForm = {
        companycode: '',
        userId: '',
        isSearchUser: false
      }
      getOnMyManage()
        .then(data => {
          this.myManages = data.list || []
        })
        .catch(err => {
          console.warn(err)
        })
    },
    // 查询数据
    searchData(sForm) {
      if (this.onLoading === true) {
        return this.$message.warning('查询中，请等候')
      }
      this.onLoading = true
      this.dataList = []

      var tmpqueryAppliesForm = {}
      if (sForm) {
        this.queryAppliesForm = sForm
      }

      tmpqueryAppliesForm.pages = {
        pageIndex: this.pages.pageIndex - 1,
        pageSize: this.pages.pageSize
      }
      if (this.queryAppliesForm.addTime && this.queryAppliesForm.addTime[0]) {
        tmpqueryAppliesForm.create = {
          start: this.queryAppliesForm.addTime[0],
          end: this.queryAppliesForm.addTime[1]
        }
      }

      if (
        this.queryAppliesForm.stampLeaveTime &&
        this.queryAppliesForm.stampLeaveTime[0]
      ) {
        tmpqueryAppliesForm.stampLeave = {
          start: this.queryAppliesForm.stampLeaveTime[0],
          end: this.queryAppliesForm.stampLeaveTime[1]
        }
      }
      if (
        this.queryAppliesForm.stampReturnTime &&
        this.queryAppliesForm.stampReturnTime[0]
      ) {
        tmpqueryAppliesForm.stampReturn = {
          start: this.queryAppliesForm.stampReturnTime[0],
          end: this.queryAppliesForm.stampReturnTime[1]
        }
      }
      if (this.queryAppliesForm.status.arrays.length > 0) {
        tmpqueryAppliesForm['status'] = {
          arrays: this.queryAppliesForm.status.arrays
        }
      }
      if (this.queryAppliesForm.createFor.value) {
        tmpqueryAppliesForm['createFor'] = {
          value: this.queryAppliesForm.createFor.value
        }
      }

      if (this.queryAppliesForm.createBy.value) {
        tmpqueryAppliesForm['createBy'] = {
          value: this.queryAppliesForm.createBy.value
        }
      }
      if (this.queryAppliesForm.auditBy.value) {
        tmpqueryAppliesForm['auditBy'] = {
          value: this.queryAppliesForm.auditBy.value
        }
      }

      if (this.queryAppliesForm.auditByCompany.value) {
        tmpqueryAppliesForm['auditByCompany'] = {
          value: this.queryAppliesForm.auditByCompany.value
        }
      }
      if (this.queryAppliesForm.createCompany.value) {
        tmpqueryAppliesForm['createCompany'] = {
          value: this.queryAppliesForm.createCompany.value
        }
      }
      queryList(tmpqueryAppliesForm)
        .then(data => {
          const list = data.list
          this.dataList = list || []
          this.pages.totalCount = data.totalCount
        })
        .finally(() => {
          return (this.onLoading = false)
        })
    }
  }
}
</script>

<style lang='scss' scoped>
.application-examine {
  .full-width {
    width: 100%;
  }
  .f-right {
    right: 0 !important;
  }
  .p-fixed {
    position: fixed !important;
    top: 0;
    bottom: 0;
    background: white;
  }
}
</style>
