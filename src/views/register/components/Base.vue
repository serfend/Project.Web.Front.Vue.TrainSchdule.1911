<template>
  <div>
    <el-form-item label="身份证号">
      <el-input v-model="innerForm.cid" :style="{ width: '19rem' }" @change="fetchUserInfoes" />
      <el-tooltip :content="invalid.cid.des">
        <i v-if="invalid.cid.status" class="el-icon-error" style="color:#F56C6C" />
        <i v-else class="el-icon-success" style="color:#67C23A" />
      </el-tooltip>
    </el-form-item>
    <el-form-item label="真实姓名">
      <el-input v-model="innerForm.realName" :style="{ width: '19rem' }" />
    </el-form-item>
    <el-form-item label="性别">
      <GenderBtn v-model="innerForm.gender" />
    </el-form-item>
    <el-form-item label="籍贯">
      <el-input v-model="innerForm.hometown" :style="{ width: '19rem' }" />
    </el-form-item>
    <el-form-item label="生日">
      <el-date-picker
        v-model="innerForm.time_Birthday"
        format="yyyy年MM月dd日"
        value-format="yyyy-MM-dd"
        style="width:19rem"
        placeholder="根据身份证计算"
        disabled
      />
    </el-form-item>
    <el-form-item label="工作时间">
      <el-date-picker
        v-model="innerForm.time_Work"
        format="yyyy年MM月dd日"
        value-format="yyyy-MM-dd"
        style="width:19rem"
        :editable="false"
      />
    </el-form-item>
    <!--<el-form-item label="党团时间">
      <el-date-picker v-model="innerForm.time_Party" format="yyyy年MM月dd日" value-format="yyyy-MM-dd" />
    </el-form-item>-->
  </div>
</template>

<script>
import { cidValid } from '@/utils/validate'
import { getUserIdByCid } from '@/api/user/userinfo'
import GenderBtn from '@/components/User/GenderBtn'
export default {
  name: 'Base',
  components: { GenderBtn },
  props: {
    form: {
      type: Object,
      default() {
        return this.innerForm
      },
    },
  },
  data() {
    return {
      innerForm: {
        cid: '',
        realName: '',
        gender: 0,
        hometown: '',
        time_Work: '',
        time_Birthday: '',
        time_Party: '',
      },
      invalid: {
        cid: {
          status: false,
          des: '用户已存在',
        },
      },
    }
  },
  watch: {
    form: {
      handler(val) {
        this.innerForm = val
        if (this.innerForm.id) delete this.innerForm.id
      },
      deep: true,
      immediate: true,
    },
    innerForm: {
      handler(val, oldVal) {
        this.$emit('update:form', val)
      },
      deep: true,
    },
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
            .then((data) => {
              this.invalid.cid.status = true
              this.invalid.cid.des =
                '此身份证号已被' + data.base.realName + '使用'
            })
            .catch(() => {
              this.invalid.cid.status = false
              var dateStr =
                id.substring(6, 10) +
                '-' +
                id.substring(10, 12) +
                '-' +
                id.substring(12, 14)
              this.innerForm.time_Birthday = dateStr
              this.innerForm.gender = parseInt(id[16]) % 2 === 0 ? 2 : 1
            })
        }
      } else {
        this.invalid.cid.status = true
        this.invalid.cid.des = '非正确身份号码,正确格式为18位法定身份证号码'
      }
    },
  },
}
</script>

<style>
</style>
