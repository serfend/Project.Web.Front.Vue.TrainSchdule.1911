<template>
  <el-card style="width:250px">
    <el-row v-if="innerData">
      <el-col :span="8">
        <el-avatar :size="60" :src="avatar" />
      </el-col>
      <el-col :span="16">
        <h2>{{ innerData.realName }}</h2>
        <div style="color:#cccccc">{{ innerData.id }}</div>
        <div style="color:#8f8f8f">{{ innerData.about }}</div>
        <el-tag
          :style="{ 'background-color':innerData.gender==2?'#ee6666':'#60c3e9',color:'#ffffff' }"
          size="mini"
        >
          <div>{{ innerData.companyName }}{{ innerData.dutiesName }}</div>
        </el-tag>
      </el-col>
    </el-row>
    <el-row v-else style="color:#888888;font-size:0.5em">加载中...</el-row>
  </el-card>
</template>

<script>
import { getUserAvatar } from '@/api/userinfo'
export default {
  name: 'Duty',
  props: {
    data: {
      type: Object,
      default() {
        return {
          realName: 'null'
        }
      }
    },
    canLoadAvatar: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      avatar: '',
      userid: '',
      innerData: {}
    }
  },
  watch: {
    canLoadAvatar: {
      handler(val) {
        if (val) this.refreshAvatar()
      },
      immediate: true
    },
    data: {
      handler(val) {
        this.innerData = val
      },
      immediate: true
    },
    'data.id': {
      handler(val) {
        if (!val) return
        this.userid = val
        this.refreshAvatar()
      },
      immediate: true
    }
  },
  mounted() {
    this.refreshAvatar()
  },
  methods: {
    refreshAvatar() {
      if (!this.canLoadAvatar) return
      getUserAvatar(this.userid).then(data => {
        this.avatar = data.url
      })
    }
  }
}
</script>

<style>
</style>
