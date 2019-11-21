<template>
  <div class="application-list ma-4">
    <el-row :gutter="8">
      <el-col :lg="5" :md="6" :sm="24">
        <el-card>
          <el-form ref="queryForm" :model="queryForm">
            <el-row>
              <el-col :md="24" :sm="10" class="mb-3">
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
                  <el-option label="--全部--" value />
                  <el-option
                    v-for="item in myManages"
                    :key="item.code"
                    :label="item.name"
                    :value="item.code"
                  />
                </el-select>

                <!-- <el-input v-model="queryForm.companyCode"></el-input> -->
              </el-col>
              <el-col :md="24" :sm="10" class="mb-3">
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
                  <el-option :value="$store.state.user.userid" label="查我自己" />
                  <el-option
                    v-for="item in membersOption"
                    :key="item.id"
                    :label="`${item.realName}（${item.id}）`"
                    :value="item.id"
                  />
                </el-select>
              </el-col>

              <el-col :md="24" :sm="4" class="py-2">
                <el-button class="full-width" type="primary" @click="searchData">查询</el-button>
              </el-col>
            </el-row>
          </el-form>
        </el-card>
      </el-col>
      <el-col :lg="19" :md="18" :sm="24">
        <ApplicationList :data-list="dataList" :on-loading="onLoading" @refresh="searchData">
          <template slot="headeraction">
            <el-button icon="el-icon-edit" type="primary" @click="handleCreate">添加</el-button>

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
                <el-dropdown-item
                  v-for="item in [
                    '保存',
                    '撤回',
                    '发布',
                    '删除',
                  ]"
                  :key="item"
                  :command="item"
                >{{ item }}</el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
            <!-- <el-button
              :disabled="row.status !== 0"
              @click="hendleExecute('保存', row, applyid)"
              size="mini"
            >保存</el-button>
            <el-button
              :disabled="row.status <= 1"
              @click="hendleExecute('撤回', row, applyid)"
              size="mini"
              type="warning"
            >撤回</el-button>
            <el-button
              :disabled="row.status !== -1"
              @click="hendleExecute('发布', row, applyid)"
              size="mini"
              type="success"
            >发布</el-button>
            <el-button
              @click="hendleExecute('删除', row, applyid)"
              size="mini"
              type="danger"
            >删除</el-button>-->
          </template>
        </ApplicationList>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import ApplicationList from './components/ApplicationList'
import { fromUser, fromCompany } from '../../api/apply'
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
      dataList: [],
      onLoading: false,
      myManages: [],
      membersOption: [],
      cacheMembers: []
    }
  },
  created() {
    this.getOnMyManage()
  },
  methods: {
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
          if (data.list) {
            this.myManages = data.list || []
          }
        })
        .catch(err => {
          console.warn(err)
        })
    },

    companyChanged(val) {
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

    hendleExecute(method, row, id) {
      if (this.onLoading === true) {
        return false
      }
      const methodsDic = {
        保存: save,
        撤回: withdrew,
        发布: publish,
        删除: deleteApply
      }
      let params = id
      const fn = methodsDic[method]
      if (method === '删除') {
        params = {
          id,
          Auth: {
            Code: 201700816,
            AuthByUserID: 'Root'
          }
        }
      }
      this.onLoading = true
      fn(params)
        .then(data => {
          if (method === '删除') {
            const curItemIndex = this.dataList.findIndex(d => d.id === id)
            this.dataList.splice(curItemIndex, 1)
            this.$message.success(method + '成功')
            return false
          }
          const { status } = data
          const curItem = this.dataList.find(d => d.id === id)
          if (curItem) {
            curItem.status = status
            this.dataList = [...this.dataList]
          }
          this.$message.success(method + '成功，请求状态已改变')
        })
        .catch(err => {
          console.log(err)
        })
        .finally(() => {
          this.onLoading = false
        })
    },

    handleCreate() {
      this.$router.push('/application/new')
    },

    // 查询数据
    searchData() {
      if (this.onLoading === true) {
        return this.$message.warning('查询中，请等候')
      }
      const { isSearchUser, userId, companyCode } = this.queryForm
      let fn = fromCompany
      let params = {
        code: companyCode
      }
      if (isSearchUser) {
        fn = fromUser
        params = {
          id: userId
        }
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
.application-list {
  .full-width {
    width: 100%;
  }
}
</style>
