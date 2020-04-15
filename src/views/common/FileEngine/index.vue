<template>
  <el-form style="justify-content:center">
    <el-row>
      <el-col class="row">
        <el-card header="文件上传">
          <el-form-item label="文件名称">
            <el-input v-model="file.fileName" />
          </el-form-item>
          <el-form-item label="路径">
            <el-input v-model="file.filePath" />
          </el-form-item>
          <AuthCode :form.sync="file.auth" />
          <el-form-item label="文件">
            <el-upload
              drag
              multiple
              :before-upload="beforeAvatarUpload"
              :on-success="onUploadSuccess"
              :action="uploadurl"
              :data="file"
            >
              <i class="el-icon-upload" />
              <div class="el-upload__text">
                将文件拖到此处，或
                <em>点击上传</em>
              </div>
            </el-upload>
          </el-form-item>
        </el-card>
      </el-col>
      <el-col class="row">
        <el-card :header="nowLoadingFile">
          <el-form-item label="id">{{ fileInfo.id }}</el-form-item>
          <el-form-item label="路径">{{ fileInfo.path }}</el-form-item>
          <el-form-item label="名称">{{ fileInfo.name }}</el-form-item>
          <el-form-item label="大小">{{ fileInfo.length }}</el-form-item>
          <el-form-item label="创建时间">{{ fileInfo.create }}</el-form-item>
          <el-form-item label="验证码">{{ fileInfo.clientKey }}</el-form-item>
          <el-button
            :disabled="!fileInfo.id"
            :loading="fileDownloading"
            type="success"
            style="width:100%"
            icon="el-icon-download"
            @click="download(fileInfo.id,`${fileInfo.path}_${fileInfo.name}`)"
          >下载文件</el-button>
        </el-card>
      </el-col>
      <el-col class="row">
        <el-card>
          <template slot="header">
            近期
            <el-button
              :loading="statusLoading"
              style="float:right"
              type="primary"
              icon="el-icon-refresh-left"
              circle
              @click="refreshStatus"
            />
          </template>
          <div v-for="i in statusList" :key="i.id">
            <el-form-item :label="i.fileInfo.name">
              <el-row>
                <el-tag>{{ i.fileInfo.path }}</el-tag>
                {{ i.fileInfo.create }}
              </el-row>
              <el-row>{{ i.current }} / {{ i.total }}</el-row>
              <el-row>
                <el-progress :percentage="i.total<=0?0:100*i.current/i.total" show-text />
              </el-row>
            </el-form-item>
          </div>
        </el-card>
      </el-col>
    </el-row>
  </el-form>
</template>

<script>
// download,
import AuthCode from '@/components/AuthCode'
import { upload, requestFile, status, getClientKey } from '@/api/file'
export default {
  name: 'FileEngine',
  components: { AuthCode },
  data() {
    return {
      statusLoading: false,
      file: {
        fileName: '',
        filePath: '',
        auth: {
          authByUserId: '',
          code: ''
        }
      },
      fileDownloading: false,
      fileInfo: {
        name: '',
        path: '',
        length: '',
        create: '',
        id: '',
        clientKey: ''
      },
      uploadurl: '',
      statusList: [],
      lastQueryDate: new Date(),
      lastLfpn: ''
    }
  },
  computed: {
    nowLoadingFile() {
      return `文件下载 ${this.file.filePath}/${this.file.fileName}`
    }
  },
  watch: {
    file: {
      handler(val) {
        if (val && val.filePath && val.fileName) {
          var lastQueryDate = new Date()
          this.lastQueryDate = lastQueryDate
          setTimeout(() => {
            if (this.lastQueryDate === lastQueryDate) {
              var lastLfpn = `${this.file.filePath}/${this.file.fileName}`
              if (lastLfpn === this.lastLfpn) return
              requestFile(val.filePath, val.fileName).then(data => {
                var id = data.file.id
                data.file.clientKey = '加载中...'
                this.$forceUpdate()
                getClientKey(id, this.file.auth)
                  .then(ck => {
                    this.fileInfo.clientKey = ck
                    this.file.clientKey = ck
                    this.$forceUpdate()
                  })
                  .catch(e => {
                    this.fileInfo.clientKey = `无法加载(${e.message})`
                  })
                  .finally(() => {
                    this.lastLfpn = ''
                  })
                this.fileInfo = data.file
              })
            }
          }, 1000)
        }
      },
      deep: true,
      immediate: true
    }
  },
  mounted() {
    this.uploadurl = process.env.VUE_APP_BASE_API + '/file/upload'
    this.refreshStatus()
  },
  methods: {
    download(fileid, fileName) {
      var requestUrl =
        process.env.VUE_APP_BASE_API + '/file/download?fileid=' + fileid
      var a = document.createElement('a')
      a.href = requestUrl
      a.click()
      // this.fileDownloading = true
      // download(fileid).then(data => {
      //   const blob = new Blob([data])
      //   var link = document.createElement('a')
      //   link.href = window.URL.createObjectURL(blob)
      //   link.download = fileName
      //   link.click()
      //   window.URL.revokeObjectURL(link.href)
      //   this.fileDownloading = false
      // })
    },
    upload,
    requestFile,
    status,
    onUploadSuccess(data, status, arr) {
      if (data.status !== 0) {
        this.$message.error(data.message)
      } else {
        this.$message.success(`${status.name}上传成功`)
      }
      this.refreshStatus()
      this.file.fileName = ''
    },
    beforeAvatarUpload(file) {
      if (!this.file.filePath) this.file.filePath = 'client-sfvue'
      this.file.fileName = file.name

      return true
    },
    refreshStatus() {
      status().then(data => {
        this.statusList = data.fileStatus
      })
    }
  }
}
</script>
<style scoped>
.row {
  width: 400px;
  margin: 10px;
}
</style>
