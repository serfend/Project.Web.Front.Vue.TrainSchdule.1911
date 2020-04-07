<template>
  <div>
    <el-card>
      <div slot="header">
        <h3>审批节点设置（筛选审批人）</h3>
        <el-button
          type="success"
          :icon="loading?'el-icon-loading':'el-icon-refresh-right'"
          circle
          style="float:right"
          @click="refresh"
        />
      </div>
      <el-table :data="tableData">
        <el-table-column label="名称">
          <template slot-scope="scope">
            <el-tooltip effect="light">
              <div slot="content">
                <h3>创建于{{ format(scope.row.create,'zh_CN') }}</h3>
                <div>{{ scope.row.description }}</div>
              </div>
              <div>{{ scope.row.name }}</div>
            </el-tooltip>
          </template>
        </el-table-column>
        <el-table-column label="单位">
          <template slot-scope="scope">
            <div v-if="!scope.row.companies||scope.row.companies.length==0">
              <div
                v-if="scope.row.companyRefer"
              >{{ scope.row.companyRefer=='parent'?'上级审核':'本级审核' }}</div>
              <div
                v-else-if="scope.row.companyCodeLength.length>0 || scope.row.companyTags.length>0"
              >
                <el-tooltip effect="light">
                  <div slot="content">
                    <el-form>
                      <el-form-item v-if="scope.row.companyCodeLength.length>0" label="代码长度">
                        <el-tag v-for="l in scope.row.companyCodeLength" :key="l">{{ l }}</el-tag>
                      </el-form-item>
                      <el-form-item v-if="scope.row.companyTags.length>0" label="单位类别">
                        <el-tag v-for="t in scope.row.companyTags" :key="t">{{ t }}</el-tag>
                      </el-form-item>
                    </el-form>
                  </div>
                  <div>{{ scope.row.companyTags.length + scope.row.companyCodeLength.length }}条范围</div>
                </el-tooltip>
              </div>
              <el-tooltip v-else>
                <div slot="content">所有单位都将默认使用此方案</div>不限
              </el-tooltip>
            </div>
            <el-dropdown v-else-if="scope.row.companies.length>1">
              <div>{{ scope.row.companies[0].name }}等{{ scope.row.companies.length }}个单位</div>
              <el-dropdown-menu>
                <el-dropdown-item v-for="cmp in scope.row.companies" :key="cmp.id">
                  <CompanyFormItem :data="cmp" />
                </el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
            <CompanyFormItem v-else :data="scope.row.companies[0]" />
          </template>
        </el-table-column>
        <el-table-column label="职务">
          <template slot-scope="scope">
            <div v-if="!scope.row.duties||scope.row.duties.length==0">
              <div style="float:left">
                <el-tooltip>
                  <div
                    slot="content"
                  >{{ scope.row.dutyIsMajor==2?'仅职务类型为主官的生效':scope.row.dutyIsMajor==1?'仅职务类型非主官的生效':'不论职务类型是否为主官都将生效' }}</div>
                  <el-tag>{{ scope.row.dutyIsMajor==2?'仅主官':scope.row.dutyIsMajor==1?'仅非主官':'不限' }}</el-tag>
                </el-tooltip>
              </div>

              <div style="float:left">
                <div v-if="scope.row.dutyTags.length>0">
                  <el-tooltip effect="light">
                    <div slot="content">
                      <el-tag v-for="t in scope.row.dutyTags" :key="t">{{ t }}</el-tag>
                    </div>
                    <el-tag>{{ scope.row.dutyTags.length }}种类别</el-tag>
                  </el-tooltip>
                </div>
                <el-tooltip v-else>
                  <div slot="content">所有职务都将默认使用此方案</div>
                  <div>不限类别</div>
                </el-tooltip>
              </div>
            </div>
            <el-dropdown v-else-if="scope.row.duties.length>1">
              <div>{{ scope.row.duties[0].name }}等{{ scope.row.duties.length }}个职务</div>
              <el-dropdown-menu>
                <el-dropdown-item v-for="duty in scope.row.duties" :key="duty.id">
                  <DutyFormItem :data="duty" />
                </el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
            <DutyFormItem v-else :data="scope.row.duties[0]" />
          </template>
        </el-table-column>
        <el-table-column label="成员">
          <template slot-scope="scope">
            <div v-if="!scope.row.auditMembers||scope.row.auditMembers.length==0">
              <el-popover trigger="hover" content="所有成员都将默认使用此方案">
                <el-tag slot="reference">不限</el-tag>
              </el-popover>
            </div>
            <el-dropdown v-else-if="scope.row.auditMembers.length>1">
              <div>{{ scope.row.auditMembers[0].realName }}等{{ scope.row.auditMembers.length }}名成员</div>
              <el-dropdown-menu>
                <el-dropdown-item v-for="cmp in scope.row.auditMembers" :key="cmp.id">
                  <UserFormItem :data="cmp" />
                </el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
            <UserFormItem v-else :data="scope.row.auditMembers[0]" />
          </template>
        </el-table-column>
        <el-table-column label="操作" width="200px">
          <template slot-scope="scope">
            <el-button
              size="mini"
              type="warning"
              icon="el-icon-edit-outline"
              @click="showNodeDialoag('edit',scope.row)"
            >编辑</el-button>
            <el-button
              size="mini"
              type="info"
              icon="el-icon-circle-close"
              @click="showNodeDialoag('delete',scope.row)"
            >删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-button
        plain
        type="success"
        icon="el-icon-circle-plus-outline"
        style="width:100%"
        @click="showNodeDialoag('new',null)"
      >添加</el-button>
    </el-card>
    <el-dialog
      :visible.sync="newNodeDialogShow"
      :title="newNode.mode=='new'?'新增':newNode.mode=='edit'?'编辑':'删除'"
    >
      <el-form v-loading="newNode.loading">
        <el-form-item label="名称">
          <el-input
            v-model="newNode.name"
            placeholder="填入独一无二的名称"
            :disabled="newNode.mode=='edit'||newNode.mode=='delete'"
          />
        </el-form-item>
        <el-form-item label="描述">
          <el-input v-model="newNode.description" placeholder="节点描述，可自定义" />
        </el-form-item>
        <el-form-item label="单位">
          <CascaderSelector
            :code.sync="companySelect.code"
            :child-getter-method="companyChild"
            :placeholder="companySelect.name"
            @select-change="companySelectChange"
          />
          <el-tag
            v-for="tag in newNode.companies"
            :key="tag"
            closable
            :disable-transitions="false"
            @close="handleCompaniesSelectClose(tag)"
          >{{ newNode.companiesName[tag] }}</el-tag>
        </el-form-item>
        <el-form-item label="长度">
          <el-select v-model="newNode.companyCodeLength" multiple placeholder="单位代码的位数">
            <el-option v-for="item in 10" :key="item" :label="item" :value="item"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="单位类型">
          <el-select
            v-model="newNode.companyTags"
            multiple
            filterable
            allow-create
            default-first-option
            placeholder="单位类型选取，输入后按回车键确认"
          />
        </el-form-item>
        <el-form-item label="指定审核人">
          <el-autocomplete
            v-model="nowSelectRealName"
            :fetch-suggestions="queryMember"
            style="width:100%"
            placeholder="搜索成员"
            @select="handleUserSelectChange"
          />
        </el-form-item>
        <el-form-item label="授权人">
          <el-collapse>
            <el-collapse-item title="授权人">
              <template slot="title">
                默认为当前登录
                <el-tag>{{ $store.state.user.name }}</el-tag>
              </template>
              <AuthCode :form.sync="newNode.auth" :auth-check-method="checkAuthCode" />
            </el-collapse-item>
          </el-collapse>
        </el-form-item>
        <el-button-group style="width:100%">
          <el-button
            v-loading="newNode.loading"
            type="success"
            style="width:50%"
            @click="submitNode"
          >保存</el-button>
          <el-button
            v-loading="newNode.loading"
            type="danger"
            style="width:50%"
            @click="deleteNode"
          >删除</el-button>
        </el-button-group>
      </el-form>
    </el-dialog>
  </div>
