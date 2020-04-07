<template>
  <el-card style="width:250px">
    <el-row>
      <el-col :span="8">
        <el-avatar :size="60" :src="avatar" />
      </el-col>
      <el-col :span="16">
        <h2>{{ data.realName }}</h2>
        <div style="color:#cccccc">{{ data.id }}</div>
        <div style="color:#8f8f8f">{{ data.about }}</div>
        <el-tag
          :style="{  'background-color':data.gender==2?'#ee6666':'#60c3e9',color:'#ffffff' }"
          size="mini"
        >
          <div>{{ data.companyName }}{{ data.dutiesName }}</div>
        </el-tag>
      </el-col>
    </el-row>
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
      userid: ''
    }
  },
  mounted() {
    this.refreshAvatar()
  },
  watch: {
    canLoadAvatar: {
      handler(val) {
        if (val) this.refreshAvatar()
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
