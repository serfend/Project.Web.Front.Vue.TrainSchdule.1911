<template>
  <div
    v-if="nowVacationType"
    :style="{transition:'all 0.5s'}"
    @mouseenter="isHover=true"
    @mouseleave="leaveCard"
  >
    <el-card v-loading="onLoading" header="休假信息" style="position:relative">
      <el-container>
        <el-main :style="{filter:hideDetail?'blur(0.2rem)':''}">
          <CardTooltipAlert :accept="submitId" :accepting="anyChanged">
            <template slot="content">鼠标移到休假进度条上可查看年度休假情况，有误请联系业务口。</template>
          </CardTooltipAlert>
          <el-alert v-if="formApply.isArchitect" center type="error">补充申请 申请将会被标记为【补充记录】</el-alert>
          <el-form ref="formApply" :model="formApply" label-width="5rem">
            <el-form-item label="年休假率">
              <VacationDescription
                :users-vacation="usersvacation"
                :this-time-vacation-length="nowVacationType.primary?formApply.vacationLength:0"
              />
            </el-form-item>
            <el-form-item label="休假类型">
              <VacationTypeSelector
                v-model="formApply.vacationType"
                :types="vacationTypes"
                :left-length="usersvacation.leftLength"
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
            <el-alert
              title="注意：正休天数范围内可含的法定节假日。若您核实到前期未被正常包含法定节假日的，请联系业务口处理补回。"
              type="warning"
              show-icon
            />
            <el-form-item label="休假天数">
              <el-slider
                v-model="formApply.vacationLength"
                show-input
                :max="maxVacationLength"
                :min="0"
                @input="handleChange"
              />
            </el-form-item>
            <el-form-item v-if="nowVacationType.canUseOnTrip" label="路途天数">
              <el-slider
                v-model="formApply.OnTripLength"
                show-input
                :max="14"
                :min="0"
                @input="handleChange"
              />
            </el-form-item>
            <el-form-item v-if="nowVacationType.caculateBenefit" label="其他假">
              <BenefitVacation v-model="benefitList" @change="handleChange" />
            </el-form-item>
            <el-form-item
              label="离队时间"
              prop="StampLeave"
              :rules="[{required:true,validator:stampLeaveRuleCheck,trigger:'blur'}]"
            >
              <el-date-picker
                v-model="formApply.StampLeave"
                placeholder="选择日期"
                type="date"
                format="yyyy年MM月dd日"
                value-format="yyyy-MM-dd"
                @change="handleChange"
              />
            </el-form-item>
            <el-form-item label="预计归队">
              <el-date-picker
                v-model="formApply.StampReturn"
                disabled
                placeholder="自动计算"
                type="date"
                format="yyyy年MM月dd日"
                value-format="yyyy-MM-dd"
              />
            </el-form-item>
            <el-form-item
              v-if="lawVacations.length>0&&nowVacationType.caculateBenefit"
              label="法定节假日"
            >
              <LawVacation
                v-for="(item,i) in lawVacations"
                :key="i"
                v-model="lawVacations[i].useLength"
                :max-length="item.length"
                :name="item.name"
                :description="item.description"
                :start="item.start"
                style="margin:0.2rem"
              />
            </el-form-item>
            <el-form-item label="目的地" :rules="[{required:true,trigger:'blur'}]">
              <CascaderSelector
                v-model="formApply.vacationPlace"
                :child-getter-method="locationChildren"
                :value-name="'code'"
                :label-name="'name'"
                :placeholder="vacationPlaceDefault&&vacationPlaceDefault.code==formApply.vacationPlace.code?vacationPlaceDefault.name:''"
                style="width:30rem"
              />
            </el-form-item>
            <el-form-item label="详细地址">
              <el-input v-model="formApply.vacationPlaceName" style="width:30rem" />
            </el-form-item>
            <el-form-item label="交通工具">
              <el-select v-model="formApply.ByTransportation" placeholder="火车">
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
            :style="{filter:hideDetail?'':'blur(30px)',background:hideDetail?'#ffffff8f':''}"
          >
            <svg-icon
              :style="{transition:'all 0.5s',opacity:hideDetail?1:0,transform:hideDetail?'rotate(-360deg)':''}"
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
import { parseTime } from '@/utils'
import CardTooltipAlert from '../FormHelper/CardTooltipAlert'
import VacationDescription from '@/components/Vacation/VacationDescription'
import VacationTypeSelector from '@/components/Vacation/VacationTypeSelector'
import CascaderSelector from '@/components/CascaderSelector'
import BenefitVacation from './BenefitVacation'
import LawVacation from './LawVacation'
import { locationChildren } from '@/api/common/static'
import { getUsersVacationLimit } from '@/api/user/userinfo'
import { debounce } from '@/utils'

