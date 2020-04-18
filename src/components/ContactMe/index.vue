<template>
  <div>
    <div v-if="innerUrl">
      <el-row>
        <el-image v-show="qrCodeUrl" :src="qrCodeUrl" />
        <div v-show="!qrCodeUrl" style="width:200px;height:200px">加载中</div>
      </el-row>
      <el-row style="font-size:10px">使用微信扫一扫联系我们吧~</el-row>
    </div>
    <div v-else>加载中</div>
  </div>
</template>

<script>
import { qrCodeEncode } from '@/api/qrCode'
export default {
  name: 'ContactMe',
  props: {
    url: {
      type: String,
      default: null
    }
  },
  data() {
    return {
      qrCodeUrl: null,
      innerUrl: null
    }
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
    if (temp) {
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
