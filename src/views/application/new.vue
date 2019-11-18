<template>
  <div class="application-new">
    <el-card
      :body-style="{padding: 0}"
      shadow="hover"
    >
      <div
        :style="{'backgroundColor': theme}"
        class="layout pa-3 row justify-space-between"
      >
        <span>新建申请</span>
      </div>
      <el-card class="elevation-0">
        <div class="px-2 pb-2 pt-0">
          <el-steps
            :active="active"
            finish-status="success"
            simple
            style="margin-top: 20px"
          >
            <el-step title="填写基础信息" />
            <el-step title="填写休假请求" />
            <el-step title="准备提交" />
          </el-steps>
        </div>
      </el-card>
      <el-card class="elevation-0 p-relitive">
        <div
          v-show="showAll == true || active == 0"
          class="row layout"
        >
          <el-form
            ref="form"
            :model="form"
            class="full-width"
            label-width="180px"
          >
            <div class="subheading pa-3">一、填写基础信息</div>
            <el-form-item label="身份号">
              <el-input
                v-model="form.id"
                :style="{ width: '400px' }"
                @keydown.native.enter="fetchUserInfoes"
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
                    @click="fetchUserInfoes"
                  />
                </el-tooltip>
              </el-input>
            </el-form-item>
            <el-form-item label="真实姓名">
              <el-input
                v-model="form.realName"
                disabled
              />
            </el-form-item>
            <el-form-item label="所在部门">
              <el-input
                v-model="form.companyName"
                disabled
              />
            </el-form-item>
            <el-form-item
              hidden
              label="所在部门"
            >
              <el-input
                v-model="form.company"
                disabled
                hidden
              />
            </el-form-item>
            <el-form-item label="担任职务">
              <el-input
                v-model="form.duties"
                disabled
              />
            </el-form-item>

            <SettleFormItem v-model="form.Settle.self" label="本人所在地" />
            <SettleFormItem v-model="form.Settle.lover" label="配偶所在地" />
            <SettleFormItem v-model="form.Settle.parent" label="父母所在地" />

            <el-form-item label="初始全年天数">
              <el-input v-model="form.Settle.prevYearlyLength" disabled />
            </el-form-item>

            <el-form-item label="联系方式">
              <el-input v-model="form.Phone" />
            </el-form-item>

            <hr class="divider">
            <el-form-item label="回执编号">
              <el-input
                v-model="formFinal.baseInfoId"
                :style="{ width: '400px' }"
                disabled
              >
                <div slot="prepend">
                  <el-button
                    type="primary"
                    @click="submitBaseInfo"
                  >生成</el-button>
                </div>
                <el-button
                  v-if="formFinal.baseInfoId"
                  slot="append"
                  :loading="onLoading"
                  class="success"
                  icon="el-icon-success"
                  type="success"
                />
                <el-button
                  v-else
                  slot="append"
                  :loading="onLoading"
                  icon="el-icon-question"
                />
              </el-input>
            </el-form-item>
            <el-form-item v-show="showAll == false">
              <el-button :disabled="!isAllowGoStepTow" @click="goStepTwo">下一步</el-button>
            </el-form-item>
          </el-form>
        </div>

        <div
          v-show="showAll == true || active == 1"
          class="row layout"
        >
          <el-form
            ref="formApply"
            :model="formApply"
            class="full-width"
            label-width="180px"
          >
            <div class="subheading pa-3">二、填写休假请求</div>
            <el-form-item label="申请理由">
              <el-input v-model="formApply.reason" />
            </el-form-item>
            <el-form-item label="休假类型">
              <el-select
                v-model="formApply.VocationType"
                placeholder="必填"
              >
                <el-option
                  label="正休"
                  value="正休"
                />
                <el-option
                  label="事假"
                  value="事假"
                />
                <el-option
                  label="病休"
                  value="病休"
                />
              </el-select>
            </el-form-item>

            <el-row>
              <el-col
                :lg="6"
                :md="24"
              >
                <el-form-item label="离队时间">
                  <el-date-picker
                    v-model="formApply.StampLeave"
                    placeholder="选择日期"
                    type="date"
                    @change="handleChange"
                  />
                </el-form-item>
              </el-col>
              <el-col
                :lg="6"
                :md="24"
              >
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

            <el-row>
              <el-col
                :lg="6"
                :md="24"
              >
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
                          <li><b class="bolder">全年假期长度：</b><span class="text-orange">{{ usersVocation.yearlyLength }}</span>天</li>
                          <li><b class="bolder">当前已休次数：</b><span class="text-orange">{{ usersVocation.nowTimes }}</span>天</li>
                          <li><b class="bolder">剩余假期长度：</b><span class="text-orange">{{ usersVocation.leftLength }}</span>天</li>
                          <li><b class="bolder">全年最多可休路途次数：</b><span class="text-orange">{{ usersVocation.maxTripTimes }}</span>天</li>
                          <li><b class="bolder">当前已休路途次数: </b><span class="text-orange">{{ usersVocation.onTripTimes }}</span>天</li>
                          <li><b class="bolder">休假描述: </b> <span>{{ usersVocation.description || `已婚且与妻子同地，探父母假20天。\n年初全年总假30天，因9月发生变化，按比例加权:(12-变化的月) * 变化后天数 + 变化的月 * 年初总假期=（3 * 20 + 9 * 30）/12=27。` }} </span></li>
                        </ul>
                      </div>
                      <i class="el-icon-s-order" style="color: #ff9800; font-size: 20px;" />
                    </el-tooltip>
                  </el-input>
                </el-form-item>

              </el-col>

              <el-col
                :lg="6"
                :md="24"
              >
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
                :placeholder="formApply.vocationPlaceName"
                :show-all-levels="false"
                @active-item-change="handleItemChange"
              />
            </el-form-item>
            <el-form-item label="所乘交通工具">
              <el-select
                v-model="formApply.ByTransportation"
                placeholder="火车"
              >
                <el-option
                  label="火车"
                  value="0"
                />
                <el-option
                  label="飞机"
                  value="1"
                />
                <el-option
                  label="汽车"
                  value="2"
                />
                <el-option
                  label="其他"
                  value="-1"
                />
              </el-select>
            </el-form-item>
            <el-form-item label="回执编号">
              <el-input
                v-model="formFinal.RequestId"
                :style="{ width: '400px' }"
                disabled
              >
                <div slot="prepend">
                  <el-button
                    type="primary"
                    @click="submitRequestInfo"
                  >生成</el-button>
                </div>
                <el-button
                  v-if="formFinal.RequestId"
                  slot="append"
                  :loading="onLoading"
                  class="success"
                  icon="el-icon-success"
                  type="success"
                />
                <el-button
                  v-else
                  slot="append"
                  :loading="onLoading"
                  icon="el-icon-question"
                />
              </el-input>
            </el-form-item>

            <el-form-item v-show="showAll == false">
              <el-button @click="active = 0">上一步</el-button>
              <el-button
                :disabled="!formFinal.RequestId"
                @click="active = 2"
              >下一步</el-button>
            </el-form-item>
          </el-form>
        </div>

        <div
          v-show="showAll == true || active == 2"
          class="row layout"
        >
          <el-form
            ref="formFinal"
            :model="formFinal"
            class="full-width"
            label-width="180px"
          >
            <div class="subheading pa-3">最后一步、准备提交</div>
            <el-form-item label="基础信息回执编号">
              <el-input
                :value="formFinal.baseInfoId"
                disabled
              />
            </el-form-item>
            <el-form-item label="休假请求回执">
              <el-input
                :value="formFinal.RequestId"
                disabled
              />
            </el-form-item>
            <el-form-item v-if="formFinal.RequestId && formFinal.baseInfoId">
              <el-alert
                show-icon
                title="信息填写完备，可以准备提交"
                type="info"
              />
            </el-form-item>
            <el-form-item v-show="showAll == false">
              <el-button
                type="primary"
                @click="active = 3"
              >准备提交</el-button>
              <el-button @click="active = 1">上一步</el-button>
            </el-form-item>
          </el-form>
        </div>
        <div
          v-show="showAll == true || active == 3"
          class="row layout"
        />
        <div
          v-if="showAll"
          class="mask"
        />
        <div
          v-if="showAll"
          :style="{'backgroundColor': theme}"
          class="footer-nav"
        >
          <div
            v-if="isAfterSubmit"
            class="row layout justify-center fill-height"
          >
            <el-button @click="createNew">新建申请</el-button>
          </div>
          <div
            v-else
            class="row layout justify-center fill-height"
          >
            <el-button
              v-loading="onLoading"
              @click="submitApply"
            >提交</el-button>
            <el-button @click="active = 0">重新填写</el-button>
          </div>
        </div>
        <!-- card body -->
      </el-card>
    </el-card>
  </div>
