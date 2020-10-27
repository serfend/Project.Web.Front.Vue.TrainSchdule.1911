<template>
  <el-card>
    <div v-if="!fail_load" v-loading="loading" class="center-text">
      <div v-show="!loading">
        <SvgIcon
          icon-class="Message_success"
          style-normal="width:3rem;height:3rem;margin:auto;color:#67c23a"
          class-name="item-put-center"
        />
        <h2 style="margin-top:1rem">分享成功</h2>
        <el-input :value="urlKey" style="width:20rem;margin-top:1rem">
          <template slot="prepend">查询码</template>
          <el-button
            slot="append"
            icon="el-icon-document-copy"
            :disabled="been_copy"
            @click="clipBoard(urlKey,$event)"
          >点击复制</el-button>
        </el-input>
      </div>
      <div>
        <span>使用</span>
        <el-button type="text" @click="show_scanner">扫码枪</el-button>
        <span>扫码或在</span>
        <el-button type="text" @click="clipBoard(urlKey,$event)">复制分享码</el-button>
      </div>
    </div>
    <el-button v-else type="text" @click="requireUpdate">加载失败，请重试</el-button>
    <el-card>
      <ShortUrl :show-label="false" :url-key.sync="urlKey" class="item-put-center" />
    </el-card>
  </el-card>
</template>

<script>
import { createDwz } from '@/api/common/dwz'
import clipboard from '@/utils/clipboard'

import ShortUrl from '@/views/common/ShortUrl/ShortUrl'
import SvgIcon from '@/components/SvgIcon'
export default {
  name: 'DetailShare',
  components: { ShortUrl, SvgIcon },
  props: {
    id: {
      type: String,
      default: null,
    },
  },
  data: () => ({
    loading: true,
    urlKey: null,
    fail_load: false,
    been_copy: false,
  }),
  computed: {
    url() {
      const current_origin = document.location.origin
      return `${current_origin}/#/vacation/applyDetail?id=${this.id}`
    },
    short_url() {
      return `${process.env.VUE_APP_BASE_API}/s/${this.urlKey}`
    },
  },
  watch: {
    id: {
      handler(val) {
        this.$nextTick(() => {
          this.requireUpdate()
        })
      },
      immediate: true,
    },
  },
  activated() {
    this.loading = true
    this.fail_load = false
  },
  methods: {
    show_scanner() {
      // TODO 扫码枪设备接入
      this.$notify.error('没有发现扫码枪设备')
    },
    requireUpdate() {
      this.loading = true
      const expire = new Date(new Date() - 0 + 86400 * 7 * 1000)
      createDwz(this.url, null, expire)
        .then((data) => {
          this.urlKey = data.key
        })
        .catch((e) => {
          this.fail_load = true
        })
        .finally(() => {
          this.loading = false
        })
    },
    clipBoard(content, event) {
      this.been_copy = true
      setTimeout(() => {
        this.been_copy = false
      }, 1000)
      const final_content = `我把我的休假申请发给你啦~复制本段￥${content}￥打开系统查看。或点击链接${this.short_url} 到浏览器。`
      clipboard(final_content, event).then(() => {
        this.$message.success(`分享码已复制，快发给小伙伴吧~`)
      })
    },
  },
}
</script>

<style lang="scss" scoped>
.center-text {
  text-align: center;
}
.item-put-center {
  display: flex;
  justify-content: center;
}
</style>
