<template>
  <div>
    <el-row>
      <el-col :xl="12" :lg="24">
        <BaseInfo
          ref="BaseInfo"
          :submit-id.sync="formFinal.BaseInfoId"
          :userid.sync="userid"
          :self-settle.sync="selfSettle"
          style="margin:2rem 1.25rem"
          @submited="baseInfoSubmit"
        />
      </el-col>
      <el-col :xl="12" :lg="24">
        <VacationPreview
          v-show="nowStep>=1"
          ref="VacationPreview"
          :userid="userid"
          style="margin:2rem 1.25rem"
        />
      </el-col>
      <el-col :xl="12" :lg="24">
        <RequestInfo
          v-show="nowStep>=1"
          ref="RequestInfo"
          :submit-id.sync="formFinal.RequestId"
          :userid.sync="userid"
          :self-settle.sync="selfSettle"
          style="margin:2rem 1.25rem"
          @submited="requestInfoSubmit"
        />
      </el-col>
    </el-row>
    <el-row>
      <SubmitApply
        :request-id="formFinal.RequestId"
        :base-info-id="formFinal.BaseInfoId"
        :disabled="nowStep<2||childOnLoading"
        @reset="createNewDirect"
        @submit="userSubmit"
      />
    </el-row>
  </div>
</template>

<script>
import BaseInfo from './Form/BaseInfo'
import RequestInfo from './Form/RequestInfo'
import VacationPreview from '@/components/Vacation/VacationPreview'
import SubmitApply from './Form/SubmitApply'
export default {
  name: 'NewApply',
  components: {
    BaseInfo,
    RequestInfo,
    VacationPreview,
    SubmitApply
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
      }
    }
  },
  computed: {},
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
    createNewDirect() {
      this.$refs.BaseInfo.reset()
      this.$refs.RequestInfo.reset()
      this.formFinal = {
        BaseInfoId: '',
        RequestId: ''
      }
      this.onLoading = false
    },
    userSubmit() {
      this.nowStep = 3
    }
  }
}
</script>

<style lang="scss">
.mask {
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  transition: all 0.5s;
  pointer-events: none;
  z-index: 1;
}
.step-shower {
  margin-left: 10%;
  width: 80%;
  background-color: #ffffff3f;
  color: #ffffff3f;
}
</style>
