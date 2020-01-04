<template>
  <div>
    <el-dropdown split-button szie="small" trigger="click" @click="exportApply(row)">
      <i class="el-icon-download" />
      <el-dropdown-menu slot="dropdown">
        <el-dropdown-item v-for="item in userActionDic" :key="item.name">
          <el-popconfirm :title="`确定要${item.description}吗？`" @onConfirm="hendleExecute(item,row)">
            <el-button
              v-if="row.acessable.indexOf(item.name)>-1"
              slot="reference"
              :type="item.type"
              size="mini"
            >{{ item.description }}</el-button>
          </el-popconfirm>
        </el-dropdown-item>
      </el-dropdown-menu>
    </el-dropdown>
  </div>
</template>

<script>
import { checkAuthCode } from '@/api/account'
import { exportApplyDetail } from '@/api/static'
import { deleteApply, publish, save, withdrew } from '@/api/apply'
export default {
  name: 'ActionUser',
  props: {
    row: {
      type: Object,
      default() {
        return {}
      }
    }
  },
  data() {
    return {
      userActionDic: [
        {
          name: 'Save',
          description: '保存',
          fn: save,
          type: 'primary'
        },
        {
          name: 'Withdrew',
          description: '撤回',
          fn: withdrew,
          type: 'info'
        },
        {
          name: 'Publish',
          description: '发布',
          fn: publish,
          type: 'success'
        },
        {
          name: 'Delete',
          description: '删除',
          fn: deleteApply,
          type: 'danger'
        }
      ],
      auditForm: {
        auth: {}
      }
    }
  },
  computed: {
    sensitiveAction() {
      return '敏感操作'
    }
  },
  methods: {
    checkAuthCode,
    exportApplyDetail,
    hendleExecute(method, row) {
      if (this.onLoading === true) {
        return false
      }
      var params = row.id
      const fn = method.fn
      this.onLoading = true
      fn(params)
        .then(data => {
          this.$message.success(method.description + '成功')
        })
        .catch(err => {
          console.log(err)
        })
        .finally(() => {
          this.onLoading = false
          this.$emit('modefied')
        })
    },
    exportApply(row) {
      var dutiesRawType = row.userBase.dutiesRawType
      var applyId = row.id
      exportApplyDetail(dutiesRawType, applyId)
    }
  }
}
</script>

<style>
</style>
