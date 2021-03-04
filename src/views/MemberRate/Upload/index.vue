<template>
  <div>
    <el-card style="height:25rem">
      <template #header>
        <h2>单位评级上传</h2>
      </template>
      <div class="center-children">
        <LottieIcon
          path="assets/lottie/lottie-rating.json"
          style="width:15rem;height:30rem;margin-top:-14rem"
        />
      </div>
      <div class="center-children">
        <el-button
          type="text"
          style="font-size:1.2rem;margin-top:-6rem;z-index:9"
          @click="download_template"
        >模板下载</el-button>
      </div>
      <div class="center-children">
        <el-upload
          drag
          multiple
          :before-upload="beforeAvatarUpload"
          :on-success="onUploadSuccess"
          :action="uploadurl"
          :data="file"
          style="margin-top:-4rem"
        >
          <i class="el-icon-upload" />
          <div class="el-upload__text">
            将模板文件拖到此处，或
            <em>点击上传</em>
          </div>
        </el-upload>
      </div>
    </el-card>
    <el-card v-if="loaded" style="margin-top:1rem">
      <template #header>
        <h2>上传结果</h2>
      </template>
    </el-card>
  </div>
</template>

<script>
export default {
  name: 'MemberRateUpload',
  components: {
    LottieIcon: () => import('@/components/LottieIcon')
  },
  data: () => ({
    file: {
      fileName: '',
      filePath: '',
      auth: {
        authByUserId: '',
        code: ''
      }
    },
    uploadurl: '',
    loaded: false
  }),
  mounted() {
    this.uploadurl = process.env.VUE_APP_BASE_API + '/file/upload'
  },
  methods: {
    download_template() {
      this.$message.error('施工中，暂未启用')
    },
    onUploadSuccess(data, status, arr) {
      if (data.status !== 0) {
        this.$message.error(data.message)
      } else {
        this.$message.success(`${status.name}上传成功`)
      }
      this.file.fileName = ''
    },
    beforeAvatarUpload(file) {
      if (!this.file.filePath) this.file.filePath = 'client-sfvue'
      this.file.fileName = file.name
      return true
    }
  }
}
</script>
<style lang="scss" scoped>
.center-children {
  display: flex;
  justify-content: center;
  height: 5rem;
}
</style>
