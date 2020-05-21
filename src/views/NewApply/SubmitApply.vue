<template>
  <div
    v-loading="onLoading"
    :disabled="disabled"
    :style="{'backgroundColor': theme}"
    class="footer-nav"
  >
    <el-popover placement="top-start" trigger="hover">
      <div>
        <h2>提交、保存、发布是什么</h2>
        <el-divider />
        <p>
          <b>提交</b>任何人都可以操作，但24小时后仍未保存则会被删除
        </p>
        <p>
          <b>保存</b>仅本人及上级操作，将会使休假申请进入草稿状态，随时可发布
        </p>
        <p>
          <b>发布</b>仅本人及上级操作，将会使休假申请进入审核中状态
        </p>
      </div>
      <i slot="reference" class="el-icon-question" style="color:#999999;font-size:1em" />
    </el-popover>
    <el-button v-loading="onLoading" :disabled="disabled" type="success" @click="submitApply(0)">仅提交</el-button>
    <el-button
      v-loading="onLoading"
      :disabled="disabled"
      type="success"
      @click="submitApply(1)"
    >提交并保存</el-button>
    <el-button
      v-loading="onLoading"
      :disabled="disabled"
      type="success"
      @click="submitApply(2)"
    >提交并发布</el-button>
    <el-button type="info" @click="createNew">新建申请</el-button>
    <el-button v-show="submitId" type="info" @click="skimDetail">查看详情</el-button>
  </div>
</template>

<script>
import { submitApply, doAction } from '@/api/apply'

export default {
  name: 'SubmitApply',
  props: {
    baseInfoId: {
      type: String,
      default: null
    },
    requestId: {
      type: String,
      default: null
    },
    disabled: {
      type: Boolean,
      default: false
    }
  },
  data: () => ({
    onLoading: false,
    submitId: ''
  }),
  computed: {
    theme() {
      return this.$store.state.settings.theme
    },
    applyDetailUrl() {
      return `/application/applydetail?id=${this.submitId}`
    }
  },
  methods: {
    skimDetail() {
      var url = this.applyDetailUrl
      this.$router.push(url)
    },
    /**
     * 提交申请 0:仅提交，1:提交并保存，2:提交并发布
     */
    submitApply(actionStatus) {
      if (this.onLoading === true) {
        return this.$message.info('提交中，请等待')
      }
      const BaseId = this.baseInfoId
      const RequestId = this.requestId
      this.onLoading = true
      submitApply({
        RequestId,
        BaseId,
        Verify: {
          Code: 201700816
        }
      })
        .then(data => {
          var applyId = data.id
          var fn = actionStatus === 1 ? 'save' : 'publish'
          this.$message.success('提交成功')
          this.$emit('submit')
          this.submitId = data.id
          if (actionStatus > 0) {
            doAction(fn, applyId).then(() => {
              this.$message.success(
                `${actionStatus === 1 ? '提交并保存' : '提交并发布'}成功`
              )
            })
          }
        })
        .finally(() => {
          this.onLoading = false
        })
    },
    /**
     * 创建新的申请
     */
    createNew() {
      this.$confirm('此操作将清空并重新填写, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$emit('reset')
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.footer-nav {
  width: 100%;
  height: 5em;
  background: white;
  box-shadow: 0 -2px 10px -4px;
  padding: 8px;
}
</style>
