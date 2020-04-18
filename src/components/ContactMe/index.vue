<template>
  <div>
    <div v-if="innerUrl">
      <el-row>
        <QrCodeGenerate :url="innerUrl" />
      </el-row>
      <el-row style="font-size:12px;margin:10px 20px">使用微信扫一扫联系我们吧~</el-row>
    </div>
    <div v-else style="width:200px;height:200px;text-align:center;line-height:200px">加载中</div>
  </div>
</template>

<script>
import { download } from '@/api/file'
import QrCodeGenerate from './QrCodeGenerate'
export default {
  name: 'ContactMe',
  components: { QrCodeGenerate },
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
          this.refresh(val)
        }
      },
      immediate: true
    }
  },
  mounted() {
    var temp = this.$route.query.url
    if (temp && !this.innerUrl) {
      this.refresh(temp)
    }
  },
  methods: {
    refresh(url) {
      var self = this
      download(url).then(data => {
        var reader = new FileReader()
        reader.onload = function(event) {
          var content = reader.result // 内容就在这里
          self.innerUrl = content
        }
        reader.readAsText(data)
      })
    }
  }
}
</script>

<style>
</style>
