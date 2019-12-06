<template>
  <div class="application-list ma-4">
    <el-card>
      <ApplySearchCommon ref="tableForm" :table-form="tableForm" @searchData="searchData">
        <template slot="ExtendForm">
          <el-form-item>
            <el-button icon="el-icon-edit" type="primary" @click="handleCreate">添加</el-button>
          </el-form-item>
          <el-form-item>
            <el-button
              icon="el-icon-download"
              type="primary"
              @click="exportUserApplies({user: queryForm.userId})"
            >导出用户申请</el-button>
            <el-button
              icon="el-icon-download"
              type="primary"
              @click="exportCompanyApplies({company: queryForm.companyCode==''?$store.state.user.companyid:queryForm.companyCode })"
            >导出单位申请</el-button>
          </el-form-item>
        </template>
      </ApplySearchCommon>
      <ApplicationList :data-list="dataList" :on-loading="onLoading" @refresh="searchData">
        <template slot="action" slot-scope="{ row, applyid }">
          <el-button @click="exportApply({apply: applyid})">导出</el-button>
          <el-dropdown
            split-button
            szie="small"
            trigger="click"
            @command="(action) => hendleExecute(action, row, applyid)"
          >
            操作
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item v-for="item in userActionDic" :key="item.name" :command="item">
                <el-button :disabled="item.disabled" :type="item.type" size="mini">{{ item.name }}</el-button>
              </el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </template>
      </ApplicationList>
    </el-card>

    <!-- </el-col>
    </el-row>-->
  </div>
</template>

<script>
import ApplicationList from './components/ApplicationList'
import ApplySearchCommon from './components/ApplySearchCommon'
import { queryList } from '../../api/apply'
import {
  exportUserApplies,
  exportApply,
  exportCompanyApplies
} from '../../api/static'
import { getOnMyManage } from '../../api/usercompany'
import { deleteApply, publish, save, withdrew } from '../../api/apply'
import { getMembers } from '../../api/company'

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
  name: 'ApplyList',
  components: {
    ApplicationList,
    ApplySearchCommon
  },
  mixins: [mixins],
  data() {
    return {
      tableForm: {
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
      dataList: [],
      onLoading: false,
      myManages: [],
      membersOption: [],
      cacheMembers: [],
      userActionDic: [
        {
          name: '保存',
          fn: save,
          type: 'primary',
          disabled: false
        },
        {
          name: '撤回',
          fn: withdrew,
          type: 'info',
          disabled: false
        },
        {
          name: '发布',
          fn: publish,
          type: 'success',
          disabled: false
        },
        {
          name: '删除',
          fn: deleteApply,
          type: 'danger',
          disabled: false
        }
      ]
    }
  },
  created() {
    this.getOnMyManage()
    this.searchData()
  },
  methods: {
    getOnMyManage() {
      this.membersOption = []
      this.cacheMembers = []
      getOnMyManage()
        .then(data => {
          if (data.list) {
            this.myManages = data.list || []
          }
        })
        .catch(err => {
          console.warn(err)
        })
    },

    hendleExecute(method, row, id) {
      if (this.onLoading === true) {
        return false
      }
      let params = id
      const fn = method.fn
      if (method === '删除') {
        params = {
          id,
          Auth: {
            Code: prompt('输入授权码'),
            AuthByUserID: this.$store.state.user.userid
          }
        }
      }
      this.onLoading = true
      fn(params)
        .then(data => {
          this.$message.success(method.name + '成功')
        })
        .catch(err => {
          console.log(err)
        })
        .finally(() => {
          this.onLoading = false
          setTimeout(this.searchData(), 1000)
        })
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

      var queryAppliesForm = {}
      if (sForm) {
        this.tableForm = sForm
      }

      queryAppliesForm['pages'] = this.tableForm.pages
      if (this.tableForm.addTime && this.tableForm.addTime[0]) {
        queryAppliesForm.create = {
          start: this.tableForm.addTime[0],
          end: this.tableForm.addTime[1]
        }
      }

      if (this.tableForm.stampLeaveTime && this.tableForm.stampLeaveTime[0]) {
        queryAppliesForm.stampLeave = {
          start: this.tableForm.stampLeaveTime[0],
          end: this.tableForm.stampLeaveTime[1]
        }
      }
      if (this.tableForm.stampReturnTime && this.tableForm.stampReturnTime[0]) {
        queryAppliesForm.stampReturn = {
          start: this.tableForm.stampReturnTime[0],
          end: this.tableForm.stampReturnTime[1]
        }
      }
      if (this.tableForm.status.arrays.length > 0) {
        queryAppliesForm['status'] = { arrays: this.tableForm.status.arrays }
      }
      if (this.tableForm.createFor.value) {
        queryAppliesForm['createFor'] = {
          value: this.tableForm.createFor.value
        }
      }

      if (this.tableForm.createBy.value) {
        queryAppliesForm['createBy'] = { value: this.tableForm.createBy.value }
      }
      if (this.tableForm.auditBy.value) {
        queryAppliesForm['auditBy'] = { value: this.tableForm.auditBy.value }
      }

      if (this.tableForm.auditByCompany.value) {
        queryAppliesForm['auditByCompany'] = {
          value: this.tableForm.auditByCompany.value
        }
      }

      queryList(queryAppliesForm)
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
.application-list {
  .full-width {
    width: 100%;
  }
}
</style>
