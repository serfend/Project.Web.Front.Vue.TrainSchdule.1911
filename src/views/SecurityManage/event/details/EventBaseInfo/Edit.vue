<template>
  <el-dialog :visible.sync="inner_show">
    <template #title>
      <h2>{{ config.formAppend.dialogTitle||'会议信息编辑' }}</h2>
    </template>
    <el-form
      v-if="inner_data"
      v-loading="isLoading"
      :label-width="config.conferType===128?'':'5rem'"
    >
      <el-form-item v-if="config.conferType==128" label="教育安排来源">
        <el-select v-model="inner_data['educationSource']">
          <el-option label="上级统一部署" value="上级统一部署" />
          <el-option label="本级自主安排" value="本级自主安排" />
        </el-select>
      </el-form-item>
      <el-form-item v-if="config.conferType==128" label="教育类型">
        <el-select v-model="inner_data['educationType']">
          <el-option label="理论学习" value="理论学习" />
          <el-option label="基础教育" value="基础教育" />
          <el-option label="主题教育" value="主题教育" />
          <el-option label="经常性思想教育" value="经常性思想教育" />
        </el-select>
      </el-form-item>
      <el-form-item v-if="config.conferType==128" label="教育方法">
        <el-select v-model="inner_data['educationMethod']">
          <el-option label="课堂教育灌输" value="课堂教育灌输" />
          <el-option label="群众自我教育" value="群众自我教育" />
          <el-option label="网络手段教育" value="网络手段教育" />
          <el-option label="文化配教活动" value="文化配教活动" />
          <el-option label="革命仪式感召" value="革命仪式感召" />
          <el-option label="警示教育" value="警示教育" />
          <el-option label="参观见学" value="参观见学" />
          <el-option label="战地宣传教育" value="战地宣传教育" />
        </el-select>
      </el-form-item>
      <el-form-item :label="config.formAppend.title||'标题'" required>
        <el-autocomplete
          v-model="inner_data.title"
          class="auto-input"
          :fetch-suggestions="(v,cb)=>querySearch(v,cb,'title')"
        />
      </el-form-item>
      <el-form-item v-if="!config.conferType" label="类型">
        <ConferTypeSelector v-model="inner_data.type" />
      </el-form-item>
      <el-form-item label="地点">
        <el-autocomplete
          v-model="inner_data.place"
          class="auto-input"
          :fetch-suggestions="(v,cb)=>querySearch(v,cb,'place')"
        />
      </el-form-item>
      <el-form-item :label="config.formAppend.content||'摘要'">
        <el-autocomplete
          v-model="inner_data.content"
          v-waves
          style="width:100%"
          type="textarea"
          :fetch-suggestions="(v,cb)=>querySearch(v,cb,'content')"
          autosize
        />
      </el-form-item>
      <el-form-item v-if="!isLoading&&inner_data" label="党组织" required>
        <PartyGroupSelector v-model="inner_data.createByGroup" :default-select-first-group="true" />
      </el-form-item>
      <el-form-item label="主持人" required>
        <UserSelector :code.sync="host" select-name="会议主持" style="display:inline" />
        <User :userid="host" />
      </el-form-item>
      <el-form-item :label="config.formAppend.startTime||'召开时间'" required>
        <DatetimePicker
          v-model="inner_data.startTime"
          type="datetime"
          view="year"
          :color="theme"
          format="YYYY-MM-DD HH:mm:ss"
          locale="zh-cn"
          :locale-config="localeConfig"
        />
      </el-form-item>
      <el-form-item label="结束时间" required>
        <DatetimePicker
          v-model="endTime"
          type="datetime"
          view="year"
          :color="theme"
          format="YYYY-MM-DD HH:mm:ss"
          locale="zh-cn"
          :locale-config="localeConfig"
        />
      </el-form-item>
    </el-form>
    <template #footer>
      <el-button type="success" plain @click="submit">保存</el-button>
      <el-button type="text" style="color:#ccc" @click="inner_show = false">取消</el-button>
    </template>
  </el-dialog>
</template>

