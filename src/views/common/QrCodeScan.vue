<template>
  <el-upload
    :action="avatarSubmitUrl"
    :before-upload="beforeAvatarUpload"
    class="avatar-uploader"
    :show-file-list="false"
  ></el-upload>
</template>

<script>
export default {
  name: 'QrCodeScan',
  data() {
    return {
      imgSubmitUrl: ''
    }
  },
  mounted() {
    this.imgSubmitUrl = process.env.VUE_APP_BASE_API + '/static/QrCodeScan'
  },
  methods: {
    beforeAvatarUpload(file) {
      const isLt2M = file.size / 1024 / 1024 / 1024 < 200
      if (!isLt2M) {
        this.$message.error('上传头像图片大小不能超过 200KB')
      }
      if (isLt2M) {
        var reader = new FileReader()
        const fn = this.avatarRefresh
        reader.onload = function(evt) {
          var base64 = evt.target.result
          postUserAvatar(base64).then(() => {
            fn()
          })
        }
        reader.readAsDataURL(file)
      }
      return false
    }
  }
}
</script>

<style>
</style>