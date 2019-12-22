<template>
  <div>
    <el-form-item prop="about" label="个性签名">
      <el-input
        v-model="innerForm.about"
        :style="{ width: '400px' }"
        placeholder="可填写个人描述"
        type="textarea"
        maxlength="50"
        show-word-limit
      />
    </el-form-item>
  </div>
</template>

<script>
export default {
  name: 'Diy',
  data() {
    return {
      innerForm: {
        about: '',
        avatar: '' /* TODO提供上传头像的方式 */
      },
      invalid: {
        about: {
          status: false,
          des: ''
        }
      }
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
  methods: {}
}
</script>

<style>
</style>
