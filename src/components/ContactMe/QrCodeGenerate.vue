<template>
  <div>
    <el-image v-show="qrCodeUrl" :style="{width:size + 'px'}" :src="qrCodeUrl" />
    <div
      v-show="!qrCodeUrl"
      :style="{width:size + 'px',height:size + 'px','line-height':size+'px','text-align':'center'}"
    >加载中</div>
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
    return { qrCodeUrl: null }
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
    var temp = this.$route.query.url
    if (temp && !this.innerUrl) {
      this.innerUrl = temp
      this.refresh()
    }
  },
  methods: {
    refresh() {
      qrCodeEncode(this.innerUrl).then(data => {
        this.qrCodeUrl = 'data:image/jpg;base64,' + data.img
      })
    }
  }
}
</script>

<style>
</style>

