<template>
  <div>
    <el-card v-loading="loading">
      <div slot="header">
        <h3>审批方案</h3>
        <el-button
          type="success"
          :icon="loading?'el-icon-loading':'el-icon-refresh-right'"
          circle
          style="float:right"
          @click="refresh"
        />
      </div>
      <el-table :data="data.allSolution">
        <el-table-column label="名称">
          <template slot-scope="scope">{{ scope.row.name }}</template>
        </el-table-column>
        <el-table-column label="说明">
          <template slot-scope="scope">{{ scope.row.description }}</template>
        </el-table-column>
        <el-table-column label="流程">
          <template slot-scope="scope">
            <el-tooltip>
              <div slot="content">
                <el-steps direction="vertical">
                  <el-step v-for="s in scope.row.nodes" :key="s.key" style="width:300px">
                    <div slot="title" style="color:#ffc300">{{ s.name }}</div>
                    <div slot="description">
                      创建于
                      {{ format(s.create,'zh_CN') }}
                      需要
                      {{ s.auditMembersCount==0?'所有人':(s.auditMembersCount+'人') }}审核
                      <div style="color:#ffffff;font-size:1em">{{ s.description }}</div>
                    </div>
                  </el-step>
                </el-steps>
              </div>
              <div>{{ scope.row.nodes.length }}条</div>
            </el-tooltip>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="200px">
          <template slot-scope="scope">
            <el-button
              size="mini"
              type="warning"
              icon="el-icon-edit-outline"
              @click="showSolutionDialog('edit',scope.row)"
            >编辑</el-button>
            <el-button
              size="mini"
              type="info"
              icon="el-icon-circle-close"
              @click="showSolutionDialog('delete',scope.row)"
            >删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-button
        plain
        type="success"
        icon="el-icon-circle-plus-outline"
        style="width:100%"
        @click="showSolutionDialog('new',null)"
      >添加</el-button>
    </el-card>
    <el-dialog
      :visible.sync="newSolutionDialogShow"
      :title="newSolution.mode=='new'?'新增':newSolution.mode=='edit'?'编辑':'删除'"
    >
      <el-form v-loading="newSolution.loading">
        <el-form-item label="名称">
          <el-input v-model="newSolution.name" placeholder="填入独一无二的名称" />
        </el-form-item>
        <el-form-item label="描述">
          <el-input v-model="newSolution.description" placeholder="方案的描述，可自定义" />
        </el-form-item>
        <el-form-item label="审批节点">
          <el-select v-model="newSolution.nodeSelect" @change="selectNodeChanged">
            <el-option
              v-for="item in data.allActionNode"
              :key="item.name"
              :label="item.name"
              :value="item.name"
            >
              <el-tooltip :content="item.description">
                <div>{{ item.name }}</div>
              </el-tooltip>
            </el-option>
          </el-select>
        </el-form-item>
        <el-tree
          :data="newSolution.nodes"
          node-key="id"
          draggable
          default-expand-all
          :expand-on-click-node="false"
        >
          <div slot-scope="{node}" class="custom-tree-node">
            <el-tag
              size="mini"
              closable
              effect="plain"
              @close="handleSelectNodeClose(node)"
            >{{ node.label }}</el-tag>
            <span>{{ node.data.description }}</span>
          </div>
        </el-tree>
        <AuthCode :form.sync="newSolution.auth" />
        <el-button-group style="width:100%">
          <el-button
            v-loading="newSolution.loading"
            type="success"
            style="width:50%"
            @click="submitSolution"
          >保存</el-button>
          <el-button
            v-loading="newSolution.loading"
            type="danger"
            style="width:50%"
            @click="deleteSolution"
          >删除</el-button>
        </el-button-group>
      </el-form>
    </el-dialog>
  </div>
</template>

<script>
import AuthCode from '@/components/AuthCode'
import { format } from 'timeago.js'
import {
  addStreamSolution,
  editStreamSolution,
  deleteStreamSolution
} from '@/api/applyAuditStream'
export default {
  name: 'ApplyAuditStream',
  components: { AuthCode },
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
      newSolutionDialogShow: false,
      newSolution: this.buildNewSolution()
    }
  },
  methods: {
    format,
    refresh() {
      this.$emit('refresh')
    },
    submitSolution() {
      if (this.newSolution.loading) return this.$message.info('加载中')
      this.newSolution.loading = true
      var fn =
        this.newSolution.mode === 'edit'
          ? editStreamSolution
          : addStreamSolution
      fn(
        this.newSolution.id,
        this.newSolution.name,
        this.newSolution.description,
        this.newSolution.nodes.map(i => i.label),
        this.newSolution.auth
      )
        .then(() => {
          this.$message.success(`方案${this.newSolution.name}已提交`)
          this.refresh()
        })
        .finally(() => {
          this.newSolution.loading = false
        })
    },
    showSolutionDialog(mode, target) {
      this.newSolutionDialogShow = true
      this.newSolution.mode = mode
      if (target) {
        this.newSolution.id = target.id
        this.newSolution.name = target.name
        this.newSolution.description = target.description
        this.newSolution.nodes = target.nodes.map(i =>
          this.buildNodeSelect(i.name)
        )
      }
    },
    deleteSolution() {
      if (this.newSolution.loading) return this.$message.info('加载中')
      this.newSolution.loading = true
      var auth = this.newSolution.auth
      if (!auth) {
        auth = {}
      }
      deleteStreamSolution(this.newSolution.name, auth.authByUserId, auth.code)
        .then(() => {
          this.$message(`${this.newSolution.name}已删除`)
          this.newSolutionDialogShow = false
          this.refresh()
        })
        .catch(e => {
          this.newSolution.loading = false
        })
    },
    buildNodeSelect(val) {
      return {
        id: Math.random(),
        label: val,
        description: this.data.allActionNodeDic[val].description
      }
    },
    selectNodeChanged(val) {
      this.newSolution.nodes.push(this.buildNodeSelect(val))
      this.newSolution.nodeSelect = ''
    },
    handleSelectNodeClose(node) {
      var id = node.data.id
      var index = this.newSolution.nodes.findIndex(n => n.id === id)
      this.newSolution.nodes.splice(index, 1)
    },
    buildNewSolution() {
      var lastAuth = this.newSolution ? this.newSolution.auth : null
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
        nodeSelect: '',
        nodes: [],
        auth: lastAuth,
        loading: false
      }
    }
  }
}
</script>

<style>
.el-tag + .el-tag {
  margin-left: 10px;
}
.button-new-tag {
  margin-left: 10px;
  height: 32px;
  line-height: 30px;
  padding-top: 0;
  padding-bottom: 0;
}
.input-new-tag {
  width: 90px;
  margin-left: 10px;
  vertical-align: bottom;
}
.custom-tree-node {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 12px;
  padding-right: 8px;
}
</style>