export default {
  name: 'RequestInfo',
  components: {
    CardTooltipAlert,
    VacationDescription,
    VacationTypeSelector,
    CascaderSelector,
    BenefitVacation,
    LawVacation,
  },
  props: {
    userid: {
      type: String,
      default: null,
    },
    selfSettle: {
      type: Object,
      default: null,
    },
  },
  data() {
    return {
      onLoading: true,
      formApply: null,
      vacationPlaceDefault: null,
      usersvacation: {
        yearlyLength: 0,
        nowTimes: 0,
        leftLength: 0,
        onTripTimes: 0,
        maxTripTimes: 0,
      },
      benefitList: [],
      lawVacations: [],
      submitId: null,
      isHover: false,
      anyChanged: false,
      nowMaxLength: 30,
    }
  },
  computed: {
    nowVacationType() {
      const form = this.formApply
      if (!form) return null
      const dict = this.vacationTypesDic
      if (!dict) return null
      const s = dict[form.vacationType]
      return s
    },
    vacationTypes() {
      const types = this.vacationTypesDic
      if (!types) return null
      const keys = Object.keys(types)
      return keys.map((i) => types[i])
    },
    vacationTypesDic() {
      return this.$store.state.vacation.vacationTypes
    },
    // above 3 computed should remove in the future
    maxVacationLength() {
      const type = this.nowVacationType
      if (!type) return 0
      const isPrimary = type.primary
      const leftLength = Math.min(this.usersvacation.leftLength, type.maxLength)
      return isPrimary ? leftLength : this.nowMaxLength
    },
    updatedApply() {
      return debounce(() => {
        const vl = this.formApply.vacationLength
        const nm = this.nowMaxLength
        if (vl > 0.7 * nm || (vl < 2 * nm && nm > 30)) {
          this.updateMaxLen()
        }
      }, 500)
    },
    requireSubmit() {
      return debounce(() => {
        this.submitRequestInfo()
      }, 500)
    },
    updatedChange() {
      return debounce(this.updateChangeDirect, 500)
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
      return this.benefitList.filter((i) => i && i.name && i.length)
    },
  },
  watch: {
    vacationTypes: {
      handler(val) {
        if (!val) return
        this.$nextTick(() => {
          if (!this.formApply) {
            this.formApply = this.createNewRequest()
          }
          this.formApply.vacationType = val[0].name
        })
      },
    },
    formApply: {
      handler(val) {
        if (val && !this.onLoading) {
          this.anyChanged = true
          this.$nextTick(() => {
            this.updatedApply()
          })
        }
      },
      deep: true,
    },
    selfSettle: {
      handler(val) {
        this.resetSettle(val)
      },
      deep: true,
    },
  },
  methods: {
    locationChildren,
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
      this.requireSubmit()
    },
    // call by base info ,DO NOT REMOVE
    refreshVacation() {
      getUsersVacationLimit(this.userid)
        .then((data) => {
          this.usersvacation = data
        })
        .finally(() => {
          this.resetLoading()
        })
    },
    resetSettle(val) {
      if (val && val.self && val.self.address) {
        const self = val.self.address
        const social = [val.parent, val.lover, val.loversParent]
        const checkDic = social.map((i) => i.address)
        const target = checkDic.find((i) => i && i.code !== self.code)
        if (target) {
          const likely = Object.assign({}, target)
          this.formApply.vacationPlace = likely
          likely.name = `${likely.name}(已为您默认填写可能休假的地点)`
          this.vacationPlaceDefault = likely
        }
      }
    },
    reset() {
      this.formApply = this.createNewRequest()
      this.resetLoading()
    },
    resetLoading() {
      this.onLoading = false
      this.anyChanged = false
    },
    createNewRequest() {
      const types = this.vacationTypes
      return {
        StampLeave: parseTime(+new Date() + 86400000, '{y}-{m}-{d}'),
        StampReturn: '',
        vacationLength: 0,
        OnTripLength: 0,
        vacationType: types ? types[0].name : '',
        vacationPlace: null,
        vacationPlaceName: '',
        reason: '',
        ByTransportation: 0,
      }
    },
    checkParamValid(params) {
      console.log(params)
      const id = !params.id
      const place =
        !params.vacationPlace ||
        !params.vacationPlace.code ||
        params.vacationPlace.code.length < 6
      const stamp =
        !params.StampLeave || new Date(params.StampLeave) < new Date('2000-1-1')
      const result = []
      if (id) result.push('基础信息未成功提交')
      if (place) {
        result.push(`休假地点须精确到区县，当前:${params.vacationPlace.code}`)
      }
      if (stamp) result.push('离队时间有误')
      return result
    },
    /**
     * 提交请求信息
     */
    submitRequestInfo() {
      if (this.onLoading || !this.anyChanged) return
      this.anyChanged = false
      this.submitId = null
      this.$emit('update:submitId', null)

      const caculaingDate = this.caculaingDate()
      if (caculaingDate.length < 0) return

      const model = Object.assign({ id: this.userid }, this.formApply)
      model.vacationAdditionals = this.filtedBenefitList
      const items = this.checkParamValid(model)
      if (items.length > 0) {
        this.anyChanged = false
        this.$message.error(items.join(' '))
        return
      }

      model.vacationPlace = model.vacationPlace.code
      this.onLoading = true
      postRequestInfo(model)
        .then((data) => {
          this.$message.success('休假信息验证成功')
          this.submitId = data.id
          this.$emit('update:submitId', data.id)
          setTimeout(() => {
            this.$emit('submited', true)
          }, 200)
        })
        .catch(() => {
          this.$emit('submited', false)
        })
        .finally(() => {
          this.onLoading = false
        })
    },
    /**
     * 用户计算预期归队日期
     */
    handleChange() {
      this.updatedChange()
    },
    updateChangeDirect() {
      const caculaingDate = this.caculaingDate()
      if (caculaingDate.length < 0) return
      this.formApply.isArchitect = new Date(caculaingDate.start) <= new Date()
      getStampReturn(caculaingDate).then((data) => {
        this.formApply.StampReturn = parseTime(data.endDate, '{y}-{m}-{d}')
        const des = data.descriptions ? data.descriptions : []
        this.lawVacations = des.map((i) => {
          i.useLength = i.length
          return i
        })
      })
    },
    caculaingDate() {
      if (!this.formApply.StampLeave) return
      const benefits = this.filtedBenefitList.reduce((prev, cur) => {
        return prev + cur.length
      }, 0)
      // 正休假计算路途，如果存在福利假则不计算法定节假日
      const type = this.nowVacationType
      const trip = type.canUseOnTrip
      const benefit = type.caculateBenefit

      const primary = parseInt(this.formApply.vacationLength)
      const onTrip = parseInt(this.formApply.OnTripLength)
      let total = primary
      if (trip) total += onTrip
      // if (benefit) total += benefits // 福利假不可累积法定节假日
      return {
        start: this.formApply.StampLeave,
        length: total,
        benefits,
        caculateLawvacation: benefit,
      }
    },
  },
}
</script>

<style>
</style>
