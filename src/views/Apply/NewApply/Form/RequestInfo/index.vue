<template>
  <div
    :style="{ transition: 'all 0.5s' }"
    @mouseenter="isHover = true"
    @mouseleave="leaveCard"
  >
    <el-card
      v-loading="loading"
      header="休假信息"
      class="flashing-alert"
      style="position:relative;z-index:2;"
    >
      <el-form
        ref="primaryForm"
        :model="formApply"
        label-width="5rem"
        :rules="rules"
      >
        <el-form-item label="填报类型">
          <el-tooltip content="正式填报休假申请，审批通过后计入全年休假情况。">
            <el-radio v-model="mainStatus" :label="0" border>正式报假</el-radio>
          </el-tooltip>
          <el-tooltip
            content="休探亲假且因公分休的，全年3次路途内的，不计入路途次数"
          >
            <el-radio
              v-model="mainStatus"
              :label="4"
              border
            >正式报假（因公）</el-radio>
          </el-tooltip>
          <el-tooltip content="用于填报年度休假计划，不计入全年休假情况。">
            <el-radio v-model="mainStatus" :label="2" border>计划报假</el-radio>
          </el-tooltip>
        </el-form-item>
        <el-form-item
          v-if="mainStatus > 0 && (mainStatus & 4) > 0"
          label="因"
          prop="forWorkReason"
        >
          <div style="display:flex">
            <el-input
              v-model="formApply.forWorkReason"
              maxlength="30"
              style="width:10rem"
              placement="填写原因"
            />
            <span>工作原因，需分休。</span>
          </div>
        </el-form-item>
        <el-form-item v-show="!(mainStatus & 2)" label="选择计划">
          <el-tooltip
            content="【开发中】您可以从之前填报的计划中直接选取作为正式填报项提交"
          >
            <el-select v-model="direct_select_apply" disabled>
              <el-option value="1" label="8月1日正休15天" />
            </el-select>
          </el-tooltip>
        </el-form-item>
      </el-form>
      <el-container v-show="mainStatus > -1">
        <el-main :style="{ filter: hideDetail ? 'blur(0.2rem)' : '' }">
          <CardTooltipAlert :accept="submitId" :accepting="anyChanged">
            <template
              slot="content"
            >鼠标移到休假进度条上可查看年度休假情况，有误请联系业务口。</template>
          </CardTooltipAlert>
          <el-alert
            v-if="formApply && formApply.isArchitect"
            center
            type="error"
          >补充申请 申请将会被标记为【补充记录】</el-alert>
          <el-form
            v-if="formApply"
            ref="formApply"
            :model="formApply"
            label-width="6rem"
          >
            <el-form-item label="年休假率">
              <VacationDescription
                v-if="nowVacationType && usersvacation"
                :users-vacation="usersvacation"
                :this-time-vacation-length="
                  nowVacationType.primary ? formApply.vacationLength : 0
                "
                :year-select.sync="yearSelect"
              />
            </el-form-item>
            <el-form-item label="休假类型">
              <VacationTypeSelector
                v-model="formApply.vacationType"
                :entity-type="entityType"
                :types.sync="vacationTypes"
                :left-length="usersvacation.leftLength"
                :hide="false"
                @change="updateMaxLen"
              />
            </el-form-item>
            <el-form-item label="休假原因">
              <el-input
                v-model="formApply.reason"
                type="textarea"
                maxlength="30"
                show-word-limit
                style="width:30rem"
              />
            </el-form-item>
            <el-form-item label="休假天数">
              <el-slider
                v-model="formApply.vacationLength"
                show-input
                :max="maxVacationLength"
                :min="0"
                :format-tooltip="v => `${v}/${maxVacationLength}天`"
                @input="requireUpdateChange"
              />
            </el-form-item>
            <el-form-item
              v-if="nowVacationType && nowVacationType.canUseOnTrip"
              label="路途天数"
            >
              <el-tooltip content="基础路途">
                <el-input-number
                  v-model="formApply.OnTripLengthBase"
                  :min="0"
                  :max="2"
                  @input="requireUpdateChange"
                />
              </el-tooltip>
              <el-tooltip :content="TipTripAdvance">
                <el-input-number
                  v-model="formApply.OnTripLengthAdvance"
                  :min="0"
                  :max="14"
                  @input="requireUpdateChange"
                />
              </el-tooltip>
            </el-form-item>
            <el-form-item
              v-if="nowVacationType && nowVacationType.caculateBenefit"
              label="其他假"
            >
              <BenefitVacation
                v-model="benefitList"
                @change="requireUpdateChange"
              />
            </el-form-item>
            <el-form-item
              label="离队时间"
              prop="StampLeave"
              :rules="[
                {
                  required: true,
                  validator: stampLeaveRuleCheck,
                  trigger: 'blur'
                }
              ]"
            >
              <div style="display:flex">
                <DatetimePicker
                  v-model="formApply.StampLeave"
                  type="date"
                  view="year"
                  :color="theme"
                  format="YYYY-MM-DD"
                  locale="zh-cn"
                  :locale-config="localeConfig"
                  @change="requireUpdateChange"
                />
                <el-button
                  v-for="x in [1, -1, 7, -7]"
                  :key="x"
                  type="text"
                  class="stampDeltaModify"
                  @click="setApplyStamp(x)"
                >{{ x > 0 ? "+" : "" }}{{ x }}</el-button>
                <span>
                  <span style="margin-left:1rem">预计归队</span>
                  <el-date-picker
                    v-model="formApply.StampReturn"
                    disabled
                    placeholder="自动计算"
                    type="date"
                    format="yyyy年MM月dd日"
                    value-format="yyyy-MM-dd"
                  />
                </span>
              </div>
            </el-form-item>
            <el-form-item
              v-if="nowVacationType && nowVacationType.caculateBenefit"
            >
              <div style="display:flex">
                <el-collapse-transition
                  v-for="(item, i) in lawVacations"
                  :key="item.id"
                >
                  <LawVacation
                    v-model="lawVacations[i].useLength"
                    :max-length="item.length"
                    :name="item.name"
                    :start="item.start"
                    style="margin:0.2rem"
                  />
                </el-collapse-transition>
              </div>
            </el-form-item>
            <el-form-item v-if="show_detail_date" label="预计归队">
              <div :style="{ width: '35rem' }" @mousemove="reset_detail_dater">
                <CNCalendar
                  :params="{
                    chooseDayTextStart: formApply.StampLeave,
                    chooseDayTextEnd: formApply.StampReturn
                    // minDate: '2019-10-1',
                    // maxDate: '2020-1-1',
                  }"
                  type="rangeDay"
                  :activity-data="dataForCalendar"
                />
              </div>
            </el-form-item>
            <el-form-item
              label="目的地"
              :rules="[{ required: true, trigger: 'blur' }]"
            >
              <CascaderSelector
                v-model="formApply.vacationPlace"
                :child-getter-method="locationChildren"
                value-name="code"
                label-name="name"
                :placeholder="
                  vacationPlaceDefault &&
                    vacationPlaceDefault.code == formApply.vacationPlace.code
                    ? vacationPlaceDefault.name
                    : ''
                "
                style="width:30rem"
              />
            </el-form-item>
            <el-form-item label="详细地址">
              <el-input
                v-model="formApply.vacationPlaceName"
                style="width:30rem"
              />
            </el-form-item>
            <el-form-item label="出行方式">
              <el-select
                v-model="formApply.ByTransportation"
                placeholder="火车"
              >
                <el-option label="火车" :value="0" />
                <!-- <el-option label="飞机" value="1" /> -->
                <el-option label="汽车" :value="2" />
                <el-option label="其他" :value="-1" />
              </el-select>
            </el-form-item>
          </el-form>
        </el-main>
        <el-aside
          width="0.1%"
          style="padding:0;margin:0;text-align:center;background: rgb(255, 255, 255)"
        >
          <div
            class="mask"
            :style="{
              filter: hideDetail ? '' : 'blur(30px)',
              background: hideDetail ? '#ffffff8f' : ''
            }"
          >
            <svg-icon
              :style="{
                transition: 'all 0.5s',
                opacity: hideDetail ? 1 : 0,
                transform: hideDetail ? 'rotate(-360deg)' : ''
              }"
              icon-class="certification_f"
              style-normal="width:5em;height:5em;fill:#67C23A;color:#67C23A"
            />
          </div>
        </el-aside>
      </el-container>
    </el-card>
  </div>
