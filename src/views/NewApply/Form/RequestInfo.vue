<template>
  <div :style="{transition:'all 0.5s'}" @mouseenter="isHover=true" @mouseleave="leaveCard">
    <el-card v-loading="onLoading" header="休假信息" style="position:relative">
      <el-container>
        <el-main :style="{filter:hideDetail?'blur(5px)':''}">
          <CardTooltipAlert :accept="submitId" :accepting="anyChanged">
            <template slot="content">鼠标移到休假进度条上可查看年度休假情况，有误请联系业务口。</template>
          </CardTooltipAlert>
          <el-form ref="formApply" :model="formApply" label-width="120px">
            <el-form-item label="休假年度">
              <el-radio-group v-model="submitYear">
                <el-radio :label="nowYear" size="medium">本年度休假({{ nowYear }}年)</el-radio>
                <el-radio :label="nowYear+1" size="medium">下一年度休假({{ nowYear + 1 }}年)</el-radio>
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
                style="width:300px"
              />
            </el-form-item>
            <el-row>
              <el-col :xl="7" :lg="8" :md="9" :sm="10" :xs="24">
                <el-form-item label="休假天数">
                  <el-input-number
                    v-model="formApply.vacationLength"
                    :max="usersvacation.leftLength"
                    :min="1"
                    @change="handleChange"
                  />
                </el-form-item>
              </el-col>
              <el-col :xl="7" :lg="8" :md="9" :sm="10" :xs="24">
                <el-form-item label="路途天数">
                  <el-input-number
                    v-model="formApply.OnTripLength"
                    :max="14"
                    :min="0"
                    @change="handleChange"
                  />
                </el-form-item>
              </el-col>
            </el-row>
            <el-form-item v-if="formApply.vacationType=='正休'" label="福利假">
              <el-button icon="el-icon-plus" @click="OpenOtherVacation('')">添加</el-button>
              <el-alert
                v-show="SelectVacationList.length>0"
                title="注意：当假期包含福利假时将无法享受法定节假日假期"
                close-text="知道了"
                type="warning"
                show-icon
              />
              <el-collapse accordion style="width:400px">
                <el-collapse-item
                  v-for="(item,index) in SelectVacationList"
                  :key="item.value"
                  style="position:relative;"
                >
                  <template slot="title">
                    {{ item.name }} {{ item.length }}天
                    <i
                      class="el-icon-edit group-edit"
                      @click="OpenOtherVacation(index)"
                    />
                    <i
                      class="el-icon-delete group-remove"
                      @click.stop="removeVacation(index,$event)"
                    />
                  </template>
                  {{ item.description }}
                </el-collapse-item>
              </el-collapse>
            </el-form-item>
            <el-row>
              <el-col :xl="7" :lg="8" :md="9" :sm="10" :xs="24">
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
              </el-col>
              <el-col :xl="7" :lg="8" :md="9" :sm="10" :xs="24">
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
              </el-col>
            </el-row>
            <el-form-item
              v-show="lawvacations.length>0&&formApply.vacationType=='正休'"
              label="法定节假日"
            >
              <el-tag
                v-for="item in lawvacations"
                :key="item.start"
                style="margin:10px"
              >{{ item.start|parseTime("{mm}月{dd}日") }} {{ item.name }}{{ item.length }} 天</el-tag>
            </el-form-item>
            <el-form-item
              label="休假目的地"
              prop="vacationPlace"
              :rules="[{required:true,trigger:'blur'}]"
            >
              <el-tooltip>
                <template slot="content">
                  <span>不填则将使用默认地址：{{ formApply.vacationPlaceName }}</span>
                </template>
                <cascader-selector
                  placeholder="选择本次休假的目的地"
                  :code.sync="formApply.vacationPlace"
                  :child-getter-method="locationChildren"
                  style="width:300px"
                />
              </el-tooltip>
            </el-form-item>
            <el-form-item label="详细地址">
              <el-input v-model="formApply.vacationPlaceName" style="width:300px" />
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
      <el-dialog title="添加" :visible.sync="dialogVisible" width="600px">
        <el-form ref="VacationModel" :rules="VacationModelRules" :model="VacationModel">
          <el-form-item label="福利假" prop="name">
            <el-autocomplete
              v-model.trim="VacationModel.name"
              :fetch-suggestions="querySearch"
              placeholder="选择/输入福利假"
              @select="handleSelect"
            />
          </el-form-item>
          <el-form-item label="休假天数" prop="length">
            <el-input-number v-model.number="VacationModel.length" />
          </el-form-item>
          <el-form-item label="福利假理由" prop="description">
            <el-input
              v-model.trim="VacationModel.description"
              type="textarea"
              maxlength="30"
              show-word-limit
            />
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="dialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="SaveOtherVacation">确 定</el-button>
        </span>
      </el-dialog>
    </el-card>
  </div>
