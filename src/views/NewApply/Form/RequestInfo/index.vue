<template>
  <div :style="{transition:'all 0.5s'}" @mouseenter="isHover=true" @mouseleave="leaveCard">
    <el-card v-loading="onLoading" header="休假信息" style="position:relative">
      <el-container>
        <el-main :style="{filter:hideDetail?'blur(0.2rem)':''}">
          <CardTooltipAlert :accept="submitId" :accepting="anyChanged">
            <template slot="content">鼠标移到休假进度条上可查看年度休假情况，有误请联系业务口。</template>
          </CardTooltipAlert>
          <el-form ref="formApply" :model="formApply" label-width="10rem">
            <el-form-item label="休假年度">
              <el-radio-group v-model="submitYear">
                <el-radio :label="nowYear">本年度休假({{ nowYear }}年)</el-radio>
                <el-radio :label="nowYear+1">下一年度休假({{ nowYear + 1 }}年)</el-radio>
              </el-radio-group>
            </el-form-item>
            <el-form-item label="全年休假完成率">
              <VacationDescription
                :users-vacation="usersvacation"
                :this-time-vacation-length="formApply.vacationType=='正休'?formApply.vacationLength:0"
              />
            </el-form-item>
            <el-form-item label="休假类型">
              <el-select v-model="formApply.vacationType">
                <el-option label="正休" value="正休" />
                <el-option label="事假" value="事假" />
                <el-option label="病休" value="病休" />
              </el-select>
              <el-tooltip placement="top">
                <div slot="content">如果您存在前期已休过假，但未记录的情况，申请将会被标记为【补充记录】</div>
                <el-switch
                  v-model="formApply.isArchitect"
                  active-text="补充记录"
                  inactive-text="新增申请"
                  active-color="#ff9999"
                />
              </el-tooltip>
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
                @input="handleChange"
              />
            </el-form-item>
            <el-form-item label="路途天数">
              <el-slider
                v-model="formApply.OnTripLength"
                show-input
                :max="14"
                :min="0"
                @input="handleChange"
              />
            </el-form-item>
            <el-form-item v-if="formApply.vacationType=='正休'" label="福利假">
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
            <el-form-item v-if="lawVacations.length>0&&formApply.vacationType=='正休'" label="法定节假日">
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
            <el-form-item
              label="休假目的地"
              prop="vacationPlace"
              :rules="[{required:true,trigger:'blur'}]"
            >
              <cascader-selector
                :code.sync="formApply.vacationPlace"
                :child-getter-method="locationChildren"
                :placeholder="vacationPlaceDefault&&vacationPlaceDefault.code==formApply.vacationPlace?vacationPlaceDefault.name:''"
                style="width:30rem"
              />
            </el-form-item>
            <el-form-item label="详细地址">
              <el-input v-model="formApply.vacationPlaceName" style="width:30rem" />
            </el-form-item>
            <el-form-item label="所乘交通工具">
              <el-select v-model="formApply.ByTransportation" placeholder="火车">
                <el-option label="火车" value="0" />
                <!-- <el-option label="飞机" value="1" /> -->
                <el-option label="汽车" value="2" />
                <el-option label="其他" value="-1" />
              </el-select>
            </el-form-item>
          </el-form>
        </el-main>
        <el-aside
          width="2%"
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
import { postRequestInfo, getStampReturn } from '@/api/apply'
import { parseTime } from '@/utils'
import CardTooltipAlert from '../FormHelper/CardTooltipAlert'
import VacationDescription from '@/components/Vacation/VacationDescription'
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
    CascaderSelector,
    BenefitVacation,
    LawVacation
  },
  props: {
    userid: {
      type: String,
      default: null
    },
    selfSettle: {
      type: Object,
      default: null
    }
  },
  data() {
    return {
      onLoading: true,
      formApply: this.createNewRequest(),
      vacationPlaceDefault: null,
      submitYear: new Date().getFullYear(),
      usersvacation: {
        yearlyLength: 0,
        nowTimes: 0,
        leftLength: 0,
        onTripTimes: 0,
        maxTripTimes: 0
      },
      benefitList: [],
      lawVacations: [],
      submitId: null,
      isHover: false,
      anyChanged: false,
      nowMaxLength: 30
    }
  },
  computed: {
    maxVacationLength() {
      const isPrimary = this.formApply.vacationType === '正休'
      const leftLength = this.usersvacation.leftLength
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
      return this.benefitList.filter(i => i && i.name && i.length)
    }
  },
  watch: {
    submitYear: {
      handler(val) {
        this.formApply.yearIndex = val
      }
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
      deep: true
    },
    selfSettle: {
      handler(val) {
        this.resetSettle(val)
      },
      deep: true
    }
  },
  methods: {
    locationChildren,
    updateMaxLen() {
      let newLength = this.formApply.vacationLength * 1.5 + 1
      if (newLength < 30) newLength = 30
      if (newLength > 999) newLength = 999
      this.nowMaxLength = Math.round(newLength / 5) * 5
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
    resetSettle(val) {
      if (val && val.self && val.self.address) {
        const self = val.self.address
        const social = [val.parent, val.lover, val.loversParent]
        const checkDic = social.map(i => i.address)
        const target = checkDic.find(i => i && i.code !== self.code)
        if (target) {
          this.formApply.vacationPlace = target.code
          const likely = Object.assign({}, target)
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
    refreshVacation() {
      getUsersVacationLimit(this.userid, this.formApply.yearIndex)
        .then(data => {
          this.usersvacation = data
        })
        .finally(() => {
          this.resetLoading()
        })
    },
    createNewRequest() {
      return {
        StampLeave: parseTime(+new Date() + 86400000, '{y}-{m}-{d}'),
        StampReturn: '',
        vacationLength: 0,
        OnTripLength: 0,
        vacationType: '正休',
        vacationPlace: '0',
        vacationPlaceName: '',
        reason: '',
        ByTransportation: '0',
        yearIndex: new Date().getFullYear()
      }
    },
    checkParamValid(params) {
      const id = !params.id
      const place = !params.vacationPlace || params.vacationPlace.length < 6
      const stamp =
        !params.StampLeave || new Date(params.StampLeave) < new Date('2000-1-1')
      return !(id || place || stamp)
    },
    /**
     * 提交请求信息
     */
    submitRequestInfo() {
      if (this.onLoading) return
      if (this.anyChanged) this.anyChanged = false
      const caculaingDate = this.caculaingDate()
      if (caculaingDate.length <= 0) return
      const infoParam = Object.assign({ id: this.userid }, this.formApply)
      infoParam.vacationAdditionals = this.filtedBenefitList
      if (!this.checkParamValid(infoParam)) {
        this.anyChanged = false
        return
      }
      this.onLoading = true

      postRequestInfo(infoParam)
        .then(data => {
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
      if (caculaingDate.length <= 0) return
      this.formApply.isArchitect = new Date(caculaingDate.start) <= new Date()
      getStampReturn(caculaingDate).then(data => {
        this.formApply.StampReturn = parseTime(data.endDate, '{y}-{m}-{d}')
        const des = data.descriptions ? data.descriptions : []
        this.lawVacations = des.map(i => {
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
      const ifPrimary = this.formApply.vacationType === '正休'
      const primary = parseInt(this.formApply.vacationLength)
      const onTrip = parseInt(this.formApply.OnTripLength)
      const others = ifPrimary ? onTrip + benefits : 0
      return {
        start: this.formApply.StampLeave,
        length: primary + others,
        caculateLawvacation: ifPrimary && benefits === 0
      }
    }
  }
}
</script>

<style>
</style>