</template>

<script>
import { postRequestInfo, getStampReturn } from '@/api/apply/create'
import { parseTime, debounce } from '@/utils'
import { locationChildren } from '@/api/common/static'
import { getUsersVacationLimit } from '@/api/user/userinfo'
import localeConfig from '@/lang/locale-config'

export default {
  name: 'RequestInfo',
  components: {
    CardTooltipAlert: () => import('../FormHelper/CardTooltipAlert'),
    VacationDescription: () =>
      import('@/components/Vacation/VacationDescription'),
    VacationTypeSelector: () =>
      import('@/components/Vacation/VacationTypeSelector'),
    CascaderSelector: () => import('@/components/CascaderSelector'),
    BenefitVacation: () => import('./BenefitVacation'),
    LawVacation: () => import('./LawVacation'),
    DatetimePicker: () => import('vue-persian-datetime-picker'),
    CNCalendar: () => import('@/components/CNCalendar')
  },
  props: {
    userid: { type: String, default: null },
    selfSettle: { type: Object, default: null },
    entityType: { type: String, default: 'vacation' }
  },
  data: () => ({
    localeConfig,
    dataForCalendar: {},
    show_detail_date: false,
    loading: false,
    formApply: {}, // 通过Create创建
    vacationPlaceDefault: null,
    vacationTypes: null,
    yearSelect: new Date().getFullYear(),
    usersvacation: {
      yearlyLength: 0,
      nowTimes: 0,
      leftLength: 0,
      onTripTimes: 0,
      maxTripTimes: 0
    },
    tip_no_vacation: true,
    TipTripAdvance:
      '额外路途（以实际乘坐的车次所耗时间为准，不再取最慢车次时间，故一般为0天），需报业务部门审批通过后再行添加。',
    benefitList: [],
    lawVacations: [],
    submitId: null,
    isHover: false,
    anyChanged: false,
    nowMaxLength: 30,
    mainStatus: -1, // 0:正式报 1:无效 2:计划 4:因公
    direct_select_apply: null,
    rules: {
      forWorkReason: [
        { required: true, message: '请输入因公原因', trigger: 'blur' },
        { min: 1, max: 30, message: '请输入因公原因', trigger: 'blur' }
      ]
    }
  }),
  computed: {
    vacationYear() {
      const { formApply } = this
      const leave = formApply && formApply.StampLeave
      const vacationYear = new Date(leave || new Date()).getFullYear()
      return vacationYear
    },
    theme() {
      return this.$store.state.settings.theme
    },
    nowVacationType() {
      const { formApply, vacationTypes } = this
      const type = formApply && formApply.vacationType
      if (!vacationTypes) return null
      return vacationTypes.find(v => v.name === type)
    },
    // above 3 computed should remove in the future
    maxVacationLength() {
      const type = this.nowVacationType
      if (!type) return 0
      const isPrimary = type.primary
      const leftLength = Math.min(
        this.usersvacation.leftLength,
        type.maxLength
      )
      const r = isPrimary ? leftLength : this.nowMaxLength
      return r > 0 ? r : 0
    },
    hideDetail() {
      return this.submitId && !this.isHover
    },
    nowYear() {
      var date = new Date()
      return date.getFullYear()
    },
    currentUser() {
      return this.$store.state.user.data
    },
    filtedBenefitList() {
      return this.benefitList.filter(i => i && i.name && i.length)
    },
    requireUpdateChange() {
      return debounce(() => {
        this.updateChange()
      }, 1e2)
    }
  },
  watch: {
    userid: {
      handler(v) {
        this.tip_no_vacation = false // 换人则重置提醒
      }
    },
    yearSelect: {
      handler(val) {
        const { vacationYear } = this
        if (vacationYear === val) return
        // 跳转到该年份的1月1
        this.setApplyStamp(new Date(val, 0, 1))
      }
    },
    vacationTypes: {
      handler(val) {
        if (!val) return
        this.$nextTick(() => {
          if (!this.formApply) {
            this.formApply = this.createNewRequest()
          }
          this.formApply.vacationType = val[0].name
        })
      }
    },
    mainStatus: {
      handler(val) {
        this.$nextTick(() => {
          this.requireUpdateChange()
        })
      }
    },
    lawVacations: {
      handler(val) {
        this.requireUpdateChange()
      },
      deep: true
    },
    formApply: {
      handler(val) {
        if (val && !this.loading) {
          this.$nextTick(() => {
            this.updatedApply()
          })
        }
      },
      deep: true
    },
    'formApply.vacationType': {
      handler(val) {
        this.$emit('vacationTypeUpdate', val)
      }
    },
    'formApply.OnTripLengthBase': {
      handler(v) {
        this.onTripLengthChanged()
      }
    },
    'formApply.OnTripLengthAdvance': {
      handler(v) {
        this.onTripLengthChanged()
      }
    },
    selfSettle: {
      handler(val) {
        this.resetSettle(val)
      },
      deep: true
    }
  },
  mounted() {
    this.reset()
  },
  methods: {
    locationChildren,
    setApplyStamp(delta, field = 'StampLeave') {
      const prev_val = new Date(this.formApply[field])
      const is_delta = Math.abs(delta) < 10
      const new_val = is_delta ? prev_val.getTime() + 86400e3 * delta : delta
      this.formApply[field] = parseTime(new Date(new_val), '{y}-{m}-{d}')
      if (field === 'StampLeave') this.requireUpdateChange()
    },
    beforeSubmitApply() {
      this.checkTripAdvance(false)
    },
    onTripLengthChanged() {
      const form = this.formApply
      this.checkTripAdvance()
      form.OnTripLength = form.OnTripLengthBase + form.OnTripLengthAdvance
    },
    checkTripAdvance(ignore = true) {
      const form = this.formApply
      ignore = this.OnTripLengthAdvanceConfirmed && ignore
      if (form.OnTripLengthAdvance > 0 && !ignore) {
        this.$confirm(this.TipTripAdvance, {
          type: 'warning',
          title: '注意',
          confirmButtonText: '已联系并通过业务部门审批'
        })
          .then(() => {
            this.OnTripLengthAdvanceConfirmed = true
          })
          .catch(e => {
            form.OnTripLengthAdvance = 0
          })
      }
    },
    updatedApply() {
      this.anyChanged = true
      this.submitId = null
      this.$emit('update:submitId', null)
      const vl = this.formApply.vacationLength
      const nm = this.nowMaxLength
      if (vl > 0.7 * nm || (vl < 2 * nm && nm > 30)) {
        this.updateMaxLen()
      }
    },
    updateMaxLen() {
      const type = this.nowVacationType
      if (!type) return
      let newLength = this.formApply.vacationLength * 1.5 + 1
      const maxMin = Math.min(type.maxLength, 30)
      if (newLength < maxMin) newLength = maxMin
      if (newLength > type.maxLength) newLength = type.maxLength
      this.nowMaxLength = newLength
    },
    stampLeaveRuleCheck(field, invalid, cb) {
      const i = new Date(this.formApply[field.field]) < new Date('2000-1-1')
      if (i) return cb(new Error('离队时间不合法'))
      cb()
    },
    leaveCard() {
      this.isHover = false
      this.submitRequestInfo()
    },
    // call by base info ,DO NOT REMOVE
    refreshVacation() {
      const { userid, mainStatus, vacationYear } = this
      getUsersVacationLimit({ userid, vacationYear, mainStatus })
        .then(data => {
          this.usersvacation = data
          if (data && data.leftLength) return
          if (this.tip_no_vacation) return
          this.tip_no_vacation = true
          const target = this.yearSelect + 1
          this.$confirm(
            `本年度(${this.yearSelect})已无假可用，是否切换到${target}年度？`
          ).then(() => {
            this.yearSelect = target
          })
        })
        .finally(() => {
          this.resetLoading()
        })
    },
    resetSettle(val) {
      if (val && val.self && val.self.address) {
        const self = val.self.address
        const social = [val.parent, val.lover, val.loversParent]
        const checkDic = social.map(i => i.address)
        const target = checkDic.find(i => i && i.code !== self.code)
        if (target) {
          const likely = Object.assign({}, target)
          this.formApply.vacationPlace = likely
          likely.name = `${likely.name}(默认休假地点)`
          this.vacationPlaceDefault = likely
        }
      }
    },
    reset() {
      console.log('reset request')
      this.formApply = this.createNewRequest()
      this.resetLoading()
    },
    resetLoading() {
      this.loading = false
      this.anyChanged = false
      this.updatedApply()
    },
    createNewRequest() {
      const types = this.vacationTypes
      return {
        StampLeave: this.setApplyStamp(+new Date() + 86400e3),
        StampReturn: '',
        vacationLength: 0,
        OnTripLengthAdvance: 0,
        OnTripLengthAdvanceConfirmed: false,
        OnTripLengthBase: 0,
        vacationType: types ? types[0].name : '',
        vacationPlace: {},
        vacationPlaceName: '',
        lawVacaion: [],
        reason: '',
        forWorkReason: null,
        ByTransportation: 0
      }
    },
    checkParamValid(params) {
      const id = !params.id
      const place =
        !params.vacationPlace ||
        !params.vacationPlace.code ||
        params.vacationPlace.code.length < 6
      const stamp =
        !params.StampLeave ||
        new Date(params.StampLeave) < new Date('2000-1-1')
      const result = []
      if (id) result.push('基础信息未成功提交')
      if (place) {
        result.push(
          `休假地点须精确到区县，当前:${(params.vacationPlace &&
            params.vacationPlace.code) ||
            '未填写'}`
        )
      }
      if (stamp) result.push('离队时间有误')
      return result
    },
    /**
     * 提交请求信息
     */
    submitRequestInfo() {
      if (this.loading || !this.anyChanged || this.mainStatus === -1) return
      this.submitId = null
      this.$emit('update:submitId', null)

      const caculaingDate = this.caculaingDate()
      if (caculaingDate.total <= 0) return

      let s = Object.assign({ id: this.userid }, this.formApply)

      s.vacationAdditionals = this.filtedBenefitList
      const items = this.checkParamValid(s)
      if (items.length > 0) {
        this.anyChanged = false
        this.$message.error(items.join(' '))
        return
      }
      this.$refs.primaryForm.validate(valid => {
        if (!valid) return this.$message.error('无效的信息，请检查')
        s.vacationPlace = s.vacationPlace.code
        this.loading = true
        s = Object.assign({ lawVacationSet: this.lawVacations }, s)
        postRequestInfo(s, this.entityType)
          .then(data => {
            this.$message.success('休假信息验证成功')
            this.submitId = data.id
            this.$emit('update:submitId', data.id)
            this.$emit('update:mainStatus', this.mainStatus)
            setTimeout(() => {
              this.$emit('submited', true)
            }, 200)
          })
          .catch(() => {
            this.$emit('submited', false)
          })
          .finally(() => {
            this.loading = false
            this.anyChanged = false
          })
      })
    },
    updateChange() {
      const caculaingDate = this.caculaingDate()
      this.refreshVacation()
      if (caculaingDate.total <= 0) return
      this.formApply.isArchitect = new Date(caculaingDate.start) <= new Date()
      let s = Object.assign({}, caculaingDate)
      const lawVacations = this.lawVacations
      s = Object.assign({ lawVacationSet: lawVacations }, s)
      getStampReturn(s).then(data => {
        if (!data) return
        this.setApplyStamp(data.endDate, 'StampReturn')
        const des = data.descriptions ? data.descriptions : []
        const t1 = lawVacations.length !== des.length
        const t2 = des.find(i => {
          const item = lawVacations.find(l => i.id === l.id)
          return !item || item.length !== i.length
        })
        if (t1 || t2) this.lawVacations = des
        this.show_detail_date = true
        this.reset_detail_dater()
      })
    },
    reset_detail_dater() {
      clearTimeout(this.show_detail_dater)
      this.show_detail_dater = setTimeout(() => {
        this.show_detail_date = false
      }, 10e3)
    },
    caculaingDate() {
      if (!this.formApply.StampLeave) return {}
      const benefits = this.filtedBenefitList.reduce((prev, cur) => {
        return prev + cur.length
      }, 0)
      // 正休假计算路途，如果存在福利假则不计算法定节假日
      const type = this.nowVacationType
      if (!type) return {}
      const trip = type.canUseOnTrip
      const benefit = type.caculateBenefit

      const primary = parseInt(this.formApply.vacationLength)
      const onTrip = parseInt(this.formApply.OnTripLength)
      let total = primary
      if (trip) total += onTrip
      if (benefit) total += benefits
      return {
        start: this.formApply.StampLeave,
        length: primary + onTrip, // 福利假不可累积法定节假日，只计算正休和路途
        benefits,
        total,
        caculateLawvacation: benefit
      }
    }
  }
}
</script>
<style lang="scss" scoped>
@import "@/styles/animation";
</style>
