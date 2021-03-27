<template>
  <div :style="{transition:'all 0.5s'}" @mouseenter="isHover=true" @mouseleave="leaveCard">
    <el-card v-loading="loading" header="请假信息" style="position:relative">
      <el-container>
        <el-main :style="{filter:hideDetail?'blur(0.2rem)':''}">
          <CardTooltipAlert :accept="submitId" :accepting="anyChanged">
            <template slot="content">暂仅允许请当天的假，不允许跨天请假.</template>
          </CardTooltipAlert>
          <el-alert v-if="formApply.isArchitect" center type="error">补充申请 申请将会被标记为【补充记录】</el-alert>
          <el-form ref="formApply" :model="formApply" label-width="6rem">
            <el-form-item label="请假原因">
              <el-input
                v-model="formApply.reason"
                type="textarea"
                maxlength="30"
                show-word-limit
                style="width:30rem"
              />
            </el-form-item>
            <el-form-item label="请假时间" prop="StampLeave" :rules="[{required:true,trigger:'blur'}]">
              <el-date-picker
                v-model="StampLeaveAndReturn"
                type="datetimerange"
                range-separator="到"
                start-placeholder="离队时间"
                end-placeholder="归队时间"
                placeholder="选择请假时间"
                value-format="yyyy-MM-dd HH:mm:ss"
                :default-time="['08:00:00', '18:00:00']"
                @change="updateChange"
              />
            </el-form-item>
            <el-form-item label="目的地" :rules="[{required:true,trigger:'blur'}]">
              <CascaderSelector
                v-model="formApply.vacationPlace"
                :child-getter-method="locationChildren"
                :value-name="'code'"
                :label-name="'name'"
                :placeholder="vacationPlaceDefault"
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
                <el-option label="地铁" :value="3" />
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
import { postRequestInfo } from '@/api/apply/create'
import { parseTime } from '@/utils'
import CardTooltipAlert from '../FormHelper/CardTooltipAlert'
import CascaderSelector from '@/components/CascaderSelector'
import { locationChildren } from '@/api/common/static'

export default {
  name: 'RequestInfo',
  components: {
    CardTooltipAlert,
    CascaderSelector
  },
  props: {
    userid: { type: String, default: null },
    selfSettle: { type: Object, default: null },
    entityType: { type: String, default: 'vacation' }
  },
  data() {
    return {
      loading: true,
      formApply: this.createNewRequest(),
      vacationPlaceDefault: null,
      submitId: null,
      isHover: false,
      anyChanged: false
    }
  },
  computed: {
    StampLeaveAndReturn: {
      get() {
        const s = this.formApply
        return [s.StampLeave, s.StampReturn]
      },
      set(val) {
        const s = this.formApply
        s.StampLeave = val[0]
        s.StampReturn = val[1]
      }
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
    }
  },
  watch: {
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
    selfSettle: {
      handler(val) {
        this.resetSettle(val)
      },
      deep: true
    }
  },
  methods: {
    resetSettle(val) {
      if (val && val.self && val.self.address) {
        const self = val.self.address
        if (self) {
          const likely = Object.assign({}, self)
          this.formApply.vacationPlace = likely
          likely.name = `${likely.name}(默认请假地点)`
          this.vacationPlaceDefault = likely.name
        }
      }
    },
    createNewRequest() {
      return {
        StampLeave: parseTime(+new Date() + 86400e3, '{y}-{m}-{d} 08:00:00'),
        StampReturn: parseTime(+new Date() + 86400e3, '{y}-{m}-{d} 18:00:00'),
        vacationPlace: null,
        vacationPlaceName: '',
        reason: '',
        ByTransportation: 2
      }
    },
    locationChildren,
    updatedApply() {
      this.anyChanged = true
      this.submitId = null
      this.$emit('update:submitId', null)
    },
    leaveCard() {
      this.isHover = false
      this.submitRequestInfo()
    },
    // call by base info ,DO NOT REMOVE
    refreshVacation() {},
    reset() {
      this.formApply = this.createNewRequest()
      this.resetLoading()
    },
    resetLoading() {
      this.loading = false
      this.anyChanged = false
      this.updatedApply()
    },
    checkParamValid(params) {
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
        result.push(
          `地点须精确到区县，当前:${params.vacationPlace &&
            params.vacationPlace.code}`
        )
      }
      if (stamp) result.push('离队时间有误')
      return result
    },
    /**
     * 提交请求信息
     */
    submitRequestInfo() {
      if (this.loading || !this.anyChanged) return
      this.submitId = null
      this.$emit('update:submitId', null)

      let s = Object.assign({ id: this.userid }, this.formApply)

      const items = this.checkParamValid(s)
      if (items.length > 0) {
        this.anyChanged = false
        this.$message.error(items.join(' '))
        return
      }
      s.vacationPlace = s.vacationPlace.code
      this.loading = true
      s = Object.assign({ lawVacationSet: this.lawVacations }, s)
      postRequestInfo(s, this.entityType)
        .then(data => {
          this.$message.success('请假信息验证成功')
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
          this.loading = false
          this.anyChanged = false
        })
    },
    updateChange() {
      this.refreshVacation()
    }
  }
}
</script>
