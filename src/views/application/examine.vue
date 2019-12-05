<template>
  <div class="application-examine ma-4">
    <el-card>
      <ApplySearchCommon ref="queryAppliesForm" :table-form="queryAppliesForm" @searchData="searchData">
        <template slot="ExtendForm">
          <el-form-item>
            <el-button icon="el-icon-edit" type="primary" @click="showMultiDialog">批量审核</el-button>
          </el-form-item>
          <el-form-item>
            <el-button icon="el-icon-edit" type="primary" @click="handleCreate">添加</el-button>
          </el-form-item>
          <el-form-item>
            <el-button
              v-if="queryForm.isSearchUser"
              icon="el-icon-download"
              type="primary"
              @click="exportUserApplies({user: queryForm.userId})"
            >导出用户申请</el-button>
            <el-button
              v-else
              icon="el-icon-download"
              type="primary"
              @click="exportCompanyApplies({company: queryForm.companyCode})"
            >导出单位申请</el-button>
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
            v-if="row.status==100&& $store.state.user.companyid==row.nowAuditCompany"
            size="mini"
            type="primary"
            @click="recallApply(row)"
          >召回</el-button>
          <div
            v-if="$store.state.user.companyid==row.nowAuditCompany&&row.status!=30&&row.status!=100"
          >
            <el-button size="mini" type="success" @click="auditApply(row, 1)">通过</el-button>
            <el-button
              v-if="row.status!='publish'"
              size="mini"
              type="warning"
              @click="auditApply(row, 2)"
            >驳回</el-button>
          </div>
          <div v-if="$store.state.user.companyid!=row.nowAuditCompany">仅{{ row.nowAuditCompany }}可审批</div>
        </template>
      </ApplicationList>

      <el-dialog :visible="auditForm.show" title="提交审核" width="30%">
        <el-form ref="auditForm" :model="auditForm" label-width="80px" :rules="auditFormRules">
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
          <el-form-item label="安全码" prop="Code">
            <el-input v-model="auditForm.Code" placeholder="请输入安全码" />
          </el-form-item>
          <el-form-item label="审核人">
            <el-input v-model="auditForm.AuthByUserID" placeholder="请输入审核人的id" />
          </el-form-item>
        </el-form>
        <span slot="footer">
          <el-button @click="auditForm.show = false">取 消</el-button>
          <el-button type="primary" @click="SubmitAuditForm">确 定</el-button>
        </span>
      </el-dialog>

      <el-dialog :visible="recallShow" title="召回" width="30%">
        <el-form ref="auditForm" :model="auditForm" label-width="80px">
          <el-form-item label="备注">
            <el-input v-model="auditForm.remark" placeholder="请输入备注" type="textarea" />
          </el-form-item>
          <el-form-item label="安全码">
            <el-input v-model="auditForm.Code" placeholder="请输入安全码" />
          </el-form-item>
          <el-form-item hidden label="审核人">
            <el-input v-model="auditForm.AuthByUserID" placeholder="请输入审核人的id" />
          </el-form-item>
        </el-form>
        <span slot="footer">
          <el-button @click="recallShow = false">取 消</el-button>
          <el-button type="primary" @click="SubmitRecall">确 定</el-button>
        </span>
      </el-dialog>
      <el-dialog
        :visible.sync="multiAuditForm.show"
        custom-class="p-fixed f-right mr-0"
        title="批量审核"
        top="0"
        width="408px"
      >
        <el-form ref="auditForm" :model="auditForm" :rules="auditFormRules" label-width="80px">
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
          <el-form-item label="安全码" prop="Code">
            <el-input v-model="auditForm.Code" placeholder="请输入安全码" />
          </el-form-item>
          <el-form-item label="审核人" prop="AuthByUserID">
            <el-input v-model="auditForm.AuthByUserID" placeholder="请输入审核人的id" />
          </el-form-item>
        </el-form>
        <span slot="footer">
          <el-button @click="multiAuditForm.show = false">取 消</el-button>
          <el-button type="primary" @click="SubmitMultiAuditForm">确 定</el-button>
        </span>
      </el-dialog>
    </el-card>
    <!-- </el-col> -->
    <!-- </el-row> -->
  </div>
</template>

<script>
import ApplicationList from './components/ApplicationList'
import ApplySearchCommon from './components/ApplySearchCommon'

