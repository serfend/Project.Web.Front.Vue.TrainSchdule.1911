<template>
  <ShortUrlPopup :url-key="urlKey" />
</template>

<script>
import ShortUrlPopup from '@/views/common/ShortUrl/ShortUrlPopup'
export default {
  name: 'ClipboardMonitor',
  components: { ShortUrlPopup },
  data: () => ({
    clip_board_watching: null,
    urlKey: null,
    wait_to_show: false,
  }),
  computed: {
    short_url_loading() {
      return this.$store.state.app.shorturl.loading
    },
    focus: {
      get() {
        return this.$store.state.app.focus
      },
      set(val) {
        this.$store.state.app.focus = val
      },
    },
  },
  watch: {
    '$store.state.app.shorturl.content': {
      handler(val) {
        this.urlKey = val
      },
      immediate: true,
    },
  },
  mounted() {
    window.onfocus = (e) => {
      this.focus = true
      this.check_clipboard()
    }
    window.onblur = (e) => {
      this.focus = false
    }
  },
  methods: {
    check_clipboard() {
      navigator.clipboard.readText().then((c) => {
        this.$store.dispatch('app/checkClipboard', c)
      })
    },
  },
}
</script>
