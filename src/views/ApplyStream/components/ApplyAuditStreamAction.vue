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
      <el-table :data="data.allActionNode">
        <el-table-column label="名称">
          <template slot-scope="scope">
            <el-tooltip effect="light">
              <div slot="content">
                <h3>创建于{{ format(scope.row.create,'zh_CN') }}</h3>>
                <div>{{ scope.row.description }}</div>
                <div>{{ scope.row.auditMembersCount==0?'所有符合条件的成员均需要审批':`在所有符合条件的成员中，任选${scope.row.auditMembersCount}人审批` }}</div>
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
      <el-form v-loading="newNode.loading" label-width="120px">
        <el-form-item label="名称" style="width:400px">
          <el-input v-model="newNode.name" placeholder="填入独一无二的名称" />
        </el-form-item>
        <el-form-item label="描述">
          <el-input
            v-model="newNode.description"
            placeholder="节点描述，可自定义"
            style="width:400px"
            type="textarea"
            autosize
          />
        </el-form-item>
        <el-form-item label="单位" style="width:400px">
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
            <el-option v-for="item in 10" :key="item" :label="item" :value="item" />
          </el-select>
        </el-form-item>
        <el-form-item label="相对路径">
          <el-select v-model="newNode.companyRefer" placeholder="相对查询何种">
            <el-option
              v-for="item in companyReferDic"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
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
        <el-form-item label="主官">
          <el-radio-group v-model="newNode.dutyIsMajor">
            <el-radio :label="0">不限</el-radio>
            <el-radio :label="1">仅主官</el-radio>
            <el-radio :label="2">仅非主官</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="职务类型">
          <el-select
            v-model="newNode.dutyTags"
            multiple
            filterable
            allow-create
            default-first-option
            placeholder="职务类型选取，输入后按回车键确认"
          />
        </el-form-item>
        <el-form-item label="指定审核人">
          <el-autocomplete
            v-model="userSelect.code"
            :fetch-suggestions="queryMember"
            style="width:100%"
            :placeholder="userSelect.realName?userSelect.realName:'搜索成员'"
            @select="handleUserSelectChange"
          />
          <el-tag
            v-for="tag in newNode.auditMembers"
            :key="tag"
            closable
            :disable-transitions="false"
            @close="handleAuditMembersSelectClosed(tag)"
          >{{ newNode.auditMembersRealName[tag] }}</el-tag>
        </el-form-item>
        <el-form-item label="审批人数量">
          <el-input-number v-model="newNode.auditMembersCount" placeholder="需要多少人审批" />
        </el-form-item>
        <AuthCode :form.sync="newNode.auth" />
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
  addStreamNode,
  editStreamNode,
  deleteStreamNode,
  buildFilter
} from '@/api/applyAuditStream'
import { companyChild } from '@/api/company'
import { getUserIdByRealName } from '@/api/user/userinfo'
import CascaderSelector from '@/components/CascaderSelector'
import AuthCode from '@/components/AuthCode'
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
  props: {
    data: {
      type: Object,
      default() {
        return {
          allSolutionRule: [],
          allSolutionRuleDic: {},
          allSolution: [],
          allSolutionDic: {},
          allActionNode: [],
          allActionNodeDic: {}
        }
      }
    },
    loading: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      companyReferDic: [
        { value: '', label: '不使用相对' },
        { value: 'self', label: '本级审核' },
        { value: 'parent', label: '上级审核' }
      ],
      newNodeDialogShow: false,
      newNode: this.buildnewNode(),
      companySelect: {},
      userSelect: {}
    }
  },
  methods: {
    format,
    companyChild,
    companySelectChange(val) {
      this.companySelect.name = val
      if (this.newNode.companies.indexOf(this.companySelect.code) > -1) {
        return this.$message.error(`${val}已被选中`)
      }
      this.newNode.companies.push(this.companySelect.code)
      this.newNode.companiesName[this.companySelect.code] = val
    },
    handleUserSelectChange(val) {
      this.userSelect.realName = val.value
      if (this.newNode.auditMembers.indexOf(val.id) > -1) {
        return this.$message.error(`${val.value}已被选中`)
      }
      this.newNode.auditMembers.push(val.id)
      this.newNode.auditMembersRealName[val.id] = val.value
    },
    handleCompaniesSelectClose(tag) {
      this.newNode.companies.splice(this.newNode.companies.indexOf(tag), 1)
    },
    handleAuditMembersSelectClosed(tag) {
      this.newNode.auditMembers.splice(
        this.newNode.auditMembers.indexOf(tag),
        1
      )
    },
    refresh() {
      this.$emit('refresh')
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

        this.newNode.dutiesName = {}
        this.newNode.duties.forEach(i => {
          this.newNode.dutiesName[i.code] = i.name
        })
        this.newNode.duties = this.newNode.duties.map(i => i.code)

        this.newNode.auditMembersRealName = {}
        this.newNode.auditMembers.forEach(i => {
          this.newNode.auditMembersRealName[i.id] = i.realName
        })
        this.newNode.auditMembers = this.newNode.auditMembers.map(i => i.id)
      }
    },
    submitNode() {
      if (this.newNode.loading) return this.$message.info('加载中')
      this.newNode.loading = true
      var fn = this.newNode.mode === 'edit' ? editStreamNode : addStreamNode
      fn(
        this.newNode.id,
        this.newNode.name,
        this.newNode.description,
        buildFilter(this.newNode),
        this.newNode.auth
      )
        .then(() => {
          this.$message.success(`节点${this.newNode.name}已提交`)
          this.refresh()
        })
        .finally(() => {
          this.newNode.loading = false
        })
    },
    deleteNode(row) {
      if (this.newNode.loading) return this.$message.info('加载中')
      this.newNode.loading = true
      var auth = this.newNode.auth
      if (!auth) {
        auth = {}
      }
      deleteStreamNode(this.newNode.name, auth.authByUserId, auth.code)
        .then(() => {
          this.$message.success(`${this.newNode.name}已删除`)
          this.newNodeDialogShow = false
          this.refresh()
        })
        .finally(() => {
          this.newNode.loading = false
        })
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
    buildnewNode() {
      var lastAuth = this.newNode ? this.newNode.auth : null
      if (lastAuth === null) {
        lastAuth = {
          authByUserId: '',
          code: 0
        }
      }
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
        auditMembersRealName: {},
        auth: lastAuth,
        loading: false
      }
    }
  }
}
</script>

<style>
</style>