import {
  audit,
  deleteApply,
  recallOrder,
  queryList
} from '../../api/apply'
import { getOnMyManage } from '../../api/usercompany'
import { getMembers } from '../../api/company'
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
    ApplySearchCommon
  },
  mixins: [mixins],
  data() {
    var checkCode = (rule, value, callback) => {
      if (value) {
        if (!/^[0-9]{6}$/.test(value.toString())) {
          return callback('请输入六位数字')
        }
      } else {
        return callback('请输入六位数字')
      }
      callback()
    }
    return {
      queryAppliesForm: {
        pages: {
          pageIndex: 0,
          pageSize: 20
        },
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
      auditForm: {
        applyId: '',
        action: 1,
        remark: '',
        show: false,
        Code: '',
        AuthByUserID: ''
      },
      // 批量审批表单
      multiAuditForm: {
        show: false
      },
      recallShow: false, // 打开召回弹窗
      auditFormRules: {
        Code: [
          {
            required: true,
            validator: checkCode,
            trigger: 'blur'
          }
          // {
          //   min: 100000,
          //   max: 999999,
          //   message: '请输入六位数字',
          //   trigger: 'blur',
          //   type: 'number'
          //    /^[0-9]{6}$/.test('000000')
          // }
        ]
      }
    }
  },
  computed: {
    myUserid() {
      return this.$store.state.user.userid
    }
  },
  created() {
    this.getOnMyManage()
    this.searchData()
  },
  methods: {
    LoadPage() {
      this.searchData()
    }, // 滚动加载
    showMultiDialog() {
      this.clearAuditForm()
      this.multiAuditForm.show = true
    },
    SubmitMultiAuditForm() {
      this.$refs['auditForm'].validate(valid => {
        if (!valid) {
          return
        }

        var dataList = this.$refs['applicationlist'].getChecked()
        var list = []
        const { action, remark, Code, AuthByUserID } = this.auditForm
        for (var i = 0; i < dataList.length; i++) {
          list.push({
            id: dataList[i].id,
            action,
            remark
          })
        }
        const Auth = {
          Code,
          AuthByUserID: AuthByUserID
        }
        audit(
          {
            list
          },
          Auth
        )
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
      this.auditForm = {
        applyId: '',
        action: 1,
        remark: '',
        show: false,
        Code: '',
        AuthByUserID: this.myUserid,
        IsRecall: false
      }
    },
    DeleteApply(item) {
      const authUser = prompt('输入授权账号', this.myUserid)
      if (!authUser) return
      deleteApply({
        id: item.id,
        Auth: {
          AuthByUserID: authUser,
          Code: prompt('输入授权码')
        }
      })
        .then(() => {
          this.$message.success('删除成功')
          this.searchData()
        })
        .catch(err => {
          this.$message.error(err)
        })
    },
    SubmitAuditForm() {
      this.$refs['auditForm'].validate(valid => {
        if (!valid) {
          return
        }
        const { applyId, action, remark, Code, AuthByUserID } = this.auditForm
        const list = [
          {
            id: applyId,
            action,
            remark
          }
        ]
        const Auth = {
          Code,
          AuthByUserID
        }
        audit(
          {
            list
          },
          Auth
        )
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
      })
    },

    SubmitRecall() {
      const { applyId, remark, Code, AuthByUserID } = this.auditForm
      const model = {
        apply: applyId,
        reason: remark,
        recallBy: this.$store.state.user.userid
      }
      const Auth = {
        Code,
        AuthByUserID: AuthByUserID
      }
      recallOrder({
        data: model,
        Auth: Auth
      })
        .then(result => {
          if (result.status === 0) this.$notify.success('已召回' + result.id)
          else this.$notify.error(result.message + ':' + result.id)
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
    recallApply(row) {
      // 打开召回弹框
      this.clearAuditForm()
      this.recallShow = true

      this.auditForm.applyId = row.id
    },
    auditApply(row, action) {
      this.clearAuditForm()
      this.auditForm.show = true
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
        companyCode: '',
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
    companyChanged(val) {
      this.queryForm.userId = ''
      const cache = this.cacheMembers.find(d => d.companyCode === val)
      if (cache) {
        this.membersOption = cache.list
      } else {
        getMembers({
          code: val
        }).then(data => {
          if (data.list) {
            this.membersOption = data.list
            this.cacheMembers.push({
              companyCode: val,
              list: data.list
            })
          }
        })
      }
    },
    // 查询数据
    searchData(sForm) {
      if (this.onLoading === true) {
        return this.$message.warning('查询中，请等候')
      }
      this.queryAppliesForm.code = this.queryAppliesForm.companyCode
      this.onLoading = true
      this.dataList = []

      var QueryAppliesForm = {}
      if (sForm) {
        this.queryAppliesForm = sForm
      }

      QueryAppliesForm['pages'] = this.queryAppliesForm.pages
      if (this.queryAppliesForm.addTime && this.queryAppliesForm.addTime[0]) {
        QueryAppliesForm.create = {
          start: this.queryAppliesForm.addTime[0],
          end: this.queryAppliesForm.addTime[1]
        }
      }

      if (this.queryAppliesForm.stampLeaveTime && this.queryAppliesForm.stampLeaveTime[0]) {
        QueryAppliesForm.stampLeave = {
          start: this.queryAppliesForm.stampLeaveTime[0],
          end: this.queryAppliesForm.stampLeaveTime[1]
        }
      }
      if (this.queryAppliesForm.stampReturnTime && this.queryAppliesForm.stampReturnTime[0]) {
        QueryAppliesForm.stampReturn = {
          start: this.queryAppliesForm.stampReturnTime[0],
          end: this.queryAppliesForm.stampReturnTime[1]
        }
      }
      if (this.queryAppliesForm.status.arrays.length > 0) {
        QueryAppliesForm['status'] = { arrays: this.queryAppliesForm.status.arrays }
      }
      if (this.queryAppliesForm.createFor.value) {
        QueryAppliesForm['createFor'] = {
          value: this.queryAppliesForm.createFor.value
        }
      }

      if (this.queryAppliesForm.createBy.value) {
        QueryAppliesForm['createBy'] = { value: this.queryAppliesForm.createBy.value }
      }
      if (this.queryAppliesForm.auditBy.value) {
        QueryAppliesForm['auditBy'] = { value: this.queryAppliesForm.auditBy.value }
      }

      if (this.queryAppliesForm.auditByCompany.value) {
        QueryAppliesForm['auditByCompany'] = {
          value: this.queryAppliesForm.auditByCompany.value
        }
      }

      queryList(QueryAppliesForm)
        .then(data => {
          const list = data.list
          this.dataList = list || []
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
