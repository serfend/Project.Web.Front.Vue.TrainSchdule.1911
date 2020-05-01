<template>
  <el-card header="二维码生成">
    <el-form label-width="60px">
      <el-container>
        <el-aside width="400px" style="background:#fff">
          <el-form-item label="内容">
            <el-input v-model="file.data" type="textarea" autosize />
          </el-form-item>
          <el-form-item label="二维码">
            <ContactMe :content="file.data" description />
          </el-form-item>
        </el-aside>
        <el-main>
          <el-form-item>
            <el-upload
              drag
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
          <el-form-item style="width:420px">
            <el-image :src="file.imgraw" />
          </el-form-item>
        </el-main>
      </el-container>
    </el-form>
  </el-card>
</template>

<script>
import ContactMe from '@/components/ContactMe'
import { qrCodeScan } from '@/api/qrCode'
export default {
  name: 'QrCodeScan',
  components: { ContactMe },
  data() {
    return {
      uploadurl: '',
      file: {
        img: '',
        imgraw: '',
        data: ''
      }
    }
  },
  methods: {
    beforeAvatarUpload(file) {
      const cfile = this.file
      var self = this
      var reader = new FileReader()
      reader.onload = function(evt) {
        cfile.imgraw = evt.target.result
        cfile.img = cfile.imgraw.substring('data:image/jpeg;base64,'.length)
        qrCodeScan(cfile.img).then(data => {
          cfile.data = data.data
          self.$message.success(`加载${file.name}成功`)
        })
      }
      reader.readAsDataURL(file)
      return false
    },
    onUploadSuccess(data, status, arr) {
      if (data.status !== 0) {
        this.$message.error(data.message)
      } else {
        this.$message.success(`${status.name}识别成功`)
      }
    }
  }
}
</script>

<style>
</style>
