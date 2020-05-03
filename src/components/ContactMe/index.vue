<template>
  <div>
    <div v-if="innerUrl">
      <el-row>
        <QrCodeGenerate :url="innerUrl" />
      </el-row>
      <el-row style="font-size:12px;text-align:center">{{ description }}</el-row>
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
    },
    content: {
      type: String,
      default: null
    },
    description: {
      type: String,
      default: '使用微信扫一扫联系我们吧~'
    }
  },
  data() {
    return {
      qrCodeUrl: null,
      innerUrl: null
    }
  },
  watch: {
    content: {
      handler(val) {
        if (val) {
          this.innerUrl = val
        }
      },
      immediate: true
    },
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
    if (!this.$route) return
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
          var content = reader.result
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
