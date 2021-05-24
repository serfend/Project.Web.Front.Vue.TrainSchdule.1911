<template>
  <div>
    <el-row>
      <el-col :xl="singleColumn?24:12" :lg="24">
        <BaseInfo
          ref="BaseInfo"
          :submit-id.sync="formFinal.BaseInfoId"
          :userid.sync="userid"
          :self-settle.sync="selfSettle"
          style="margin:2rem 1.25rem"
          @submited="baseInfoSubmit"
        />
      </el-col>
      <el-col :xl="singleColumn?24:12" :lg="24">
        <VacationPreview
          v-show="nowStep>=1"
          ref="VacationPreview"
          :entity-type="entityType"
          :entity-type-desc="entityTypeDesc"
          :userid="userid"
          style="margin:2rem 1.25rem"
        />
      </el-col>
      <el-col :xl="singleColumn?24:12" :lg="24">
        <RequestInfo
          v-show="nowStep>=1"
          ref="RequestInfo"
          :submit-id.sync="formFinal.RequestId"
          :userid.sync="userid"
          :self-settle.sync="selfSettle"
          :entity-type="entityType"
          style="margin:2rem 1.25rem"
          @submited="requestInfoSubmit"
          @requestTypeUpdate="requestTypeUpdate"
        />
      </el-col>
    </el-row>
    <el-row>
      <SubmitApply
        :request-id="formFinal.RequestId"
        :base-info-id="formFinal.BaseInfoId"
        :disabled="nowStep<2||childOnLoading"
        :entity-type="entityType"
        @reset="createNewDirect"
        @submit="userSubmit"
      />
    </el-row>
  </div>
</template>

<script>
export default {
  name: 'NewApply',
  components: {
    BaseInfo: () => import('./Form/BaseInfo'),
    RequestInfo: () => import('./Form/RequestIndayInfo'),
    VacationPreview: () => import('@/components/Vacation/VacationPreview'),
    SubmitApply: () => import('./Form/SubmitApply')
  },
  props: {
    defaultId: { type: String, default: null },
    singleColumn: { type: Boolean, default: false }
  },
  data: () => ({
    entityType: 'inday',
    entityTypeDesc: null,
    nowStep: 0,
    onLoading: false,
    childOnLoading: true,
    userid: null,
    selfSettle: null,
    formFinal: {
      BaseInfoId: '',
      RequestId: '',
      mainType: -1
    }
  }),
  mounted() {
    this.userid = this.defaultId
    setTimeout(() => {
      this.createNewDirect()
    }, 1000)
  },
  methods: {
    requestTypeUpdate(val) {
      this.entityTypeDesc = `${val ? val + '|' : ''}${this.entityType}`
    },
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
        RequestId: '',
        mainType: -1
      }
      this.onLoading = false
    },
    userSubmit() {
      this.nowStep = 3
      this.$emit('userSubmit')
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
