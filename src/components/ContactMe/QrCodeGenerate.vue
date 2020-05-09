<template>
  <div
    v-loading="onLoading"
    :style="{width:size + 'px',height:size + 'px','line-height':size+'px','text-align':'center',display:'flex',margin:'0 auto'}"
  >
    <el-image v-if="qrCodeUrl" class="full" :src="qrCodeUrl" />
    <div v-else class="full">加载中</div>
  </div>
</template>

<script>
import { qrCodeEncode } from '@/api/qrCode'

export default {
  name: 'QrCodeGenerate',
  props: {
    url: {
      type: String,
      default: null
    },
    size: {
      type: Number,
      default: 200
    }
  },
  data() {
    return { qrCodeUrl: null, onLoading: false }
  },
  watch: {
    url: {
      handler(val) {
        if (val) {
          this.innerUrl = val
          this.refresh()
        }
      },
      immediate: true
    }
  },
  mounted() {
    if (!this.$route) return
    var temp = this.$route.query.url
    if (temp && !this.innerUrl) {
      this.innerUrl = temp
      this.refresh()
    }
  },
  methods: {
    refresh() {
      if (this.onLoading) return
      this.onLoading = true
      qrCodeEncode(this.innerUrl)
        .then(data => {
          this.qrCodeUrl = `data:image/jpg;base64,${data.img}`
        })
        .finally(() => {
          this.onLoading = false
        })
    }
  }
}
</script>

<style scoped>
.full {
  width: 100%;
  height: 100%;
  margin: 0;
  padding: 0;
}
</style>