</template>

<script>
import SettleFormItem from '../../components/SettleFormItem'
import { getUserInfo } from '../../api/usercompany'
import { getUserIdByCid, getUsersVocationLimit } from '../../api/userinfo'
import {
  postBaseInfo,
  postRequestInfo,
  submitApply,
  getStampReturn
} from '../../api/apply'
import { locationChildren } from '../../api/static'
export default {
  name: 'NewApply',
  components: {
    SettleFormItem
  },
  data() {
    return {
      active: 0,
      OnloadingUserInfoes: false,
      onLoading: false,
      form: {
        id: '',
        realName: '',
        company: '',
        companyName: '',
        duties: '',
        Settle: {
          self: {},
          lover: {},
          parent: {},
          prevYearlyLength: 0
        },
        Phone: ''
      },
      formApply: {
        StampLeave: '',
        VocationLength: 0,
        OnTripLength: 0,
        VocationType: '',
        vocationPlace: 0,
        vocationPlaceArr: [],
        vocationPlaceName: '',
        ByTransportation: '0',
        reason: '',
        StampReturn: ''
      },
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
      caculaingDate: {}
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
    }
  },
  created() {
    this.createNew()
  },
  methods: {
    goStepTwo() {
      if (this.isAllowGoStepTow) {
        this.active = 1
      } else {
        this.$message.error('请生成回执编号')
      }
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
    fetchUserInfoes() {
      const id = this.form.id
      this.formFinal.RequestId = ''
      this.formFinal.baseInfoId = ''
      if (this.OnloadingUserInfoes === true) {
        return this.$message.info({
          message: '用户信息获取中，请稍等'
        })
      }
      if (id.length === 7 || id.length === 18) {
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
    },

    fetchUserInfoesDerect() {
      getUserInfo(this.form.id)
        .then(data => {
          this.OnloadingUserInfoes = false
          const { base, company, duties, social } = data
          try {
            this.form.realName = base.realName
            this.form.company = company.company.code
            this.form.companyName = company.company.name
            this.form.duties = duties.name
            this.form.Phone = social.phone
            const { self, lover, parent, prevYearlyLength } = social.settle
            this.form.Settle = {
              self,
              lover,
              parent,
              prevYearlyLength
            }
          } catch (error) {
            console.warn(error)
          }
          return this.$message.success('获取成功，已自动填充到表单')
        })
        .catch(err => {
          this.OnloadingUserInfoes = false
          return this.$message.warning(err.message)
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
      postBaseInfo({
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
        })
        .catch(() => {
          this.onLoading = false
          this.formFinal.baseInfoId = ''
          this.$message.error('基础信息提交失败，请检查填写信息')
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
      postRequestInfo(infoParam)
        .then(data => {
          const id = data.id
          this.formFinal.RequestId = id
          if (id) {
            return this.$message.success('申请信息提交完成，回执编号为' + id)
          }
        })
        .catch(() => {
          return this.$message.error('提交失败，请重新检查表单')
        })
        .finally(() => {
          this.onLoading = false
        })
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
      this.form = {
        id: '',
        realName: '',
        company: '',
        companyName: '',
        duties: '',
        Phone: 0,
        Settle: {
          self: this.buildSettle(),
          lover: this.buildSettle(),
          parent: this.buildSettle(),
          prevYearlyLength: 0
        }
      }
      this.formApply = {
        StampLeave: '',
        VocationLength: 0,
        OnTripLength: 0,
        VocationType: '',
        vocationPlace: 0,
        vocationPlaceName: '',
        vocationPlaceArr: [],
        reason: '',
        ByTransportation: '0'
      }
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
      return (() => {
        this.caculaingDate = {
          start: this.formApply.StampLeave,
          length: this.formApply.VocationLength + this.formApply.OnTripLength
        }
        var lastStart =
          this.formApply.StampLeave +
          this.formApply.VocationLength +
          this.formApply.OnTripLength
        setTimeout(() => {
          if (
            lastStart !==
            this.formApply.StampLeave +
              this.formApply.VocationLength +
              this.formApply.OnTripLength
          ) {
            return true
          }

          getStampReturn(this.caculaingDate)
            .then(data => {
              this.formApply.StampReturn = data.endDate
              this.$notify({
                title: '预计归队时间',
                message: data.endDate,
                type: 'success'
              })
            })
            .catch(err => {
              return this.$message.error(err)
            })
        }, 1000)
      })()
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
</style>
