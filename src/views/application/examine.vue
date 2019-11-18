<template>
  <div class="application-examine ma-4">
    <el-row :gutter="20">
      <el-col
        :lg="5"
        :md="6"
        :sm="24"
      >
        <el-card
          class="elevation-0"
          shadow="hover"
        >
          <el-form
            ref="queryForm"
            :model="queryForm"
          >
            <el-row>
              <el-col
                :md="24"
                :sm="12"
                class="mb-3"
              >
                <div class="py-2 body-2 layout align-center row justify-space-between">
                  单位
                  <el-button
                    circle
                    icon="el-icon-refresh"
                    size="mini"
                    type="primary"
                    @click="getOnMyManage"
                  />
                </div>
                <el-select
                  v-model="queryForm.companyCode"
                  class="full-width"
                  placeholder="选择管辖单位"
                  @change="companyChanged"
                >
                  <!--                   <el-option
                    label="--全部--"
                    value
                  />-->
                  <el-option
                    v-for="item in myManages"
                    :key="item.code"
                    :label="item.name"
                    :value="item.code"
                  />
                </el-select>

                <!-- <el-input v-model="queryForm.companyCode"></el-input> -->
              </el-col>
              <el-col
                :md="24"
                :sm="12"
                class="mb-3"
              >
                <div class="py-2 body-2 layout align-center row justify-space-between">
                  指定人员
                  <el-switch v-model="queryForm.isSearchUser" />
                </div>
                <el-select
                  v-show="queryForm.isSearchUser"
                  v-model="queryForm.userId"
                  class="full-width"
                  placeholder
                >
                  <el-option
                    :value="$store.state.user.userid"
                    label="查我自己"
                  />
                  <el-option
                    v-for="item in membersOption"
                    :key="item.id"
                    :label="`${item.realName}（${item.id}）`"
                    :value="item.id"
                  />
                </el-select>
              </el-col>

              <el-col
                :span="24"
                class="py-2"
              >
                <el-button
                  class="full-width"
                  type="primary"
                  @click="searchData"
                >查询</el-button>
              </el-col>
            </el-row>
          </el-form>
        </el-card>
      </el-col>
      <el-col
        :lg="19"
        :md="18"
        :sm="24"
      >
        <ApplicationList
          :data-list="dataList"
          :on-loading="onLoading"
          multi
          @refresh="searchData"
        >
          <template slot="headeraction">
            <el-button
              icon="el-icon-edit"
              type="primary"
              @click="showMultiDialog"
            >批量审核</el-button>

            <el-button
              icon="el-icon-edit"
              type="primary"
              @click="handleCreate"
            >添加</el-button>

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
          </template>
          <template
            slot="action"
            slot-scope="{row}"
          >
            <el-button
              size="mini"
              type="success"
              @click="auditApply(row, 1)"
            >通过</el-button>
            <el-button
              v-if="row.status!='publish'"
              size="mini"
              type="warning"
              @click="auditApply(row, 2)"
            >驳回</el-button>
            <el-button
              v-if="row.status!='deleted'"
              size="mini"
              type="danger"
            >删除</el-button>
          </template>
        </ApplicationList>

        <el-dialog
          :visible="auditForm.show"
          title="提交审核"
          width="30%"
        >
          <el-form
            ref="auditForm"
            :model="auditForm"
            label-width="80px"
          >
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
              <el-input
                v-model="auditForm.remark"
                placeholder="请输入备注"
                type="textarea"
              />
            </el-form-item>
            <el-form-item label="安全码">
              <el-input
                v-model="auditForm.Code"
                placeholder="请输入安全码"
              />
            </el-form-item>
            <el-form-item
              hidden
              label="审核人"
            >
              <el-input
                v-model="auditForm.AuthByUserID"
                placeholder="请输入审核人的id"
              />
            </el-form-item>
          </el-form>

          <span slot="footer">
            <el-button @click="auditForm.show = false">取 消</el-button>
            <el-button
              type="primary"
              @click="SubmitAuditForm"
            >确 定</el-button>
          </span>
        </el-dialog>

        <el-dialog
          :visible.sync="multiAuditForm.show"
          custom-class="p-fixed f-right mr-0"
          title="批量审核"
          top="0"
          width="408px"
        >
          <span slot="footer">
            <el-button @click="multiAuditForm.show = false">取 消</el-button>
            <el-button
              type="primary"
              @click="SubmitMultiAuditForm"
            >确 定</el-button>
          </span>
        </el-dialog>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import ApplicationList from './components/ApplicationList'
import { toCompany, toUser, audit, deleteApply } from '../../api/apply'
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
    ApplicationList
  },
  mixins: [mixins],
  data() {
    return {
      queryForm: {
        companyCode: '',
        userId: '',
        isSearchUser: false
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
  },
  methods: {
    showMultiDialog() {
      this.multiAuditForm.show = true
    },
    SubmitMultiAuditForm() {
      return false
    },
    clearAuditForm() {
      this.auditForm = {
        applyId: '',
        action: 1,
        remark: '',
        show: false,
        Code: '',
        AuthByUserID: this.myUserid
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
            if (result.status === 0) this.$notify.success('已审批' + result.id)
            else this.$notify.error(result.message + ':' + result.id)
          })
        })
        .catch(err => {
          this.$message.error(err.message)
        })
        .finally(() => {
          this.clearAuditForm()
        })
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
    searchData() {
      if (this.onLoading === true) {
        return this.$message.warning('查询中，请等候')
      }
      const { isSearchUser, userId, companyCode } = this.queryForm
      let fn = toCompany
      const params = {
        code: companyCode
      }
      // 如果查询指定用户，则异步方法换城toUser
      if (isSearchUser) {
        fn = toUser
        params.id = userId
      }
      this.onLoading = true
      this.dataList = []
      fn(params)
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

<style lang="scss" scoped>
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
