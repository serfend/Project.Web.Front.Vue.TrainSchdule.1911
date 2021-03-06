<template>
  <div>
    <el-row :gutter="20">
      <el-col :xl="8" :lg="13" :md="18" :sm="24">
        <LottieIcon
          path="assets/lottie/lottie-rating.json"
          style="position:absolute;width:15rem;height:30rem;margin-top:-13rem;margin-left:10rem"
        />
        <el-card v-loading="loading">
          <template #header>
            <h2>单位评级上传</h2>
          </template>
          <el-form label-width="5rem">
            <el-form-item label="模板下载">
              <el-button type="primary" @click="download_template">默认模板</el-button>
              <el-button type="primary" disabled @click="download_template">本单位样例模板</el-button>
              <el-button type="primary" disabled @click="download_template">本单位上期提交</el-button>
            </el-form-item>
            <el-form-item label="类别">
              <el-radio-group v-model="file.ratingType">
                <el-tooltip
                  v-for="i in Object.keys(ratingType)"
                  :key="i"
                  :disabled="!ratingType[i][1]"
                  content="未开放此类评比"
                >
                  <el-radio-button :label="i" :disabled="ratingType[i][1]">{{ ratingType[i][0] }}</el-radio-button>
                </el-tooltip>
              </el-radio-group>
            </el-form-item>
            <el-form-item label="评比期数">
              <el-radio-group v-if="file.ratingType==8" v-model="ratingCycleDate">
                <el-radio-button label="一季度" />
                <el-radio-button label="二季度" />
                <el-radio-button label="三季度" />
                <el-radio-button label="四季度" />
              </el-radio-group>
              <el-date-picker
                v-else
                v-model="ratingCycleDate"
                :type="ratingType[file.ratingType][2]"
              />
              <span v-if="file.ratingCycleCount" style="color:#eee">{{ file.ratingCycleCount }}期</span>
            </el-form-item>
            <el-form-item label="评比单位">
              <CompanySelector
                v-model="judgeCompany"
                v-loading="loading_company"
                placeholder="本次评比的实施单位"
              />
            </el-form-item>
            <el-form-item label="上传数据">
              <span v-if="!canSubmit">信息不全，不可提交</span>
              <el-upload
                v-else
                v-loading="loading_company"
                drag
                accept="xlsx"
                :before-upload="beforeAvatarUpload"
                :on-success="onUploadSuccess"
                :action="uploadurl"
                :data="file"
                :show-file-list="false"
                with-credentials
              >
                <i class="el-icon-upload" />
                <div class="el-upload__text">
                  将文档拖到此处，或
                  <em>点击上传</em>
                </div>
              </el-upload>
            </el-form-item>
            <el-form-item label="覆盖历史">
              <el-tooltip content="当存在历史已上传过的数据时，直接覆盖此数据">
                <el-switch v-model="file.confirm" />
              </el-tooltip>
            </el-form-item>
          </el-form>
        </el-card>
      </el-col>
    </el-row>
    <el-dialog :visible.sync="hasError">
      <template #title>
        <h2>上传数据有误</h2>
      </template>
      <el-button
        type="primary"
        style="width:100%;margin-bottom:1rem"
        @click="download_callback"
      >下载反馈文件</el-button>
      <el-table
        row-key="key"
        :tree-props="{children:'children',hasChildren:'hasChildren'}"
        :data="errorList"
      >
        <el-table-column label="位置">
          <template #default="scope">
            <span>{{ scope.row.title }}</span>
            <el-tag
              v-if="scope.row.children && scope.row.children.length"
              size="mini"
            >此行另外{{ scope.row.children.length }}项</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="问题">
          <template #default="scope">{{ scope.row.message }}</template>
        </el-table-column>
      </el-table>
    </el-dialog>
    <el-dialog v-if="existList" :visible.sync="existDialog">
      <template #title>
        <h2 v-if="existIsForDuplicate">存在以下已存在项,是否覆盖</h2>
        <h2 v-else>下列身份证号未注册，无法上传</h2>
      </template>
      <el-divider />
      <div v-if="existIsForDuplicate">
        <h3>共{{ existList.length }}人</h3>
        <div
          v-for="list in Math.ceil(existList.length/5)"
          :key="list"
          style="display:flex;overflow:auto;margin-top:0.5rem"
        >
          <UserFormItem
            v-for="(i,index) in existList.slice(list*5-5,list*5)"
            :key="index"
            :userid="i.userId"
            style="margin-left:0.5rem"
          />
        </div>
      </div>
      <div v-else>
        <CopyableLabel v-for="i,index in existList" :key="index" :label="i" />
      </div>
      <template #footer>
        <div>
          <el-button v-if="existIsForDuplicate" type="text" @click="confirmSubmit(true)">确认覆盖</el-button>
          <el-button type="primary" @click="confirmSubmit(false)">取消</el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script>
