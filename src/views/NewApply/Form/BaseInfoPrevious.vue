<template>
  <div :style="{transition:'all 0.5s'}" @mouseenter="isHover=true" @mouseleave="leaveCard">
    <el-card v-loading="onLoading" header="基本信息" style="position:relative">
      <el-container>
        <el-main :style="{filter:hideDetail?'blur(5px)':''}">
          <CardTooltipAlert :accept="submitId" :accepting="anyChanged">
            <template slot="content">若有误（含信息有变化），请到审核注册页面修改信息</template>
          </CardTooltipAlert>
          <el-form ref="form" :model="form" label-width="120px" style="background:#fff">
            <el-form-item label="身份号" :rules="[{required:true}]">
              <el-input v-model="form.id" @keydown.native.enter="fetchUserInfoes('id')">
                <el-tooltip slot="prepend" content="点击加载信息">
                  <el-button icon="el-icon-search" @click="fetchUserInfoes('id')" />
                </el-tooltip>
                <el-tooltip
                  v-if="currentUser"
                  slot="append"
                  :content="`点击加载 ${currentUser.realName} 的信息`"
                >
                  <el-button
                    :disabled="!currentUser||!currentUser.id"
                    size="mini"
                    @click="setCurrentUser(3)"
                  >当前</el-button>
                </el-tooltip>
              </el-input>
            </el-form-item>
            <el-form-item label="真实姓名" :rules="[{required:true}]">
              <el-input v-model="form.realName" @keydown.native.enter="fetchUserInfoes('realName')">
                <el-tooltip slot="prepend" content="点击加载信息">
                  <el-button icon="el-icon-search" @click="fetchUserInfoes('realName')" />
                </el-tooltip>
              </el-input>
            </el-form-item>
            <el-row>
              <el-col>
                <el-form-item label="部职别">
                  <el-tag v-if="form.companyName">{{ form.companyName }} {{ form.duties }}</el-tag>
                </el-form-item>
              </el-col>
            </el-row>

            <el-form-item
              label="联系方式"
              prop="Phone"
              inline-message
              :rules="[{required:true,validator:phoneRoleCheck,trigger:'blur'}]"
            >
              <el-input v-model="form.Phone" />
            </el-form-item>

            <SettleFormItem :form.sync="form.Settle.self" disabled label="本人所在地" />
            <SettleFormItem :form.sync="form.Settle.lover" disabled label="配偶所在地" />
            <SettleFormItem :form.sync="form.Settle.parent" disabled label="父母所在地" />
            <SettleFormItem :form.sync="form.Settle.loversParent" disabled label="配偶父母所在地" />
          </el-form>
        </el-main>
        <el-aside
          width="20%"
          style="padding:0;text-align:center;margin:0;background: rgb(255, 255, 255)"
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
import SettleFormItem from '@/components/SettleFormItem'
import CardTooltipAlert from './FormHelper/CardTooltipAlert'
import { getUserAllInfo } from '@/api/user/usercompany'
import { getUserIdByCid, getUserIdByRealName } from '@/api/user/userinfo'
import { postBaseInfo } from '@/api/apply'
import { validPhone } from '@/utils/validate'
export default {
  name: 'BaseInfo',
  components: {
    CardTooltipAlert,
    SettleFormItem
  },
  data() {
    return {
      onLoading: true,
      onSvgSelected: false,
      form: this.createNewBase(),
      detailMask: false,
      submitId: '',
      isHover: false,
      anyChanged: false
    }
  },
  computed: {
    hideDetail() {
      return this.submitId && !this.isHover
    },
    currentUser() {
      return this.$store.state.user.data
    }
  },
  watch: {
    form: {
      handler(val) {
        if (val && !this.onLoading) {
          this.anyChanged = true
          this.submitId = ''
        }
      },
      deep: true,
      immediate: true
    }
  },
  methods: {
    phoneRoleCheck(filed, invalidVal, cb) {
      var val = this.form[filed.field]
      var result = validPhone(val)
      if (result) cb(new Error(result))
      cb()
    },
    reset() {
      console.log('baseinfo init')
      this.form = this.createNewBase(true)
      this.onLoading = false
      this.anyChanged = false
    },
    leaveCard() {
      this.isHover = false
      if (this.anyChanged) {
        this.anyChanged = false
        this.submitBaseInfo()
      }
    },
    createNewBase(fetch) {
      var f = {
        id: '',
        realName: '',
        company: '',
        companyName: '',
        duties: '',
        Phone: '0',
        Settle: {
          self: this.buildSettle(),
          lover: this.buildSettle(),
          parent: this.buildSettle(),
          loversParent: this.buildSettle()
        }
      }
      if (fetch) {
        setTimeout(() => {
          this.setCurrentUser()
        }, 100)
      }
      return f
    },
    setCurrentUser(tryTime) {
      if (!this.currentUser || !this.currentUser.id) {
        if (tryTime > 0) {
          setTimeout(() => {
            this.setCurrentUser(tryTime - 1)
          }, 500)
        } else {
          this.$message.warning('获取当前用户失败')
        }
        return
      }
      this.form.id = this.currentUser.id
      this.fetchUserInfoes('id')
    },
    fetchUserInfoes(byIdOrRealname) {
      if (this.onLoading) return
      this.onLoading = true
      const realName = this.form.realName
      const id = this.form.id
      if (byIdOrRealname === 'id') {
        if (id.length === 18) {
          getUserIdByCid(id).then(data => {
            this.form.id = data.id
            this.$message.success(`身份证识别成功:${data.id}`)
            this.fetchUserInfoesDerect()
          })
        } else {
          this.fetchUserInfoesDerect()
        }
      } else {
        getUserIdByRealName(realName)
          .then(data => {
            const list = data.list
            if (!list || list.length === 0) {
              return this.$message.warning(`无${realName}的信息，请核对`)
            }
            this.form.id = list[0].id
            var infoMain = `成功获取${list[0].realName}的信息`
            if (list.length === 1) {
              this.$message.success(infoMain)
            } else {
              this.$message.warning(
                `${infoMain},存在${list.length}人同名，建议使用id查询`
              )
            }
            this.fetchUserInfoesDerect()
          })
          .finally(() => {
            this.onLoading = false
          })
      }
    },

    fetchUserInfoesDerect() {
      this.onLoading = true
      return getUserAllInfo(this.form.id)
        .then(data => {
          const { base, company, duties, social } = data
          this.form.id = base.id
          console.log(this.form.id)
          this.form.realName = base.base.realName
          this.form.company = company.company.code
          this.form.companyName = company.company.name
          this.form.duties = duties.name
          this.form.Phone = social.phone
          const { self, lover, parent, loversParent } = social.settle
          if (!this.form.Settle) this.form.Settle = {}
          this.form.Settle.self = self
          this.$emit('update:selfSettle', social.settle)
          this.form.Settle.lover = lover
          this.form.Settle.parent = parent
          this.form.Settle.loversParent = loversParent

          setTimeout(() => {
            this.submitBaseInfo()
          }, 100)
        })
        .finally(() => {
          this.onLoading = false
        })
    },
    // 提交基础信息
    submitBaseInfo() {
      console.log('baseinfo submit?' + !this.onLoading)
      if (this.onLoading) return
      const { id, Phone } = this.form
      if (!id || !Phone) return
      if (validPhone(Phone)) return
      this.onLoading = true
      var payload = {
        id,
        Phone
      }
      postBaseInfo(payload)
        .then(data => {
          if (data.id) {
            this.submitId = data.id
            this.$emit('update:submitId', data.id)
            this.$emit('update:userid', this.form.id)
            setTimeout(() => {
              this.$emit('submited', true)
            }, 200)
            this.$message.success('个人信息验证通过')
          }
        })
        .catch(() => {
          setTimeout(() => {
            this.$emit('submited', false)
          }, 200)
        })
        .finally(() => {
          this.onLoading = false
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
    }
  }
}
</script>

<style scoped>
</style>