</template>

<script>
import { postRequestInfo, getStampReturn } from '@/api/apply'
import { parseTime } from '@/utils'
import CardTooltipAlert from './FormHelper/CardTooltipAlert'
import VacationDescription from '@/components/Vacation/VacationDescription'
import CascaderSelector from '@/components/CascaderSelector'
import { locationChildren } from '@/api/common/static'
import { getUsersVacationLimit } from '@/api/user/userinfo'
export default {
  name: 'RequestInfo',
  components: { CardTooltipAlert, VacationDescription, CascaderSelector },
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
      OnloadingUserStamp: '',
      onLoading: true,

      formApply: this.createNewRequest(),
      submitYear: new Date().getFullYear(),
      usersvacation: {
        yearlyLength: 0,
        nowTimes: 0,
        leftLength: 0,
        onTripTimes: 0,
        maxTripTimes: 0
      },
      caculaingDate: {},
      restaurants: [], // 福利假选择
      lawvacations: [],
      SelectVacationList: [],
      VacationModel: {
        name: '',
        length: '',
        description: ''
      },
      dialogVisible: false,
      VacationIndex: '',
      VacationModelRules: {
        name: [
          { required: true, message: '请选择/输入福利假', trigger: 'change' }
        ],
        length: [
          { required: true, message: '请输入假期天数', trigger: 'blur' },
          {
            min: 1,
            message: '天数不能少于1天',
            type: 'number',
            trigger: 'blur'
          }
        ]
      },
      submitId: '',
      isHover: false,
      anyChanged: false
    }
  },
  computed: {
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
    submitYear: {
      handler(val) {
        this.formApply.yearIndex = val
      },
      immediate: true
    },
    formApply: {
      handler(val) {
        if (val && !this.onLoading) {
          this.anyChanged = true
        }
      },
      deep: true,
      immediate: true
    },
    selfSettle: {
      handler(val) {
        this.resetSettle(val)
      },
      deep: true,
      immediate: true
    }
  },
  mounted() {
    this.restaurants = this.loadAll()
  },
  methods: {
    stampLeaveRuleCheck(field, invalid, cb) {
      if (new Date(this.formApply[field.field]) < new Date('2000-1-1')) {
        return cb(new Error('离队时间不合法'))
      }
      cb()
    },
    locationChildren,
    leaveCard() {
      this.isHover = false
      if (this.anyChanged) {
        this.anyChanged = false
        this.submitRequestInfo()
      }
    },
    resetSettle(val) {
      if (val && val.self && val.self.address) {
        var self = val.self.address
        var checkDic = [val.parent, val.lover, val.loversParent].map(
          i => i.address
        )
        var target = null
        var clength = checkDic.length
        for (var i = 0; i < clength; i++) {
          if (checkDic[i] && checkDic[i].code !== self.code) {
            target = checkDic[i]
            break
          }
        }
        if (target) {
          this.formApply.vacationPlace = target.code
          this.formApply.vacationPlaceName = target.name
        }
      }
    },
    reset() {
      this.caculaingDate = {}
      this.formApply = this.createNewRequest()

      this.onLoading = false
      this.anyChanged = false
    },
    refreshVacation() {
      getUsersVacationLimit(this.userid, this.formApply.yearIndex)
        .then(data => {
          this.usersvacation = data
        })
        .finally(() => {
          this.onLoading = false
          this.anyChanged = false
        })
    },
    createNewRequest() {
      return {
        StampLeave: new Date(),
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
    removeVacation(index) {
      this.SelectVacationList.splice(index, 1)
      this.handleChange()
    },
    checkParamValid(params) {
      if (!params.id) {
        console.log('id')
        return false
      }
      if (!params.vacationPlace || params.vacationPlace.length < 6) {
        console.log('address')
        return false
      }
      if (
        !params.StampLeave ||
        new Date(params.StampLeave) < new Date('2000-1-1')
      ) {
        console.log('stamp leave')
        return false
      }
      return true
    },
    /**
     * 提交请求信息
     */
    submitRequestInfo() {
      console.log('requestinfo submit?' + !this.onLoading)
      if (this.onLoading) return
      const infoParam = Object.assign({}, this.formApply, {
        id: this.userid
      })
      infoParam['vacationAdditionals'] = this.SelectVacationList
      infoParam.StampLeave = parseTime(infoParam.StampLeave, '{yyyy}-{mm}-{dd}')
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
    SaveOtherVacation() {
      this.$refs['VacationModel'].validate(valid => {
        if (!valid) {
          return
        }
        for (var i = 0; i < this.SelectVacationList.length; i++) {
          if (
            this.SelectVacationList[i].name === this.VacationModel.name &&
            this.VacationIndex !== i
          ) {
            this.$message({
              type: 'info',
              message: `已添加过该假期`
            })
            return
          }
        }
        var obj = JSON.parse(JSON.stringify(this.VacationModel))

        if (this.VacationIndex !== '') {
          this.SelectVacationList[this.VacationIndex].name = obj.name
          this.SelectVacationList[this.VacationIndex].length = obj.length
          this.SelectVacationList[this.VacationIndex].description =
            obj.description
          this.VacationIndex = ''
        } else {
          this.SelectVacationList.push({
            name: obj.name,
            length: obj.length,
            description: obj.description
          })
        }
        this.handleChange()
        this.dialogVisible = false
      })
    },
    OpenOtherVacation(index) {
      this.VacationIndex = index
      this.$refs['VacationModel'] && this.$refs['VacationModel'].resetFields()
      if (index !== '') {
        this.VacationModel.name = this.SelectVacationList[
          this.VacationIndex
        ].name
        this.VacationModel.length = this.SelectVacationList[
          this.VacationIndex
        ].length
        this.VacationModel.description = this.SelectVacationList[
          this.VacationIndex
        ].description
      }
      this.dialogVisible = true
    },
    querySearch(queryString, cb) {
      var restaurants = this.restaurants
      var results = queryString
        ? restaurants.filter(this.createFilter(queryString))
        : restaurants
      // 调用 callback 返回建议列表的数据
      cb(results)
    },
    createFilter(queryString) {
      return restaurant => {
        return (
          restaurant.value.toLowerCase().indexOf(queryString.toLowerCase()) ===
          0
        )
      }
    },
    loadAll() {
      return [
        {
          value: '婚假',
          length: 10,
          description: '于今年x月结婚，已提交相关证明材料'
        },
        { value: '护理假', length: 30, description: '于今年x月结婚,...' },
        { value: '产假', length: 188, description: '于今年x月结婚,...' }
      ]
    },
    handleSelect(item) {
      this.VacationModel.length = item.length
      this.VacationModel.description = item.description
    },

    /**
     * 用户计算预期归队日期
     */
    handleChange() {
      if (!this.formApply.StampLeave) return
      var SelectVacationCount = 0
      this.SelectVacationList.forEach(v => {
        SelectVacationCount += v.length
      })
      // 正休假计算路途，如果存在福利假则不计算法定节假日
      var caculatevacationCount = this.formApply.vacationType === '正休'
      this.caculaingDate = {
        start: parseTime(this.formApply.StampLeave, '{yyyy}-{mm}-{dd}'),
        length:
          parseInt(this.formApply.vacationLength) +
          (caculatevacationCount
            ? parseInt(this.formApply.OnTripLength) + SelectVacationCount
            : 0),
        caculateLawvacation:
          caculatevacationCount && this.SelectVacationList.length === 0
      }
      this.formApply.isArchitect =
        new Date(this.caculaingDate.start) <= new Date()
      this.OnloadingUserStamp = new Date()
      var OnloadingUserStamp = this.OnloadingUserStamp
      setTimeout(() => {
        if (OnloadingUserStamp !== this.OnloadingUserStamp) return
        getStampReturn(this.caculaingDate).then(data => {
          this.formApply.StampReturn = data.endDate
          this.lawvacations = data.descriptions ? data.descriptions : []
        })
      }, 500)
    }
  }
}
</script>

<style>
</style>
