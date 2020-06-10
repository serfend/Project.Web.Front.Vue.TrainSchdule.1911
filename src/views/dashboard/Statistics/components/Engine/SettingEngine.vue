<template>
  <div>
    <div v-show="!showDialog" class="display-item" @click="showSetting">设置</div>
    <el-dialog :visible.sync="showDialog" title="设置" append-to-body>
      <MagicForm v-if="innerSetting" v-model="innerSetting" />
      <el-alert v-else type="error">设置选项未初始化</el-alert>
      <template slot="footer">
        <el-button type="success" icon="el-icon-upload" @click="saveSetting">保存</el-button>
        <el-button type="danger" icon="el-icon-download" @click="reloadPage">加载</el-button>
        <el-select v-model="settingName" allow-create filterable>
          <el-option v-for="item in settings" :key="item" :value="item" :label="item" />
        </el-select>
      </template>
    </el-dialog>
  </div>
</template>

<script>
import { saveSetting, loadSetting } from './setting'
import MagicForm from '@/components/MagicForm'
import { debounce } from '@/utils'
export default {
  name: 'SettingEngine',
  components: { MagicForm },
  props: {
    setting: {
      type: Object,
      default() {
        return null
      }
    }
  },
  data: () => ({
    showDialog: false,
    innerSetting: null,
    settingName: 'default',
    settings: ['default'],
    lastUpdate: new Date()
  }),
  computed: {
    updatedSetting() {
      return debounce(() => {
        this.$emit('update:setting', this.innerSetting)
      }, 500)
    }
  },
  watch: {
    settings: {
      handler(val) {
        this.$nextTick(() => {
          this.saveConfig()
        })
      }
    },
    settingName: {
      handler(val) {
        this.$nextTick(() => {
          loadSetting(val)
          this.saveConfig()
        })
      }
    },
    setting: {
      handler(val) {
        if (val) {
          this.innerSetting = val
        }
      },
      immediate: true
    },
    innerSetting: {
      handler(val) {
        this.updatedSetting()
      },
      deep: true
    }
  },
  mounted() {
    var rawSetting = localStorage.getItem('dashboard.settings')
    if (rawSetting) {
      var item = JSON.parse(rawSetting)
      this.settings = item.settings
      this.settingName = item.name
      loadSetting(this.settingName)
    }
  },
  methods: {
    showSetting() {
      this.showDialog = true
    },
    saveSetting() {
      saveSetting(this.settingName, this.innerSetting)
    },
    reloadPage() {
      this.$confirm('重新加载设置将刷新页面').then(() => {
        this.$router.go(0)
      })
    },
    saveConfig() {
      if (this.settings.indexOf(this.settingName) === -1) {
        this.settings.push(this.settingName)
      }
      localStorage.setItem(
        'dashboard.settings',
        JSON.stringify({
          name: this.settingName,
          settings: this.settings
        })
      )
    }
  }
}
</script>

<style lang="scss" scoped>
.display-item {
  color: #aaa;
  font-size: 0.05rem;
  cursor: pointer;
}
</style>
