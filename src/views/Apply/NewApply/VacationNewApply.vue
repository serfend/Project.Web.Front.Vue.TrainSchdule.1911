<template>
  <div>
    <el-row :gutter="20">
      <BaseInfo
        ref="BaseInfo"
        :submit-id.sync="formFinal.BaseInfoId"
        :userid.sync="userid"
        :self-settle.sync="selfSettle"
        class="card-column"
        @submited="baseInfoSubmit"
      />
      <RequestInfo
        v-show="nowStep >= 1"
        ref="RequestInfo"
        :submit-id.sync="formFinal.RequestId"
        :main-status.sync="formFinal.mainStatus"
        :userid.sync="userid"
        :entity-type="entityType"
        :self-settle.sync="selfSettle"
        class="card-column"
        @submited="requestInfoSubmit"
        @vacationTypeUpdate="vacationTypeUpdate"
      />
      <SubmitApply
        :request-id="formFinal.RequestId"
        :base-info-id="formFinal.BaseInfoId"
        :main-status="formFinal.mainStatus"
        :entity-type="entityType"
        :disabled="nowStep < 2 || childOnLoading"
        class="card-column"
        @reset="createNewDirect"
        @submit="userSubmit"
      >
        <VacationPreview
          ref="VacationPreview"
          :entity-type="entityType"
          :entity-type-desc="entityTypeDesc"
          :userid="userid"
          class="card-column"
        />
      </SubmitApply>
    </el-row>

    <el-backtop
      target="#app"
      :bottom="100"
      style="width:3rem;height:3rem;box-shadow: 1px 1px 6px #3333aa"
    />
  </div>
</template>

<script>
export default {
  name: 'NewApply',
  components: {
    BaseInfo: () => import('./Form/BaseInfo'),
    RequestInfo: () => import('./Form/RequestInfo'),
    VacationPreview: () => import('@/components/Vacation/VacationPreview'),
    SubmitApply: () => import('./Form/SubmitApply')
  },
  props: {
    defaultId: { type: String, default: null },
    singleColumn: { type: Boolean, default: false }
  },
  data: () => ({
    entityType: 'vacation',
    entityTypeDesc: null,
    nowStep: 0,
    onLoading: false,
    childOnLoading: true,
    userid: null,
    selfSettle: null,
    formFinal: {
      BaseInfoId: null,
      RequestId: null,
      mainStatus: -1
    }
  }),
  watch: {
    defaultId: {
      handler(val) {
        this.userid = val
      },
      immediate: true
    }
  },
  methods: {
    vacationTypeUpdate(val) {
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
      this.$refs.BaseInfo && this.$refs.BaseInfo.reset()
      this.$refs.RequestInfo && this.$refs.RequestInfo.reset()
      this.formFinal = {
        BaseInfoId: null,
        RequestId: null,
        mainStatus: -1
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

<style scoped lang="scss">
.card-column {
  margin: 0rem 0rem 2rem 0;
}
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
