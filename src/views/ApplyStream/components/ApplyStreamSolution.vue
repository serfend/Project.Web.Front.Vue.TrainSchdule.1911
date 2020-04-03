<template>
  <el-card>
    <div slot="header">审批方案规则（筛选申请人审批方案）</div>
    <el-table :data="tableData">
      <el-table-column label="优先" width="80px" sortable :sort-method="(a,b)=>a-b">
        <template slot-scope="scope">
          <el-tooltip>
            <div slot="content">数字越大，则优先级越高</div>
            <div>{{ scope.row.priority }}</div>
          </el-tooltip>
        </template>
      </el-table-column>
      <el-table-column label="单位">
        <template slot-scope="scope">
          <div v-if="!scope.row.company||scope.row.company.length==0">
            <el-tooltip>
              <div slot="content">所有单位都将默认使用此方案</div>
              <el-tag>不限</el-tag>
            </el-tooltip>
          </div>
          <el-dropdown v-else-if="scope.row.company.length>1">
            <div>{{ scope.row.company[0].name }}等{{ scope.row.company.length }}个单位</div>
            <el-dropdown-menu>
              <el-dropdown-item v-for="cmp in scope.row.company" :key="cmp.id">
                <CompanyFormItem :data="cmp" />
              </el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
          <CompanyFormItem v-else :data="scope.row.company[0]" />
        </template>
      </el-table-column>
      <el-table-column label="职务">
        <template slot-scope="scope">
          <div v-if="!scope.row.duty||scope.row.duty.length==0">
            <el-tooltip>
              <div slot="content">所有职务都将默认使用此方案</div>
              <el-tag>不限</el-tag>
            </el-tooltip>
          </div>
          <el-dropdown v-else-if="scope.row.duty.length>1">
            <div>{{ scope.row.duty[0].name }}等{{ scope.row.duty.length }}个职务</div>
            <el-dropdown-menu>
              <el-dropdown-item v-for="cmp in scope.row.duty" :key="cmp.id">
                <DutyFormItem :data="cmp" />
              </el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
          <DutyFormItem v-else :data="scope.row.duty[0]" />
        </template>
      </el-table-column>
      <el-table-column label="主官">
        <template slot-scope="scope">
          <el-tooltip>
            <div
              slot="content"
            >{{ scope.row.dutyIsMajor==2?'仅职务类型为主官的生效':scope.row.dutyIsMajor==1?'仅职务类型非主官的生效':'不论职务类型是否为主官都将生效' }}</div>
            <el-tag>{{ scope.row.dutyIsMajor==2?'仅主官':scope.row.dutyIsMajor==1?'仅非主官':'不限' }}</el-tag>
          </el-tooltip>
        </template>
      </el-table-column>
      <el-table-column label="成员">
        <template slot-scope="scope">
          <div v-if="!scope.row.members||scope.row.members.length==0">
            <el-tooltip>
              <div slot="content">所有成员都将默认使用此方案</div>
              <el-tag>不限</el-tag>
            </el-tooltip>
          </div>
          <el-dropdown v-else-if="scope.row.members.length>1">
            <div>{{ scope.row.members[0].realName }}等{{ scope.row.members.length }}名成员</div>
            <el-dropdown-menu>
              <el-dropdown-item v-for="cmp in scope.row.members" :key="cmp.id">
                <UserFormItem :data="cmp" />
              </el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
          <UserFormItem v-else :data="scope.row.members[0]" />
        </template>
      </el-table-column>
      <el-table-column label="审批流方案">
        <template slot-scope="scope">
          <div @click="showSolution(scope.row.solution)">{{ scope.row.solution }}</div>
        </template>
      </el-table-column>
      <el-table-column label="状态">
        <template slot-scope="scope">
          <el-switch
            v-model="scope.row.enable"
            style="display: block"
            active-color="#13ce66"
            inactive-color="#999999"
            active-text="启用"
            inactive-text="禁用"
          />
        </template>
      </el-table-column>
      <el-table-column label="操作" width="200px">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="warning"
            icon="el-icon-edit-outline"
            @click="editSolution(scope.row)"
          >编辑</el-button>
          <el-button
            size="mini"
            type="info"
            icon="el-icon-circle-close"
            @click="deleteSolution(scope.row)"
          >删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-button plain type="success" icon="el-icon-circle-plus-outline" style="width:100%">添加</el-button>
  </el-card>
</template>

<script>
import CompanyFormItem from '@/components/Company/CompanyFormItem'
import DutyFormItem from '@/components/Duty/DutyFormItem'
import UserFormItem from '@/components/User/UserFormItem'
import {
  queryStreamSolutionRule,
  addStreamSolutionRule,
  buildFilter,
  getStreamSolutionRule
} from '@/api/applyAuditStream'
export default {
  name: 'ApplyStreamSolution',
  components: { CompanyFormItem, DutyFormItem, UserFormItem },
  data() {
    return {
      tableData: [
        {
          solution: '常规方案',
          priority: 1000,
          enable: false,
          company: [
            {
              id: '123',
              name: '2y2l',
              type: '基层涟/室',
              code: 'AA123',
              managers: [{ realName: 'user', username: '123' }]
            },
            {
              id: '223',
              name: '2y1l',
              type: '基层涟/室',
              code: 'AA123',
              managers: [{ realName: 'user', username: '123' }]
            }
          ],
          dutyIsMajor: 2,
          duty: [
            { name: '涟长', id: '1' },
            { name: '之道元', id: '3' }
          ],
          members: [
            { realName: 'user1', username: '1234' },
            { realName: 'user2', username: '123' }
          ]
        },
        {
          solution: '默认方案',
          priority: 0,
          enable: false,
          company: [],
          dutyIsMajor: 0,
          duty: [],
          members: []
        }
      ]
    }
  },
  methods: {
    sortByIndex(a, b) {
      console.log(a)
      return a - b
    },
    editSolution(row) {
      console.log('edit' + JSON.stringify(row))
    },
    deleteSolution(row) {
      console.log('delete' + JSON.stringify(row))
    },
    showSolution(solutionName) {
      console.log('showSolution' + solutionName)
    }
  }
}
</script>

<style>
</style>
