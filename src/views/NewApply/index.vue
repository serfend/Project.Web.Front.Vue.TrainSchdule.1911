<template>
  <el-container>
    <el-container>
      <el-aside width="100px">
        <el-steps
          direction="vertical"
          :active="nowStep"
          finish-status="success"
          style="height:400px;position:fixed;"
        >
          <el-step title="个人信息" />
          <el-step title="休假信息" />
          <el-step title="确认提交" />
        </el-steps>
      </el-aside>
      <el-main>
        <BaseInfo
          ref="BaseInfo"
          :submit-id.sync="formFinal.BaseInfoId"
          :userid.sync="userid"
          :self-settle.sync="selfSettle"
          style="margin:20px 5px"
          @submited="baseInfoSubmit"
        />
        <RequestInfo
          ref="RequestInfo"
          :submit-id.sync="formFinal.RequestId"
          :userid.sync="userid"
          :self-settle.sync="selfSettle"
          style="margin:20px 5px"
          @submited="requestInfoSubmit"
        />
        <el-link type="success" :href="applyDetailUrl">查看详情</el-link>
      </el-main>
    </el-container>
    <el-footer v-loading="onLoading" :disabled="childOnLoading">
      <div class="row layout" />
      <div :style="{'backgroundColor': theme}" class="footer-nav">
        <div class="row layout justify-center fill-height">
          <el-button
            v-loading="onLoading"
            :disabled="nowStep<2"
            type="success"
            @click="submitApply(0)"
          >仅提交</el-button>
          <el-button
            v-loading="onLoading"
            :disabled="nowStep<2"
            type="success"
            @click="submitApply(1)"
          >提交并保存</el-button>
          <el-button
            v-loading="onLoading"
            :disabled="nowStep<2"
            type="success"
            @click="submitApply(2)"
          >提交并发布</el-button>
          <el-button type="info" @click="createNew">新建申请</el-button>
        </div>
      </div>
    </el-footer>
  </el-container>
</template>

<script>
import BaseInfo from './BaseInfo'
import RequestInfo from './RequestInfo'

import { submitApply, save, publish } from '@/api/apply'
export default {
  name: 'NewApply',
  components: {
    BaseInfo,
    RequestInfo
  },
  data() {
    return {
      nowStep: 0,
      onLoading: false,
      childOnLoading: true,
      userid: '',
      selfSettle: null,
      formFinal: {
        BaseInfoId: '',
        RequestId: ''
      },
      submitId: '',
      isAfterSubmit: false
    }
  },
  computed: {
    theme() {
      return this.$store.state.settings.theme
    },
    applyDetailUrl() {
      return `/#/application/applydetail?id=${this.submitId}`
    }
  },
  mounted() {
    setTimeout(() => {
      this.createNewDirect()
    }, 1000)
  },
  methods: {
    baseInfoSubmit(success) {
      if (success) {
        this.nowStep = 1
        this.$refs.RequestInfo.refreshVacation()
      } else {
        this.childOnLoading = true
        this.nowStep = 0
      }
    },
    requestInfoSubmit(success) {
      if (success) {
        this.nowStep = 2
        this.childOnLoading = false
      } else {
        this.childOnLoading = true
        this.nowStep = 1
      }
    },
    /**
     * 提交申请 0:仅提交，1:提交并保存，2:提交并发布
     */
    submitApply(actionStatus) {
      if (this.onLoading === true) {
        return this.$message.info('提交中，请等待')
      }
      const BaseId = this.formFinal.BaseInfoId
      const RequestId = this.formFinal.RequestId
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
          this.isAfterSubmit = true

          var fn = actionStatus === 1 ? save : publish
          this.$message.success('提交成功')
          this.submitId = data.id
          if (actionStatus > 0) {
            fn(applyId).then(() => {
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
        this.createNewDirect()
      })
    },
    createNewDirect() {
      this.$refs.BaseInfo.reset()
      this.$refs.RequestInfo.reset()
      this.formFinal = {
        BaseInfoId: '',
        RequestId: ''
      }
      this.onLoading = false
      this.isAfterSubmit = false
    }
  }
}
</script>

<style lang="scss">
hr.divider {
  border: 1px solid grey;
  margin: 16px;
  border: none;
  border-bottom: 1px solid #eeeeee;
}
.full-width {
  width: 100%;
}
.p-relitive {
  position: relative;
}
.footer-nav {
  width: 100%;
  background: white;
  box-shadow: 0 -2px 10px -4px;
  padding: 8px;
}
.group-remove {
  color: #999;
  cursor: pointer;
  font-size: 24px;
  margin-right: 20px;
  position: absolute;
  right: 50px;
  top: 10px;
}
.group-edit {
  color: #999;
  cursor: pointer;
  font-size: 24px;
  float: right;
  margin-right: 20px;
  position: absolute;
  right: 100px;
  top: 10px;
}
.mask {
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  transition: all 0.5s;
  pointer-events: none;
  z-index: 1000;
}
</style>
