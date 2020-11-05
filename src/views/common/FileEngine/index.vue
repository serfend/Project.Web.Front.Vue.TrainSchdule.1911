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
          <el-form-item label="验证码">
            <el-input v-model="fileInfo.clientKey" />
          </el-form-item>
          <div>
            <el-button
              :disabled="!fileInfo.id"
              :loading="fileDownloading"
              type="info"
              class="file-handle-btn"
              icon="el-icon-document-copy"
              @click="clipBoard(fileInfo.id,`${fileInfo.path}_${fileInfo.name}`,$event)"
            >复制链接</el-button>
          </div>
          <div>
            <el-button
              :disabled="!fileInfo.id"
              :loading="fileDownloading"
              type="success"
              class="file-handle-btn"
              icon="el-icon-download"
              @click="download(fileInfo.id,`${fileInfo.path}_${fileInfo.name}`)"
            >下载文件</el-button>
          </div>
          <div>
            <el-button
              :disabled="!fileInfo.clientKey||fileInfo.clientKey.length!=36"
              :loading="fileDownloading"
              type="danger"
              class="file-handle-btn"
              icon="el-icon-delete"
              @click="deleteFile(fileInfo.path,fileInfo.name,fileInfo.clientKey)"
            >删除文件{{ !fileInfo.clientKey||fileInfo.clientKey.length==36?'':'(需要授权码)' }}</el-button>
          </div>
        </el-card>
      </el-col>
      <el-col>
        <el-card :header="`文件:${file.filePath}`">
          <Explorer :path.sync="file.filePath" @select="fileSelect" />
        </el-card>
      </el-col>
    </el-row>
  </el-form>
</template>

<script>
// download,
import clipboard from '@/utils/clipboard'
import AuthCode from '@/components/AuthCode'
import Explorer from './Explorer'
import {
  requestFile,
  getClientKey,
  deleteFile,
} from '@/api/common/file'
export default {
  name: 'FileEngine',
  components: { AuthCode, Explorer },
  data() {
    return {
      statusLoading: false,
      file: {
        fileName: '',
        filePath: '',
        auth: {
          authByUserId: '',
          code: '',
        },
      },
      fileDownloading: false,
      fileInfo: {
        name: '',
        path: '',
        length: '',
        create: '',
        id: '',
        clientKey: '',
      },
      uploadurl: '',
      statusList: [],
      lastQueryDate: new Date(),
    }
  },
  computed: {
    nowLoadingFile() {
      return `文件下载 ${this.file.filePath}/${this.file.fileName}`
    },
  },
  watch: {
    file: {
      handler(val) {
        var lastQueryDate = new Date()
        this.lastQueryDate = lastQueryDate
        setTimeout(() => {
          if (this.lastQueryDate === lastQueryDate) {
            this.updateFile()
          }
        }, 1000)
      },
      deep: true,
      immediate: true,
    },
  },
  mounted() {
    this.uploadurl = process.env.VUE_APP_BASE_API + '/file/upload'
    this.refreshStatus()
  },
  methods: {
    fileSelect(file) {
      this.file.fileName = file
    },
    deleteFile(filepath, filename, clientkey) {
      deleteFile(filepath, filename, clientkey).then(() => {
        this.$message.success('删除成功')
      })
    },
    downloadUrl(fileId) {
      return `${process.env.VUE_APP_BASE_API}/file/download?fileid=${fileId}`
    },
    clipBoard(fileid, fileName, event) {
      clipboard(this.downloadUrl(fileid), event).then(() => {
        this.$message.success(`文件${fileName} 链接已复制`)
      })
    },
    download(fileid, fileName) {
      var a = document.createElement('a')
      a.href = this.downloadUrl(fileid)
      a.click()
    },
    updateFile() {
      if (!this.file || !this.file.filePath || !this.file.fileName) return
      requestFile(this.file.filePath, this.file.fileName).then((data) => {
        var id = data.file.id
        data.file.clientKey = '加载中...'
        this.$nextTick(() => {
          getClientKey(id, this.file.auth)
            .then((ck) => {
              this.fileInfo.clientKey = ck
              this.file.clientKey = ck
              this.$forceUpdate()
            })
            .catch((e) => {
              this.fileInfo.clientKey = `无法加载(${e.message})`
            })
          this.fileInfo = data.file
        })
      })
    },
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
    refreshStatus() {},
  },
}
</script>
<style scoped>
.row {
  width: 400px;
  margin: 10px;
}
.file-handle-btn {
  width: 100%;
  margin-bottom: 1em;
}
</style>