const ratingType = {
  1: ['每日', true, 'date'],
  2: ['周考', true, 'week'],
  4: ['月评', false, 'month'],
  8: ['季度', true, 'season'],
  16: ['年终', true, 'year']
}
import { download_template, upload_data_by_last } from '@/api/memberRate/xls'
import { downloadUrl } from '@/api/common/static'
export default {
  name: 'MemberRateUpload',
  components: {
    LottieIcon: () => import('@/components/LottieIcon'),
    UserFormItem: () => import('@/components/User/UserFormItem'),
    CopyableLabel: () => import('@/components/Label/CopyableLabel'),
    CompanySelector: () => import('@/components/Company/CompanySelector')
  },
  data: () => ({
    ratingType,
    file: {
      file: null,
      create: null,
      ratingCycleCount: null,
      ratingType: 4,
      company: null,
      confirm: false
    },
    loading_company: false,
    ratingCycleDateValue: new Date(),
    uploadurl: '',
    loading: false,
    errorList: [],
    errorFileCallback: '',
    hasError: false,
    existList: null,
    existDialog: false
  }),
  computed: {
    judgeCompany: {
      get() {
        const c = this.file.company
        return { code: c }
      },
      set(val) {
        this.file.company = val.code
      }
    },
    existIsForDuplicate() {
      return this.existList[0] && this.existList[0].userId
    },
    canSubmit() {
      const f = this.file
      return f.ratingCycleCount && f.ratingType
    },
    ratingCycleDate: {
      get() {
        return this.ratingCycleDateValue
      },
      set(v) {
        this.ratingCycleDateValue = v
        this.file.ratingCycleCount = this.convertDateToCycle()
      }
    }
  },
  watch: {
    errorList: {
      handler(val) {
        if (val && val.length) {
          this.hasError = true
        }
      }
    }
  },
  mounted() {
    this.uploadurl = process.env.VUE_APP_BASE_API + '/memberRate/xlsUpload'
    this.ratingCycleDate = this.ratingCycleDateValue
    this.loading_company = true
    setTimeout(() => {
      this.loading_company = false
      this.file.company = this.$store.state.user.companyid
    }, 1000)
  },
  methods: {
    confirmSubmit(confirm) {
      this.existDialog = false
      if (confirm) {
        this.loading = true
        upload_data_by_last()
          .then(() => {
            this.$message.success('已确认并上传')
          })
          .finally(() => {
            this.loading = false
          })
      }
    },
    download_template,
    download_callback() {
      const url = this.errorFileCallback
      downloadUrl(url)
    },
    convertDateToCycle() {
      const v = this.ratingCycleDate
      switch (this.file.ratingType) {
        case 4: {
          return (v.getFullYear() - 2000) * 12 + v.getMonth() + 1
        }
      }
    },
    convertMessage(msg) {
      if (!msg) return '无'
      const p = msg.indexOf('Object')
      if (p > -1) return `${msg.substr(0, p)}存在错误`
      return msg
    },
    onUploadSuccess(data, status, arr) {
      this.loading = false
      this.errorList = []
      this.existList = []
      if (data.status !== 0) return this.$message.error(data.message)
      const list = data.data && data.data.list
      if (!list) return this.$message.success('上传成功')
      if (this.checkDataValid(list)) return
      if (this.checkDataExist(list)) return
    },
    checkDataValid(list) {
      const s = list.splice(list.length - 1, 1)[0]
      if (!s) return this.$message.error('上传文件异常')
      const isDataInvalid = s.key
      if (isDataInvalid && s.key.toLowerCase() === 'labelpath') {
        this.errorFileCallback = s.message.replace('temp', '/sftemporary')
      } else {
        this.errorFileCallback = null
        list.unshift(s)
        if (!isDataInvalid) return false
      }

      let index = 0
      this.errorList = list.map(i => {
        const messages = i.message.split(';')
        const first = messages.shift()
        return {
          key: index++,
          title: i.key,
          message: this.convertMessage(first),
          children: messages.map(i => ({
            key: index++,
            message: this.convertMessage(i)
          }))
        }
      })
      return true
    },
    checkDataExist(list) {
      this.existList = list
      this.existDialog = true
      return true
    },
    beforeAvatarUpload(file) {
      this.file.ratingCycleCount = this.convertDateToCycle()
      this.loading = true
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