<script>
import localeConfig from '@/lang/locale-config'
import { parseTime } from '@/utils'
import { patchConference } from '@/api/zzxt/party-conference/confer'
import { postConferRecord } from '@/api/zzxt/party-conference/record'
import waves from '@/directive/waves'
export default {
  name: 'ConferEdit',
  components: {
    ConferTypeSelector: () =>
      import('@/components/Party/ConferType/ConferTypeSelector'),
    PartyGroupSelector: () =>
      import('@/components/Party/PartyGroup/PartyGroupSelector'),
    DatetimePicker: () => import('vue-persian-datetime-picker'),
    UserSelector: () => import('@/components/User/UserSelector'),
    User: () => import('@/components/User/UserFormItem')
  },
  directives: {
    waves
  },
  props: {
    data: { type: Object, default: null },
    show: { type: Boolean, default: false },
    config: { type: Object, default: () => ({ formAppend: {}}) }
  },
  data: () => ({
    inner_data: null,
    localeConfig,
    inner_host: null,
    loading: false,
    isCreate: false,
    currentFormData: null
  }),
  computed: {
    isLoading() {
      return this.loading || !this.config
    },
    currentCompany() {
      return this.$store.state.user.globalCompany
    },
    partyGroupItemDict() {
      return this.$store.state.party.partyGroupItemDict
    },
    conferTypesDict() {
      return this.$store.state.party.conferTypesDict
    },
    conferContentHost() {
      return this.$store.state.party.conferContentHost
    },
    theme() {
      return this.$store.state.settings.theme
    },
    host: {
      get() {
        const host = this.inner_data.host
        return this.inner_host || (host && host.userId)
      },
      set(val) {
        this.inner_host = val
      }
    },
    endTime: {
      get() {
        const start = this.inner_data.startTime
        const length = this.inner_data.length
        return parseTime(new Date(new Date(start).getTime() + length * 1e3))
      },
      set(val) {
        const length = new Date(this.inner_data.startTime) - val
        this.inner_data.length = length / 1e3
      }
    },
    inner_show: {
      get() {
        return this.show
      },
      set(val) {
        this.$emit('update:show', val)
      }
    }
  },
  watch: {
    data: {
      handler(val) {
        if (val !== null) {
          this.currentFormData = null
          this.inner_data = val
          return
        }
        this.inner_data = {}
        this.getCurrentData()
        this.initConference()
      },
      immediate: true
    },
    'config.conferType': {
      handler(val) {
        if (!this.inner_data) this.inner_data = {}
        if (!this.inner_data.type) this.inner_data.type = val
      },
      immediate: true
    }
  },
  methods: {
    querySearch(queryString, cb, label) {
      if (!this.currentFormData) return cb([])
      const dict = {}
      this.currentFormData.map(i => (dict[i[label]] = true))
      cb(Object.keys(dict).map(i => ({ value: i, label: i })))
    },
    initConference() {
      const type = this.config.conferType
      const conferDict = this.conferTypesDict
      if (!type || !conferDict) {
        return setTimeout(() => {
          this.initConference()
        }, 2e2)
      }
      const userId = this.$store.state.user.userid
      const now = parseTime(new Date(), '{m}月{d}日')
      const typeName = conferDict[type] && conferDict[type].alias

      const data = this.currentFormData
      const firstItem = (data && data[0]) || {
        place: '',
        content: `召开${typeName}，就XXXX进行讨论。\n经过${typeName}，产生XXXX成果、XXXX成果和XXXXX成果，达到了预期效果。`
      }
      const result = {
        title: `${now} - ${typeName}`,
        place: firstItem.place,
        type,
        content: firstItem.content,
        host: { userId },
        startTime: parseTime(Math.ceil(new Date() / 1800e3) * 1800e3),
        length: 7200,
        createByGroup: null
      }
      this.inner_data = result
      return result
    },
    requireDelete() {
      const conference = this.inner_data
      this.$confirm('确定要删除会议吗').then(() => {
        this.$confirm(`您即将删除:${conference.title}`, {
          title: '删除后将不可恢复，请确认。',
          confirmButtonText: '我确定要删除，知晓不可恢复'
        }).then(() => {
          this.submit({ isRemoved: true })
        })
      })
    },
    submit() {
      const item = this.inner_data
      this.isCreate = !item.id
      this.loading = true
      let nowTasksCount = 2
      const cb = () => {
        nowTasksCount--
        if (nowTasksCount > 0) return
        setTimeout(() => {
          this.$message.success('提交成功')
          delete this.inner_data.id
        }, 5e2)
      }
      patchConference(Object.assign(item))
        .then(data => {
          this.inner_data.id = data.model.id
          this.handle_host(cb)
        })
        .finally(() => {
          this.loading = false
        })
    },
    handle_host(hostComplete) {
      const cb = newHost => {
        this.$message.success(`已修改${newHost ? '（包含主持人）' : ''}`)
        this.inner_show = false
        this.$emit('requireRefresh')
        if (hostComplete) hostComplete()
      }
      const d = this.inner_data
      const { id, host } = d
      const h = this.host
      const type = this.conferContentHost.value
      let action
      if (host) {
        if (host.userId === h && !this.isCreate) {
          return cb(false) // 如果是修改会议信息且主持一致则跳过
        }
        action = this.isCreate
          ? Promise.resolve()
          : postConferRecord({
            conferenceId: id,
            type,
            userId: host.userId,
            isRemoved: true
          })
      }
      Promise.all([action]).then(() => {
        if (!h) return cb(false)
        return postConferRecord({
          conferenceId: id,
          type,
          userId: h
        }).then(() => {
          return cb(h)
        })
      })
    }
  }
}
</script>
<style scoped>
.auto-input {
  width: 80%;
}
</style>
