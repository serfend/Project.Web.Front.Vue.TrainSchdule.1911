<template>
  <el-form v-if="innerRegisterForm" v-loading="loading" label-position="right" label-width="5rem">
    <el-tabs v-model="nowStep" accordion class="tab-container">
      <el-tab-pane
        v-for="opt in stepOptions.filter((i) => !i.removed)"
        :key="opt.index"
        :label="opt.name"
      >
        <div :key="opt.index" class="panel-content">
          <component
            :is="opt.component"
            :form.sync="innerRegisterForm[opt.component]"
            :is-register="isRegister"
            :child-index="opt.childIndex"
          />
        </div>
      </el-tab-pane>
    </el-tabs>
  </el-form>
</template>

<script>
import { stepOptions, createForm, Const_DisabledVacation } from './config'
import { getUserAllInfo } from '@/api/user/usercompany'
import { checkUserValid } from '@/utils/validate'
export default {
  name: 'RegFormItems',
  components: {
    SvgIcon: () => import('@/components/SvgIcon'),
    Base: () => import('../components/Base'),
    Application: () => import('../components/Application'),
    Social: () => import('../components/Social'),
    Company: () => import('../components/Company'),
    Diy: () => import('../components/Diy'),
    Auth: () => import('@/components/AuthCode')
  },
  model: {
    event: 'change',
    prop: 'registerForm'
  },
  props: {
    loading: { type: Boolean, default: false },
    user: { type: String, default: null },
    registerForm: { type: Object, default: null },
    isRegister: { type: Boolean, default: false }
  },
  data: () => ({
    nowStep: '0',
    stepOptions,
    innerRegisterForm: null
  }),
  watch: {
    registerForm: {
      handler(val) {
        if (!val) {
          val = createForm()
          this.$emit('change', val)
          return
        }
        this.innerRegisterForm = val
      },
      immediate: true,
      deep: true
    }
  },
  methods: {
    next_step(step) {
      let now_index = parseInt(this.nowStep)
      const target = this.stepOptions[now_index]
      if (
        target.childIndex + step < target.childNum &&
        target.childIndex + step >= 0
      ) {
        target.childIndex += step
        return
      }
      if (now_index + step < this.stepOptions.length && now_index + step >= 0) {
        now_index += step
        this.nowStep = now_index.toString()
      }
    },
    handleUserChange() {
      const val = this.user
      if (!val) return
      this.current_select_id = val.id
      this.$emit('update:loading', true)
      this.selectIsInvalidAccount = 0
      getUserAllInfo(this.current_select_id)
        .then(data => {
          const f = this.innerRegisterForm
          f.Social = data.social
          f.Diy = data.diy
          f.Base = data.base.base
          f.Application = data.application
          const duties = data.duties || {}
          const { company, companyOfManage } = data.company
          const { invitedBy, accountStatus } = data.application
          f.Company = {
            company,
            companyOfManage,
            duties: {
              name: duties.name
            },
            title: {
              name: duties.title
            },
            titleDate: duties.titleDate,
            disabledVacation:
              (accountStatus & Const_DisabledVacation) > 0 ? 1 : -1
          }
          this.selectIsInvalidAccount = checkUserValid(invitedBy)
          this.nowSelectCompany = company
          this.$emit('update:registerForm', f)
        })
        .finally(() => {
          this.$emit('update:loading', false)
        })
    }
  }
}
</script>
<style lang="scss" scoped>
@import '@/styles/animation';
.panel-content {
  height: 25rem;
  overflow: scroll;
}
</style>