</template>

<script>
import {
  queryStreamNode,
  addStreamNode,
  buildFilter,
  getStreamNode
} from '@/api/applyAuditStream'
import { companyChild } from '@/api/company'
import { getUserIdByRealName } from '@/api/userinfo'
import CascaderSelector from '@/components/CascaderSelector'
import AuthCode from '@/components/AuthCode'
import { checkAuthCode } from '@/api/account'
import CompanyFormItem from '@/components/Company/CompanyFormItem'
import DutyFormItem from '@/components/Duty/DutyFormItem'
import UserFormItem from '@/components/User/UserFormItem'
import { format } from 'timeago.js'
export default {
  name: 'ApplyAuditStreamAction',
  components: {
    CompanyFormItem,
    DutyFormItem,
    CascaderSelector,
    AuthCode,
    UserFormItem
  },
  data() {
    return {
      loading: false,
      tableData: [],
      newNodeDialogShow: false,
      newNode: this.buildnewNode(),
      companySelect: {},
      nowSelectRealName: ''
    }
  },
  mounted() {
    this.refresh()
  },
  methods: {
    format,
    companyChild,
    checkAuthCode,
    companySelectChange(val) {
      this.companySelect.name = val
      if (this.newNode.companies.indexOf(this.companySelect.code) > -1) {
        return this.$message.error(`${val}已被选中`)
      }
      this.newNode.companies.push(this.companySelect.code)
      this.newNode.companiesName[this.companySelect.code] = val
    },
    handleCompaniesSelectClose(tag) {
      this.newNode.companies.splice(this.newNode.companies.indexOf(tag), 1)
    },
    refresh() {
      queryStreamNode().then(data => {
        this.tableData = data.list
      })
    },
    showNodeDialoag(mode, target) {
      this.newNodeDialogShow = true
      this.newNode.mode = mode
      if (target) {
        Object.assign(this.newNode, target)
        this.newNode.companiesName = {}
        this.newNode.companies.forEach(i => {
          this.newNode.companiesName[i.code] = i.name
        })
        this.newNode.companies = this.newNode.companies.map(i => i.code)
      }
    },
    editNode(row) {},
    submitNode() {
      if (this.newNode.loading) return this.$message.info('加载中')
      this.newNode.loading = true
      var fn = this.newNode.mode === 'edit' ? edit : addStreamSolution
      fn(
        this.newNode.name,
        this.newNode.description,
        this.newNode.nodes,
        this.newNode.auth
      )
        .then(() => {
          this.$message.success(`方案${this.newNode.name}已提交`)
          this.refresh()
        })
        .catch(e => {
          this.newNode.loading = false
        })
    },
    deleteNode(row) {
      if (this.newNode.loading) return this.$message.info('加载中')
    },
    queryMember(realName, cb) {
      if (realName === '') return cb([{}])
      getUserIdByRealName(realName).then(data => {
        cb(
          data.list.map(li => {
            return {
              value: li.companyName + li.dutiesName + li.realName,
              id: li.id
            }
          })
        )
      })
    },
    handleUserSelectChange(val) {
      console.log(val)
    },
    buildnewNode() {
      var lastAuth = this.newNode ? this.newNode.auth : null
      return {
        mode: 'new',
        name: '',
        description: '',
        duties: [],
        dutyIsMajor: 0,
        dutyTags: [],
        companies: [],
        companiesName: {},
        companyRefer: '',
        companyTags: [],
        companyCodeLength: [],
        auditMembersCount: 1,
        auditMembers: [],
        auth: lastAuth ?? {
          authByUserId: '',
          code: 0
        },
        loading: false
      }
    }
  }
}
</script>

<style>
</style>
