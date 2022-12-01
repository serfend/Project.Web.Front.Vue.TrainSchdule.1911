<template>
  <el-dialog :visible.sync="inner_show" append-to-body>
    <template #title>
      <h2>设置</h2>
    </template>
    <el-form v-if="inner_data" label-width="10rem">
      <el-form-item label="数据集名称">{{ inner_data.databaseName }}</el-form-item>
      <el-form-item label="事件区间周期">历史上每年</el-form-item>
      <el-form-item label="事件区间类型">
        <el-select v-model="inner_data.securityEventType" clearable>
          <el-option
            v-for="(item) in securityEventTypes"
            :key="item.id"
            :value="item.value"
            :label="item.alias"
            :disabled="item.disabled"
          />
        </el-select>
      </el-form-item>
      <el-form-item v-if="dict" label="事件类型">
        <el-select v-model="inner_data.eventType" clearable>
          <el-option
            v-for="(item) in Object.values(dict)"
            :key="item.id"
            :value="item.id"
            :label="item.fullName"
            :disabled="item.disabled"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="查询日期">
        <el-switch v-model="is_today" active-text="查询当前时间" inactive-text="查询指定时间" />
        <DatetimePicker
          v-if="!is_today"
          v-model="inner_data.time"
          type="datetime"
          :color="theme"
          format="YYYY-MM-DD"
          locale="zh-cn"
          :locale-config="localeConfig"
        />
      </el-form-item>
    </el-form>
  </el-dialog>
</template>
<script>
import localeConfig from '@/lang/locale-config'
export default {
  name: 'EventConfig',
  components: {
    DatetimePicker: () => import('vue-persian-datetime-picker')
  },
  model: {
    prop: 'data',
    event: 'change'
  },
  props: {
    show: { type: Boolean, default: true },
    name: { type: String, default: null },
    keyName: { type: String, default: null },
    data: { type: Object, default: null }
  },
  data: () => ({
    localeConfig,
    inner_show: false,
    inner_data: null,
    securityEventTypes: [
      { value: 0, alias: '全部' },
      { value: 1, alias: '今天' },
      { value: 2, alias: '本周' },
      { value: 3, alias: '本月' },
      { value: 4, alias: '本季度' },
      { value: 5, alias: '本年度' },
    ],
    is_today: true
  }),
  computed: {
    dict() {
      return this.$store.state.secEvent.securityEventTypesDict
    },
    theme() {
      return this.$store.state.settings.theme
    },
    key () {
      return `config.sec-event.event-list@${this.keyName}`
    }
  },
  watch: {
    show: {
      handler (val) {
        this.inner_show = val
      },
      immediate: true
    },
    inner_show: {
      handler (val) {
        this.$emit('update:show', val)
      }
    },
    data: {
      handler (val) {
        this.inner_data = val
      }
    },
    inner_data: {
      handler (val) {
        this.$emit('change', Object.assign(val, { databaseName: this.name }))
        localStorage.setItem(this.key, JSON.stringify(val))
      },
      deep: true
    }
  },
  mounted () {
    const data = localStorage.getItem(this.key) || '{}'
    this.inner_data = JSON.parse(data)
  }
}
</script>
