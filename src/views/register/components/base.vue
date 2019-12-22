<template>
  <div>
    <el-form-item label="身份证号">
      <el-input v-model="innerForm.cid" :style="{ width: '400px' }" @change="fetchUserInfoes" />
      <el-tooltip :content="invalid.cid.des">
        <i v-if="invalid.cid.status" class="el-icon-error" style="color:#F56C6C" />
        <i v-else class="el-icon-success" style="color:#67C23A" />
      </el-tooltip>
    </el-form-item>
    <el-form-item label="真实姓名">
      <el-input v-model="innerForm.realName" :style="{ width: '400px' }" />
    </el-form-item>
    <el-form-item label="性别">
      <el-button-group>
        <el-button
          v-for="btn in genderButton"
          :key="btn.value"
          :icon="btn.icon"
          :style="`background-color:${btn.background};color:#ffffff;font-size:2em`"
          plain
          circle
          @click="innerForm.gender=btn.value"
        />
      </el-button-group>
    </el-form-item>
    <el-form-item label="生日">
      <el-date-picker v-model="innerForm.time_Birthday" />
    </el-form-item>
    <el-form-item label="工作时间">
      <el-date-picker v-model="innerForm.time_Work" />
    </el-form-item>
    <el-form-item label="党团时间">
      <el-date-picker v-model="innerForm.time_Party" />
    </el-form-item>
  </div>
</template>

<script>
import { cidValid } from '@/utils/validate'
import { getUserIdByCid, getUserSummary } from '@/api/userinfo'
export default {
  name: 'Base',
  props: {
    form: {
      type: Object,
      default() {
        return this.innerForm
      }
    }
  },
  data() {
    return {
      innerForm: {
        cid: '',
        realName: '',
        gender: 0,
        time_Work: '',
        time_Birthday: '',
        time_Party: ''
      },
      invalid: {
        cid: {
          status: false,
          des: '用户已存在'
        }
      },
      genderButton: [
        {
          value: 1,
          icon: 'el-icon-male',
          background: '#46B6ef'
        },
        {
          value: 0,
          icon: 'el-icon-question',
          background: '#777777'
        },
        {
          value: 2,
          icon: 'el-icon-female',
          background: '#f37e7d'
        }
      ]
    }
  },
  watch: {
    innerForm: {
      handler(val, oldVal) {
        this.$emit('update:form', val)
      },
      deep: true
    }
  },
  methods: {
    fetchUserInfoes() {
      const id = this.innerForm.cid
      this.invalid.cid.des = '验证通过'
      if (id && id.length === 18) {
        if (id.length === 18) {
          var vcid = cidValid(id)
          if (!vcid.valid) {
            this.invalid.cid.status = true
            this.invalid.cid.des = vcid.msg
            return
          }
          getUserIdByCid(id, true)
            .then(data => {
              this.invalid.cid.status = true
              this.invalid.cid.des =
                '此身份证号已被' + data.base.realName + '使用'
            })
            .catch(() => {
              this.invalid.cid.status = false
            })
        }
      } else {
        this.invalid.cid.status = true
        this.invalid.cid.des = '非正确身份号码,正确格式为18位法定身份证号码'
      }
    },
    fetchUserInfoesDerect() {
      getUserSummary(this.innerForm.cid)
        .then(data => {
          if (data) {
            this.invalid.cid.status = true
            this.invalid.cid.des = '此身份号已被' + data.realName + '使用'
          } else {
            this.invalid.cid.status = false
          }
        })
        .catch(() => {
          this.invalid.cid.status = false
        })
    }
  }
}
</script>

<style>
</style>
