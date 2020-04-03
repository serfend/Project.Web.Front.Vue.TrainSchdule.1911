<template>
  <el-card>
    <div slot="header">审批节点设置（筛选审批人）</div>
    <el-table :data="tableData">
      <el-table-column label="代码">
        <template slot-scope="scope">{{ scope.row.code }}</template>
      </el-table-column>
      <el-table-column label="名称">
        <template slot-scope="scope">{{ scope.row.name }}</template>
      </el-table-column>
      <el-table-column label="说明">
        <template slot-scope="scope">{{ scope.row.description }}</template>
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
    </el-table>
  </el-card>
</template>

<script>
import {
  queryStreamNode,
  addStreamNode,
  buildFilter,
  getStreamNode
} from '@/api/applyAuditStream'
export default {
  name: 'ApplyAuditStreamAction',
  data() {
    return {
      tableData: [
        {
          code: '001',
          name: '本级',
          company: [],
          duty: [],
          dutyIsMajor: 0,
          members: []
        }
      ]
    }
  }
}
</script>

<style>
</style>
