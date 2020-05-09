<template>
  <el-card :style="{width:width}">
    <el-container v-if="innerData">
      <el-aside width="100px" style="padding:0;margin:0;background: rgb(255, 255, 255);">
        <el-popover :placement="direction" trigger="hover" @show="loadContactMe">
          <ContactMe
            v-if="contactMeHasShow"
            :content="contactUrl"
            :description="`微信或手机通讯录扫码，获取${innerData.realName}的联系方式`"
          />
          <div slot="reference">
            <el-avatar :size="100" :src="avatar" />
          </div>
        </el-popover>
        <el-tag
          :style="{ 'background-color':innerData.gender==2?'#ee6666':'#60c3e9',color:'#ffffff',display:'grid','justify-items':'center'}"
          size="mini"
        >
          <div>{{ innerData.dutiesName }}</div>
        </el-tag>
      </el-aside>

      <el-main style="padding:0;margin:0;background: rgb(255, 255, 255);">
        <div style="padding-left:10px">
          <h2>{{ innerData.realName }}</h2>
          <div style="color:#cccccc">{{ innerData.id }}</div>
          <div style="color:#8f8f8f">{{ innerData.about }}</div>
          <div>{{ innerData.companyName }}</div>
        </div>
      </el-main>
    </el-container>

    <div v-else style="color:#888888;font-size:0.5em">加载中...</div>
  </el-card>
</template>

<script>
import ContactMe from '@/components/ContactMe'
import { getUserAvatar, getUserSocial } from '@/api/userinfo'
export default {
  name: 'Duty',
  components: { ContactMe },
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
    },
    direction: {
      type: String,
      default: 'top'
    },
    width: {
      type: String,
      default: '350px'
    }
  },
  data() {
    return {
      avatar: '',
      userid: '',
      phone: '',
      innerData: {},
      contactMeHasShow: false
    }
  },
  computed: {
    contactUrl() {
      return `MECARD:TEL:${this.phone};N:${this.innerData.realName};EMAIL:${this.innerData.id}@xjxt.mtn;NOTE:${this.innerData.about};`
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
    loadContactMe() {
      if (this.contactMeHasShow) return
      this.contactMeHasShow = true
    },
    refreshAvatar() {
      if (!this.canLoadAvatar) return
      getUserAvatar(this.userid).then(data => {
        this.avatar = data.url
      })
      getUserSocial(this.userid).then(data => {
        this.phone = data.phone
      })
    }
  }
}
</script>

<style>
</style>
