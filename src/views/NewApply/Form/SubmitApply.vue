<template>
  <div
    v-loading="onLoading"
    :disabled="iDisabled"
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
          <b>保存</b>仅本人及上级操作，将会使申请进入草稿状态，随时可发布
        </p>
        <p>
          <b>发布</b>仅本人及上级操作，将会使申请进入审核中状态
        </p>
        <div>
          <el-button :disabled="iDisabled" type="success" @click="submitApply(0)">提交</el-button>
          <el-button :disabled="iDisabled" type="success" @click="submitApply(1)">保存</el-button>
        </div>
      </div>
      <i slot="reference" class="el-icon-more-outline" style="color:#fff" />
    </el-popover>

    <el-button :disabled="iDisabled" type="success" style="width:40%" @click="submitApply(2)">发布</el-button>
    <el-button type="info" @click="createNew">新建申请</el-button>
    <el-button v-show="submitId" type="success" @click="skimDetail">查 看 详 情</el-button>
    <el-dialog :visible.sync="showSuccessDialog" append-to-body>
      <div v-if="!errorMsg">
        <div style="display:flex;justify-content:center">
          <LottieIcon
            path="/assets/lottie/lottie.success.json"
            :animate-speed="0.5"
            style="width:15rem"
          />
        </div>
        <div class="item-put-center" style="margin:3rem 0 2rem 0;font-size:2rem">申 请 提 交 成 功</div>
      </div>
      <div v-else>
        <div style="display:flex;justify-content:center">
          <LottieIcon
            path="/assets/lottie/lottie.fail.json"
            :animate-speed="0.5"
            style="width:15rem"
          />
        </div>
        <el-alert
          v-if="errorMsg"
          type="error"
          center
          effect="dark"
          show-icon
          closable
        >{{ errorMsg }}</el-alert>
      </div>
      <div class="item-put-center">
        <el-popover
          v-for="(i,index) in errorList"
          :key="i.id"
          trigger="hover"
          placement="top"
          @show="i.can_show=true"
        >
          <ApplyDetail
            :can-show="i.can_show"
            :show-user="false"
            :show-comment="false"
            :focus-id="i.id"
            style="width:80rem"
          />
          <template #reference>
            <el-button
              style="cursor:pointer;margin-left:0.3rem"
              type="text"
              @click="show_detail(i)"
            >第{{ index+1 }}项</el-button>
          </template>
        </el-popover>
      </div>
      <div class="item-put-center">
        <el-button type="success" style="width:60%" @click="skimDetail">查看本次提交的详情</el-button>
      </div>
      <div class="item-put-center">
        <el-button type="info" style="width:60%" @click="showSuccessDialog=false">关 闭</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { doAction } from '@/api/audit/handle'
import { submitApply } from '@/api/apply/create'
export default {
  name: 'SubmitApply',
  components: {
    // SvgIcon: () => import('@/components/SvgIcon'),
    LottieIcon: () => import('@/components/LottieIcon'),
    ApplyDetail: () => import('@/views/ApplyDetail')
  },
  props: {
    baseInfoId: { type: String, default: null },
    requestId: { type: String, default: null },
    mainType: { type: Number, default: 0 },
    disabled: { type: Boolean, default: false },
    entityType: { type: String, default: 'vacation' }
  },
  data: () => ({
    onLoading: false,
    submitId: '',
    showSuccessDialog: false,
    errorMsg: null,
    errorList: []
  }),
  computed: {
    iDisabled() {
      return this.disabled || !this.baseInfoId || !this.requestId
    },
    theme() {
      return this.$store.state.settings.theme
    },
    applyDetailUrl() {
      return `#/apply/${this.entityType}/applydetail?id=${
        this.submitId
      }`
    }
  },
  watch: {
    submitId: {
      handler(val) {
        if (val) this.showSuccessDialog = true
      }
    }
  },
  methods: {
    skimDetail() {
      const url = this.applyDetailUrl
      window.open(url)
    },
    show_detail(id) {},
    /**
     * 提交申请 0:仅提交，1:提交并保存，2:提交并发布
     */
    submitApply(actionStatus) {
      if (this.onLoading === true) {
        return this.$message.info('提交中，请等待')
      }
      this.errorMsg = null
      const BaseId = this.baseInfoId
      const RequestId = this.requestId
      const main_type = this.mainType
      this.onLoading = true
      submitApply({
        RequestId,
        BaseId,
        isPlan: main_type === 2,
        entityType: this.entityType,
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
            doAction(fn, applyId, this.entityType)
              .then(data => {
                if (!data || !data.list) {
                  const msg = actionStatus === 1 ? '提交并保存' : '提交并发布'
                  this.$message.success(`${msg}成功`)
                  this.errorList = []
                  this.$emit('complete', true)
                  return
                }
                this.errorList = data.list.map(i => ({
                  id: i,
                  can_show: true
                }))
                this.$emit('complete', false)
                const count = this.errorList.length
                this.errorMsg = `存在${count}条与本次提交的离队时间或归队时间冲突的申请`
              })
              .catch(e => {
                this.$emit('complete', false)
                this.errorMsg = e.message
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
.item-put-center {
  margin-top: 1rem;
  display: flex;
  justify-content: center;
}
</style>
