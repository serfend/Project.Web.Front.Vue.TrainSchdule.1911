<template>
  <div class="application-new">
    <el-card :body-style="{padding: 0}" shadow="hover">
      <div :style="{'backgroundColor': theme}" class="layout pa-3 row justify-space-between">
        <span>新建申请</span>
      </div>
      <el-card class="elevation-0">
        <div class="px-2 pb-2 pt-0">
          <el-steps :active="active" finish-status="success" simple style="margin-top: 20px">
            <el-step title="填写基础信息" />
            <el-step title="填写休假请求" />
            <el-step title="准备提交" />
          </el-steps>
        </div>
      </el-card>
      <el-card class="elevation-0 p-relitive">
        <div v-show="showAll == true || active == 0" class="row layout">
          <el-form ref="form" :model="form" class="full-width" label-width="180px">
            <div class="subheading pa-3">一、填写基础信息</div>
            <el-form-item label="身份号">
              <el-input
                v-model="form.id"
                :style="{ width: '400px' }"
                @keydown.native.enter="fetchUserInfoes('id')"
              >
                <el-tooltip
                  slot="append"
                  class="item"
                  content="点击自动查询对应信息"
                  effect="dark"
                  placement="bottom"
                >
                  <el-button
                    :loading="OnloadingUserInfoes"
                    icon="el-icon-search"
                    @click="fetchUserInfoes('id')"
                  />
                </el-tooltip>
              </el-input>
            </el-form-item>
            <el-form-item label="真实姓名">
              <el-input
                v-model="form.realName"
                :style="{ width: '400px' }"
                @keydown.native.enter="fetchUserInfoes('realName')"
              >
                <el-tooltip
                  slot="append"
                  class="item"
                  content="点击自动查询对应信息"
                  effect="dark"
                  placement="bottom"
                >
                  <el-button
                    :loading="OnloadingUserInfoes"
                    icon="el-icon-search"
                    @click="fetchUserInfoes('realName')"
                  />
                </el-tooltip>
              </el-input>
            </el-form-item>
            <el-form-item label="所在部门">
              <el-input v-model="form.companyName" disabled />
            </el-form-item>
            <el-form-item hidden label="所在部门">
              <el-input v-model="form.company" disabled hidden />
            </el-form-item>
            <el-form-item label="担任职务">
              <el-input v-model="form.duties" disabled />
            </el-form-item>

            <SettleFormItem v-model="form.Settle.self" label="本人所在地" />
            <SettleFormItem v-model="form.Settle.lover" label="配偶所在地" />
            <SettleFormItem v-model="form.Settle.parent" label="父母所在地" />
            <SettleFormItem v-model="form.Settle.loversparent" label="配偶父母所在地" />

            <el-form-item label="初始全年天数">
              <el-input v-model="form.Settle.prevYearlyLength" disabled />
            </el-form-item>

            <el-form-item label="联系方式">
              <el-input v-model="form.Phone" />
            </el-form-item>

            <el-row class="divider" />
            <!-- <el-form-item label="回执编号">
              <el-input v-model="formFinal.baseInfoId" :style="{ width: '400px' }" disabled>
                <div slot="prepend">
                  <el-button type="primary" @click="submitBaseInfo">生成</el-button>
                </div>
                <el-button
                  v-if="formFinal.baseInfoId"
                  slot="append"
                  :loading="onLoading"
                  class="success"
                  icon="el-icon-success"
                  type="success"
                />
                <el-button v-else slot="append" :loading="onLoading" icon="el-icon-question" />
              </el-input>
            </el-form-item>-->
            <el-form-item v-show="showAll == false">
              <el-button type="success" style="width:100%" @click="goStepTwo">下一步</el-button>
            </el-form-item>
          </el-form>
        </div>

        <div v-show="showAll == true || active == 1" class="row layout">
          <el-form ref="formApply" :model="formApply" class="full-width" label-width="180px">
            <div class="subheading pa-3">二、填写休假请求</div>
            <el-form-item label="申请理由">
              <el-input v-model="formApply.reason" />
            </el-form-item>
            <el-form-item label="休假类型">
              <el-select v-model="formApply.VocationType" placeholder="必填">
                <el-option label="正休" value="正休" />
                <el-option label="事假" value="事假" />
                <el-option label="病休" value="病休" />
              </el-select>
              <el-tooltip placement="top">
                <div slot="content">如果您存在前期已休过假，但未记录的情况，则应选为【补充记录】</div>
                <el-switch
                  v-model="formApply.isArchitect"
                  active-text="补充记录"
                  inactive-text="新增申请"
                  active-color="#ff9999"
                />
              </el-tooltip>
            </el-form-item>

            <el-row v-if="formApply.VocationType=='正休'" class="sv-row">
              <el-form-item label="休假详情" label-width="100px">
                <el-button type="primary" @click="OpenOtherVacation('')">添加休假内容</el-button>
              </el-form-item>
              <el-collapse accordion>
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
                    <!-- .stop="doSomething($event) -->
                    <i
                      class="el-icon-delete group-remove"
                      @click.stop="removeVacation(index,$event)"
                    />
                  </template>
                  {{ item.description }}
                </el-collapse-item>
              </el-collapse>
            </el-row>

            <el-row>
              <el-col :lg="6" :md="24">
                <el-form-item label="离队时间">
                  <el-date-picker
                    v-model="formApply.StampLeave"
                    placeholder="选择日期"
                    type="date"
                    @change="handleChange"
                  />
                </el-form-item>
              </el-col>
              <el-col :lg="6" :md="24">
                <el-form-item
                  v-show="lawVocations.length>0&&formApply.VocationType=='正休'"
                  label="法定节假日"
                >
                  <el-tag
                    v-for="item in lawVocations"
                    :key="item.start"
                  >{{ item.start|parseTime("{mm}月{dd}日") }}{{ item.name }}{{ item.length }} 天</el-tag>
                </el-form-item>
              </el-col>
              <el-col :lg="9" :md="24">
                <el-form-item label="预计归队时间">
                  <el-date-picker
                    v-model="formApply.StampReturn"
                    disabled
                    placeholder="自动计算"
                    type="date"
                  />
                </el-form-item>
              </el-col>
            </el-row>
            <el-row :gutter="20">
              <el-col :lg="12" :md="24">
                <el-form-item label="全年休假完成率">
                  <el-progress :percentage="caculateVocationPercentage()" />
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :lg="9" :md="24">
                <el-form-item label="休假天数">
                  <el-input
                    v-model="formApply.VocationLength"
                    :max="usersVocation.leftLength"
                    :min="1"
                    type="number"
                    @change="handleChange"
                  >
                    <el-tooltip slot="append" effect="dark">
                      <div slot="content" class="tooltip-vocation">
                        <ul>
                          <li>
                            <b class="bolder">全年假期长度：</b>
                            <span class="text-orange">{{ usersVocation.yearlyLength }}</span>天
                          </li>
                          <li>
                            <b class="bolder">当前已休次数：</b>
                            <span class="text-orange">{{ usersVocation.nowTimes }}</span>次
                          </li>
                          <li>
                            <b class="bolder">剩余假期长度：</b>
                            <span class="text-orange">{{ usersVocation.leftLength }}</span>天
                          </li>
                          <li>
                            <b class="bolder">全年最多可休路途次数：</b>
                            <span class="text-orange">{{ usersVocation.maxTripTimes }}</span>次
                          </li>
                          <li>
                            <b class="bolder">当前已休路途次数:</b>
                            <span class="text-orange">{{ usersVocation.onTripTimes }}</span>次
                          </li>
                          <li>
                            <b class="bolder">休假描述:</b>
                            <span>{{ usersVocation.description || `暂无说明` }}</span>
                          </li>
                        </ul>
                      </div>
                      <i class="el-icon-s-order" style="color: #ff9800; font-size: 20px;" />
                    </el-tooltip>
                  </el-input>
                </el-form-item>
              </el-col>

              <el-col :lg="6" :md="24">
                <el-form-item label="路途天数">
                  <el-input
                    v-model="formApply.OnTripLength"
                    :max="7"
                    :min="1"
                    type="number"
                    @change="handleChange"
                  />
                </el-form-item>
              </el-col>
            </el-row>

            <el-form-item label="休假目的地">
              <el-cascader
                v-model="formApply.vocationPlaceArr"
                :options="locationOptions"
                :show-all-levels="true"
                @active-item-change="handleItemChange"
              />
            </el-form-item>
            <el-form-item label="详细地址">
              <el-input v-model="formApply.vocationPlaceName" />
            </el-form-item>
            <el-form-item label="所乘交通工具">
              <el-select v-model="formApply.ByTransportation" placeholder="火车">
                <el-option label="火车" value="0" />
                <!-- <el-option label="飞机" value="1" /> -->
                <el-option label="汽车" value="2" />
                <el-option label="其他" value="-1" />
              </el-select>
            </el-form-item>
            <!-- <el-form-item label="回执编号">
              <el-input v-model="formFinal.RequestId" :style="{ width: '400px' }" disabled>
                <div slot="prepend">
                  <el-button type="primary" @click="submitRequestInfo">生成</el-button>
                </div>
                <el-button
                  v-if="formFinal.RequestId"
                  slot="append"
                  :loading="onLoading"
                  class="success"
                  icon="el-icon-success"
                  type="success"
                />
                <el-button v-else slot="append" :loading="onLoading" icon="el-icon-question" />
              </el-input>
            </el-form-item>-->

            <el-form-item v-show="showAll == false" style="width:100%">
              <el-button-group style="width:100%">
                <el-button style="width:50%" type="info" @click="active = 0">上一步</el-button>
                <el-button style="width:50%" type="success" @click="goStepThree">下一步</el-button>
              </el-button-group>
            </el-form-item>
          </el-form>
        </div>

        <!-- <div v-show="showAll == true || active == 2" class="row layout">
          <el-form ref="formFinal" :model="formFinal" class="full-width" label-width="180px">
            <div class="subheading pa-3">最后一步、准备提交</div>
            <el-form-item label="基础信息回执编号">
              <el-input :value="formFinal.baseInfoId" disabled />
            </el-form-item>
            <el-form-item label="休假请求回执">
              <el-input :value="formFinal.RequestId" disabled />
            </el-form-item>
            <el-form-item v-if="formFinal.RequestId && formFinal.baseInfoId">
              <el-alert show-icon title="信息填写完备，可以准备提交" type="info" />
            </el-form-item>
            <el-form-item v-show="showAll == false">
              <el-button type="primary" @click="active = 3">准备提交</el-button>
              <el-button @click="active = 1">上一步</el-button>
            </el-form-item>
          </el-form>
        </div>-->
        <div v-show="showAll == true || active == 3" class="row layout" />
        <div v-if="showAll" class="mask" />
        <div v-if="showAll" :style="{'backgroundColor': theme}" class="footer-nav">
          <div v-if="isAfterSubmit" class="row layout justify-center fill-height">
            <el-button @click="createNew">新建申请</el-button>
          </div>
          <div v-else class="row layout justify-center fill-height">
            <el-button v-loading="onLoading" @click="submitApply">提交</el-button>
            <el-button @click="active = 0">重新填写</el-button>
          </div>
        </div>
        <!-- card body -->
      </el-card>
    </el-card>

    <el-dialog title="添加" :close-on-click-modal="false" :visible.sync="dialogVisible" width="600px">
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
          <el-input v-model.number="VacationModel.length" />
        </el-form-item>
        <el-form-item label="休假理由" prop="description">
          <el-input v-model.trim="VacationModel.description" />
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="SaveOtherVacation">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { parseTime } from '@/utils'
import SettleFormItem from '@/components/SettleFormItem'
import { getUserAllInfo } from '@/api/usercompany'
import {
  getUserIdByCid,
  getUserIdByRealName,
  getUsersVocationLimit
} from '@/api/userinfo'
import {
  postBaseInfo,
  postRequestInfo,
  submitApply,
  getStampReturn
} from '@/api/apply'
import { locationChildren } from '@/api/static'
export default {
  name: 'NewApply',
  components: {
    SettleFormItem
  },
  data() {
    return {
      active: 0,
      OnloadingUserInfoes: false,
      OnloadingUserStamp: false,
      onLoading: false,
      form: this.createNewBase,
      formApply: this.createNewRequest,
      formFinal: {
        baseInfoId: '',
        RequestId: ''
      },
      usersVocation: {
        yearlyLength: 0,
        nowTimes: 0,
        leftLength: 0,
        onTripTimes: 0,
        maxTripTimes: 0
      },
      locationOptions: [
        {
          label: '选择地域',
          value: 0,
          children: []
        },
        {
          label: '不选择',
          value: -1
        }
      ],
      isAfterSubmit: false,
      caculaingDate: {},
      restaurants: [], // 福利假选择
      lawVocations: [],
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
      }
    }
  },
  computed: {
    showAll() {
      return this.active === 3
    },
    theme() {
      return this.$store.state.settings.theme
    },
    isAllowGoStepTow() {
      return this.formFinal.baseInfoId && this.form.id
    },
    currentUser() {
      return this.$store.state.user.data
    },
    createNewBase() {
      return {
        id: this.currentUser.id === null ? '' : this.currentUser.id,
        realName:
          this.currentUser.realName === null ? '' : this.currentUser.realName,
        company: '',
        companyName: '',
        duties: '',
        Phone: 0,
        Settle: {
          self: this.buildSettle(),
          lover: this.buildSettle(),
          parent: this.buildSettle(),
          loversParent: this.buildSettle(),
          prevYearlyLength: 0
        }
      }
    },
    createNewRequest() {
      return {
        StampLeave: '',
        StampReturn: '',
        VocationLength: 0,
        OnTripLength: 0,
        VocationType: '',
        vocationPlace: 0,
        vocationPlaceName: '',
        vocationPlaceArr: [],
        reason: '',
        ByTransportation: '0'
      }
    }
  },
  created() {
    this.createNew()
  },
  mounted() {
    this.restaurants = this.loadAll()
  },
  methods: {
    removeVacation(index) {
      console.log(index)
      this.SelectVacationList.splice(index, 1)
      this.handleChange()
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
        { value: '婚假', length: 10 },
        { value: '护理假', length: 30 },
        { value: '产假', length: 188 }
      ]
    },
    handleSelect(item) {
      this.VacationModel.length = item.length
    },

    goStepTwo() {
      this.submitBaseInfo().then(() => {
        if (this.isAllowGoStepTow) {
          this.active = 1
        } else {
          this.$message.error('请生成回执编号')
        }
      })
    },
    getLocationChildrenIndexByValue(item, value) {
      for (var i = 0; i < item.children.length; i++) {
        if (item.children[i].value === value) return i
      }
      return 0
    },
    handleItemChange(val) {
      if (val) {
        const deep = val.length - 1
        const id = val[deep]
        this.formApply.vocationPlaceArr = val
        locationChildren(id).then(data => {
          const children = data.list.map(d => ({
            label: d.name,
            value: d.code,
            children: []
          }))
          var item = this.locationOptions[0]
          var nextIndex = 0
          for (var i = 0; i < deep; i++) {
            nextIndex = this.getLocationChildrenIndexByValue(item, val[i + 1])
            item = item.children[nextIndex]
          }
          item.children = children
          if (item.children.length === 0) {
            item.children[0] = {
              label: '无下一层级',
              disabled: true
            }
          }
        })
      } else {
        this.$message.error('无效的地址')
      }
    },
    fetchUserInfoes(byIdOrRealname) {
      const realName = this.form.realName
      const id = this.form.id
      this.formFinal.RequestId = ''
      this.formFinal.baseInfoId = ''
      if (this.OnloadingUserInfoes === true) {
        return this.$message.info({
          message: '用户信息获取中，请稍等'
        })
      }
      if (byIdOrRealname === 'id') {
        if (id && (id.length === 7 || id.length === 18)) {
          this.OnloadingUserInfoes = true
          if (id.length === 18) {
            getUserIdByCid(id)
              .then(data => {
                this.OnloadingUserInfoes = false
                this.form.id = data.id
                this.$message.success({
                  message: '身份证识别成功:' + data.id
                })
                this.fetchUserInfoesDerect()
              })
              .catch(err => {
                this.OnloadingUserInfoes = false
                return this.$message.error({
                  message: err.message
                })
              })
          } else if (id.length === 7) {
            this.fetchUserInfoesDerect()
          }
        } else {
          this.$message.warning({
            message: '非正确身份号码,正确格式为7位身份号或者18位法定身份证号码'
          })
        }
      } else {
        this.OnloadingUserInfoes = true
        return getUserIdByRealName(realName)
          .then(data => {
            this.OnloadingUserInfoes = false
            const list = data.list
            if (!list || list.length === 0) {
              this.$message.warning({
                message: '无' + realName + '的信息，请核对'
              })
              return Promise.reject()
            }
            this.form.id = list[0].id
            this.$message.success({
              message: '成功获取' + list[0].base.realName + '的信息'
            })
            return this.fetchUserInfoesDerect()
          })
          .finally(() => {
            this.OnloadingUserInfoes = false
          })
      }
    },

    fetchUserInfoesDerect() {
      this.OnloadingUserInfoes = true
      return getUserAllInfo(this.form.id)
        .then(data => {
          const { base, company, duties, social } = data
          try {
            this.form.realName = base.base.realName
            this.form.company = company.company.code
            this.form.companyName = company.company.name
            this.form.duties = duties.name
            this.form.Phone = social.phone
            const {
              self,
              lover,
              parent,
              loversParent,
              prevYearlyLength
            } = social.settle
            this.form.Settle = {
              self,
              lover,
              parent,
              loversParent,
              prevYearlyLength
            }
          } catch (error) {
            console.warn(error)
          }
          this.$message.success('获取成功，已自动填充到表单')
          return Promise.resolve()
        })
        .catch(err => {
          this.OnloadingUserInfoes = false
          this.$message.warning(err.message)
          return Promise.reject()
        })
        .finally(() => {
          this.OnloadingUserInfoes = true
        })
    },

    getUsersVocationLimit(userid) {
      getUsersVocationLimit(userid).then(data => {
        this.usersVocation = {
          yearlyLength: 0,
          nowTimes: 0,
          leftLength: 0,
          onTripTimes: 0,
          maxTripTimes: 0,
          ...data
        }
      })
    },

    // 提交基础信息
    submitBaseInfo() {
      const { id, realName, company, duties, Phone } = this.form
      this.onLoading = true
      this.getUsersVocationLimit(id)
      return postBaseInfo({
        id,
        realName,
        company,
        duties,
        Phone,
        Settle: null
      })
        .then(data => {
          this.onLoading = false
          if (data.id) {
            this.formFinal.baseInfoId = data.id
            this.$message.success('成功提交，回执编号为：' + data.id)
          }
          return Promise.resolve()
        })
        .catch(() => {
          this.onLoading = false
          this.formFinal.baseInfoId = ''
          this.$message.error('提交失败')
          return Promise.reject()
        })
    },
    goStepThree() {
      this.submitRequestInfo().then(() => {
        this.active = 3
      })
    },
    /**
     * 提交请求信息
     */
    submitRequestInfo() {
      if (this.onLoading === true) {
        return this.$message.info('生成中，请等待')
      }
      const { vocationPlaceArr, ...param } = this.formApply
      if (vocationPlaceArr && vocationPlaceArr.length > 0) {
        param.vocationPlace = vocationPlaceArr[vocationPlaceArr.length - 1]
      }
      const infoParam = Object.assign({}, param, {
        id: this.form.id
      })
      this.onLoading = true
      infoParam['vocationAdditionals'] = this.SelectVacationList
      infoParam.StampLeave = parseTime(infoParam.StampLeave, '{yyyy}-{mm}-{dd}')
      return postRequestInfo(infoParam)
        .then(data => {
          const id = data.id
          this.formFinal.RequestId = id
          if (id) {
            this.$message.success('申请信息提交完成，回执编号为' + id)
            return Promise.resolve()
          }
        })
        .catch(() => {
          this.$message.error('失败，请检查')
          return Promise.reject()
        })
        .finally(() => {
          this.onLoading = false
        })
    },
    caculateVocationPercentage() {
      if (this.usersVocation.yearlyLength === 0) return 100
      var fn = parseInt
      var result = Math.floor(
        100 *
          ((fn(this.usersVocation.yearlyLength) -
            fn(this.usersVocation.leftLength) +
            fn(this.formApply.VocationLength)) /
            fn(this.usersVocation.yearlyLength))
      )
      if (result < 0) result = 0
      if (result > 100) result = 100
      return result
    },
    /**
     * 提交申请
     */
    submitApply() {
      if (this.onLoading === true) {
        return this.$message.info('提交中，请等待')
      }
      const BaseId = this.formFinal.baseInfoId
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
          this.active = 3
          this.isAfterSubmit = true
          return this.$message.success('保存成功')
        })
        .catch(() => {
          return this.$message.error('保存失败')
        })
        .finally(() => {
          return (this.onLoading = false)
        })
    },

    buildSettle() {
      return {
        date: '',
        valid: '',
        address: {
          parentId: '',
          rank: '',
          name: '',
          shortname: ''
        },
        addressDetail: ''
      }
    },
    /**
     * 创建新的申请
     */
    createNew() {
      this.active = 0
      this.form = this.createNewBase
      this.formApply = this.createNewRequest
      this.formFinal = {
        baseInfoId: '',
        RequestId: ''
      }
      this.onLoading = false
      this.isAfterSubmit = false
      this.caculaingDate = {}
    },

    /**
     * 用户计算预期归队日期
     */
    handleChange() {
      var SelectVacationCount = 0
      this.SelectVacationList.forEach(v => {
        SelectVacationCount += v.length
      })
      var caculateVocationCount = this.formApply.VocationType === '正休'
      this.caculaingDate = {
        start: parseTime(this.formApply.StampLeave, '{yyyy}-{mm}-{dd}'),
        length:
          parseInt(this.formApply.VocationLength) +
          (caculateVocationCount
            ? parseInt(this.formApply.OnTripLength) + SelectVacationCount
            : 0),
        caculateLawVocation: caculateVocationCount
      }
      this.formApply.isArchitect =
        new Date(this.caculaingDate.start) <= new Date()
      if (this.OnloadingUserStamp) return
      this.OnloadingUserStamp = true

      setTimeout(() => {
        getStampReturn(this.caculaingDate)
          .then(data => {
            const endDate = data.endDate
            this.formApply.StampReturn = endDate
            this.lawVocations = data.descriptions ? data.descriptions : []
            this.$notify({
              title: '预计归队时间',
              message: data.endDate,
              type: 'success'
            })
          })
          .catch(err => {
            return this.$message.error(err)
          })
          .finally(() => {
            this.OnloadingUserStamp = false
          })
      }, 1000)
    }
  }
}
</script>

<style lang="scss">
.tooltip-vocation {
  width: 260px;

  ul,
  li {
    list-style: none;
    padding: 8px;
    letter-spacing: 1px;

    .text-orange {
      color: orange;
    }
  }
}
</style>

<style lang="scss" scoped>
.application-new {
  background: #f5f5f5;
  padding: 24px;
}
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
.mask {
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  background: #e1f5fe47;
  z-index: 1000;
  cursor: not-allowed;
}
.footer-nav {
  position: fixed;
  bottom: 0;
  min-height: 48px;
  width: 100%;
  left: 0;
  right: 0;
  z-index: 1000;
  background: white;
  box-shadow: 0 -2px 10px -4px;
  border-radius: 4px 4px 0 0;
  padding: 8px;
}
.sv-row {
  background-color: #fff;
  padding: 10px;
  border: 1px solid #e5e5e5;
  margin-bottom: 10px;
  margin-left: 160px;
  max-width: 80%;
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
</style>
