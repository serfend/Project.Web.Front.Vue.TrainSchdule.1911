<template>
  <el-card :style="{width:innerData&&innerData.id?width:'100%'}">
    <el-container v-if="innerData&&innerData.id">
      <el-aside
        width="100px"
        style="padding:0;margin:0;display:grid;justify-content:center;background:#0000"
      >
        <el-image :src="avatar" :preview-src-list="[avatar]" class="avatar" />
        <el-tag
          :style="{ 'background-color':innerData.gender==2?'#ee6666':'#60c3e9',color:'#ffffff',display:'grid','justify-items':'center','margin-top':'1em'}"
        >
          <div>{{ innerData.dutiesName }}</div>
        </el-tag>
      </el-aside>

      <el-popover v-loading="loading" :placement="direction" trigger="hover" @show="loadContactMe">
        <ContactMe
          v-if="contactMeHasShow"
          :content="contactUrl"
          :description="`微信或手机通讯录扫码，获取${innerData.realName}的联系方式`"
        />
        <el-main slot="reference" class="miniForm">
          <el-form label-width="3em">
            <h2>{{ innerData.realName }}</h2>
            <el-form-item label="id">
              <div style="color:#cccccc">{{ innerData.id }}</div>
            </el-form-item>
            <el-form-item v-if="innerData.about" label="关于">
              <div style="color:#8f8f8f">{{ innerData.about }}</div>
            </el-form-item>
            <el-form-item label="单位">
              <div>{{ innerData.companyName }}</div>
            </el-form-item>
          </el-form>
        </el-main>
      </el-popover>
    </el-container>

    <div v-else style="color:#888888;font-size:1em">加载中...</div>
  </el-card>
</template>

<script>
import ContactMe from '@/components/ContactMe'
import { getUserAvatar, getUserSocial } from '@/api/user/userinfo'
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
      loading: false,
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
      if (!this.userid) return
      this.loading = true

      const a1 = getUserAvatar(this.userid).then(data => {
        this.avatar = data.url
        this.$emit('update:avatar', this.avatar)
        this.$nextTick(() => {
          this.$emit('avatar-load')
        })
      })
      const a2 = getUserSocial(this.userid).then(data => {
        this.phone = data.phone
      })
      Promise.all([a1, a2]).finally(() => {
        this.loading = false
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.miniForm {
  padding: 0;
  margin: 0;
  background: rgb(255, 255, 255);
  .el-form {
    padding-left: 0.5em;
    .el-form-item {
      margin-bottom: 0px;
    }
  }
}
.avatar {
  transition: all 0.5s ease;
  cursor: pointer;
  width: 4.5em;
  height: 4.5em;
  border-radius: 50%;
}
</style>
