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
              @click="exportUserApplies(queryAppliesForm.createFor.value===''?myUserid:queryAppliesForm.createFor.value,$store.state.user.dutiesType)"
            >导出{{ queryAppliesForm.createFor.value===''?myUserid:queryAppliesForm.createFor.value }}申请</el-button>
            <el-button
              icon="el-icon-download"
              type="primary"
              @click="exportCompanyApplies(queryAppliesForm.createCompany.value===''?myCreateCompany:queryAppliesForm.createCompany.value ,$store.state.user.dutiesType)"
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
            v-if="CheckIfShowRecall(row)"
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
          <el-button v-else-if="row.recallId!==null" type="warning" @click="showRecallMsg(row)">召回信息</el-button>
          <el-tag v-else-if="row.status===100" type="success">正常休假</el-tag>
          <el-tag v-else-if="row.status>30" type="warning">审批中</el-tag>
          <el-tag v-else type="info">未提交申请</el-tag>
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
          <el-form-item label="批复内容">
            <el-input v-model="auditForm.remark" placeholder="请输入批复" type="textarea" />
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
          <el-form-item v-show="isOnlyToShowRecallMsg" label="召回创建">
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
          <el-form-item v-show="!isOnlyToShowRecallMsg" label="安全码">
            <el-input v-model="auditForm.code" placeholder="请输入安全码" />
          </el-form-item>
          <el-form-item label="审核人">
            <el-input v-model="auditForm.authByUserId" placeholder="请输入审核人的id" />
          </el-form-item>
        </el-form>
        <span slot="footer">
          <el-button-group v-if="!isOnlyToShowRecallMsg">
            <el-button type="info" @click="recallShow = false">取 消</el-button>
            <el-button type="warning" @click="SubmitRecall">召 回</el-button>
          </el-button-group>
          <el-button v-else @click="isOnlyToShowRecallMsg=recallShow=false">确 定</el-button>
        </span>
      </el-dialog>
      <el-dialog :visible.sync="multiAuditForm.show" title="批量审核">
        <div v-if="multiAuditForm.responseList.length>0">
          <el-form ref="auditForm" :model="auditForm">
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
                @change="multiAuditUpdateAll"
              />
            </el-form-item>
            <el-form-item label="批复内容" prop="remark">
              <el-input
                v-model="auditForm.remark"
                placeholder="请输入批复"
                type="textarea"
                @change="multiAuditUpdateAll"
              />
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

          <el-collapse
            v-for="r in multiAuditForm.responseList"
            :key="r.id"
            style="overflow:auto"
            accordion
          >
            <el-collapse-item>
              <template slot="title">
                <el-button
                  :type="r.modefiedByUser?'warning':'success'"
                  size="mini"
                >{{ r.apply.base.realName }}</el-button>
                <el-switch
                  v-model="r.action"
                  :active-value="1"
                  :inactive-value="2"
                  active-color="#13ce66"
                  active-text="通过"
                  class="pt-2"
                  inactive-color="#ff4949"
                  inactive-text="驳回"
                  style="display: block"
                  @change="r.modefiedByUser=true"
                />
              </template>
              <el-form>
                <el-form-item label="批复内容">
                  <el-input v-model="r.remark" @change="r.modefiedByUser=true" />
                </el-form-item>
                <el-form-item label="部职别">
                  {{ r.apply.base.companyName }}
                  {{ r.apply.base.dutiesName }}
                </el-form-item>
                <el-form-item label="休假原因">{{ r.apply.request.reason }}</el-form-item>
                <el-form-item label="休假地点">{{ r.apply.request.vocationPlace.name }})</el-form-item>
                <el-form-item label="开始时间">{{ r.apply.request.stampLeave }}</el-form-item>
                <el-form-item label="结束时间">{{ r.apply.request.stampReturn }}</el-form-item>
                <div v-for="a in r.apply.request.additialVocations" :key="a.length">
                  <el-tag>{{ a.name }}{{ a.length }}天</el-tag>
                  {{ a.description }}
                </div>
              </el-form>
            </el-collapse-item>
          </el-collapse>
        </div>
        <div v-else>当前暂时没有选中可审批的申请</div>
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
import { audit, postRecallOrder, getRecallOrder, queryList } from '@/api/apply'
// import { getMembers } from '@/api/company'
import { exportUserApplies, exportCompanyApplies } from '@/api/static'
// 将导出的方法以mixins的方式注入到vm实例
const mixins = {
  methods: {
    exportUserApplies,
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
      dataList: [],
      onLoading: false,
      membersOption: [],
      cacheMembers: [],
      auditShow: false,
      auditForm: this.auditFormInit(),
      // 批量审批表单
      multiAuditForm: {
        show: false,
        responseList: []
      },
      isOnlyToShowRecallMsg: false, // 当前的召回窗口是用于提交还是用于显示结果
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
      var dataList = this.$refs['applicationlist'].getChecked()
      this.multiAuditForm.responseList = []
      for (var i = 0; i < dataList.length; i++) {
        var item = dataList[i]
        if (item.status !== 100) {
          this.multiAuditForm.responseList.push({
            apply: item,
            id: item.id,
            action: '',
            remark: '',
            modefiedByUser: false
          })
        }
      }
      this.multiAuditForm.show = true
      this.multiAuditUpdateAll()
    },
    multiAuditUpdateAll() {
      this.multiAuditForm.responseList.forEach(r => {
        if (!r.modefiedByUser) {
          r.remark = this.auditForm.remark
          r.action = this.auditForm.action
        }
      })
    },
    SubmitMultiAuditForm() {
      this.$refs['auditForm'].validate(valid => {
        if (!valid) return
        const { code, authByUserId } = this.auditForm
        const Auth = { code, authByUserId: authByUserId }
        audit({ list: this.multiAuditForm.responseList }, Auth)
          .then(resultlist => {
            resultlist.forEach(result => {
              if (result.status === 0) {
                this.$notify.success('已审批' + result.id)
              } else this.$notify.error(result.message + ':' + result.id)
              this.searchData()
            })
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
        .finally(() => {
          this.clearAuditForm()
        })
    },
    CheckIfShowRecall(row) {
      return (
        row.status === 100 &&
        row.recallId === null &&
        new Date(row.request.stampReturn) > new Date()
      )
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
      this.isOnlyToShowRecallMsg = true
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
      this.isOnlyToShowRecallMsg = false
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
