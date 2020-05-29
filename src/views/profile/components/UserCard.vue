<template>
  <el-card v-loading="loading">
    <el-row type="flex">
      <el-col :span="6">
        <el-upload
          :action="avatarSubmitUrl"
          :before-upload="beforeAvatarUpload"
          class="avatar-uploader"
          :show-file-list="false"
        >
          <el-avatar v-if="user.avatar" :size="100" shape="square" :src="user.avatar" />
          <i v-else class="el-icon-plus avatar-uploader-icon" />
        </el-upload>
      </el-col>
      <el-col :span="6">
        <el-link style="font-size:1.5em">{{ user.realName }}</el-link>
        <el-link icon="el-icon-edit">{{ user.about }}</el-link>
      </el-col>
    </el-row>
  </el-card>
</template>

<script>
import { postUserAvatar } from '@/api/user/userinfo'
export default {
  components: {},
  props: {
    user: {
      type: Object,
      default: () => {
        return {
          id: '',
          realName: '',
          about: '',
          gender: 1,
          avatar: '',
          companyCode: '',
          dutiesCode: 0,
          companyName: '',
          dutiesName: ''
        }
      }
    }
  },
  data() {
    return {
      avatarSubmitUrl: '',
      loading: false
    }
  },
  created() {
    this.avatarSubmitUrl = process.env.VUE_APP_BASE_API + '/users/avatar'
  },
  methods: {
    avatarRefresh() {
      this.$emit('avatarRefresh')
    },
    beforeAvatarUpload(file) {
      const isLt2M = file.size / 1024 / 1024 / 1024 < 200
      if (!isLt2M) {
        this.$message.error('上传头像图片大小不能超过 200KB')
      }
      if (isLt2M) {
        var self = this
        var reader = new FileReader()
        const fn = this.avatarRefresh
        reader.onload = function(evt) {
          var base64 = evt.target.result
          self.loading = true
          postUserAvatar(base64)
            .then(() => {
              fn()
            })
            .finally(() => {
              self.loading = false
            })
        }
        reader.readAsDataURL(file)
      }
      return false
    }
  }
}
</script>

<style lang="scss" scoped>
.avatar-uploader .el-upload {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}
.avatar-uploader .el-upload:hover {
  border-color: #ff9be3;
}
.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 178px;
  height: 178px;
  line-height: 178px;
  text-align: center;
}
.avatar {
  width: 178px;
  height: 178px;
  display: block;
}
</style>
