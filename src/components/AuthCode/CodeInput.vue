<template>
  <div
    v-loading="loading"
    class="input"
    @mousedown="userClick(true)"
    @mouseup="userClick(false)"
    @mouseenter="focusOn(true)"
    @mouseleave="focusOn(false)"
  >
    <div :style="{filter:hideDetail?'blur(1px)':''}">
      <div
        v-for="i in 6"
        :key="i"
        class="single"
        :style="{width:size,height:size, 'box-shadow': singleActiveShadow}"
      >
        <div
          class="pswChr"
          :style="{'background-color':pswChrBackColor(i),width:pswChrSize(i),height:pswChrSize(i),top:pswChrPos(i),left:pswChrPos(i)}"
        />
      </div>
    </div>
    <div
      class="mask"
      :style="{filter:hideDetail?'':'blur(30px)',color:`rgb(${rgb})`}"
    >{{ showText }}</div>
  </div>
</template>
<script>
export default {
  name: 'CodeInput',
  props: {
    size: {
      type: String,
      default: '3em'
    },
    checkCodeMethod: {
      type: Function,
      required: true
    },
    listenUserInput: {
      type: Boolean,
      default: false
    }
  },
  data: () => ({
    rgb: '0,0,0',
    showText: '',
    normalSize: 80,
    lastUpdate: new Date(),
    loading: false,
    userClickActive: false,
    userClickActiveDate: new Date(),
    innerCode: '',
    isActive: false,
    status: 0, // 0:input 1:success -1:fail
    singleActiveShadow: '',
    pswChrActiveBackColor: ''
  }),
  computed: {
    hideDetail() {
      return !this.isActive
    }
  },
  watch: {
    isActive: {
      handler(val) {
        this.$nextTick(() => {
          this.update()
        })
      },
      immediate: true
    },
    status: {
      handler(val) {
        this.$nextTick(() => {
          this.update()
        })
      },
      immediate: true
    },
    userClickActive: {
      handler(val) {
        this.$nextTick(() => {
          this.update()
        })
      },
      immediate: true
    }
  },
  mounted() {
    var self = this
    this.update()
    document.onkeydown = function(e) {
      var key = window.event.keyCode
      var newCode = self.innerCode
      if (key === 8 && self.innerCode.length > 0) {
        newCode = self.innerCode.substr(0, self.innerCode.length - 1)
      } else if (key >= 48 && key <= 57 && self.innerCode.length < 6) {
        var newKey = key - 48
        newCode = newCode + newKey
      } else {
        return
      }
      self.$nextTick(() => {
        self.userInput(newCode)
      })
    }
  },
  methods: {
    update() {
      var rate = 0.18
      switch (this.status) {
        case -1:
          this.rgb = '255,15,100'
          break
        case 0:
          this.rgb = '0,100,255'
          break
        case 1:
          this.rgb = '0,255,100'
          break
      }
      if (this.isActive) {
        this.pswChrActiveBackColor = '#999'
        rate = this.userClickActive ? 1 : 0.5
      } else {
        this.pswChrActiveBackColor = '#ccc'
      }
      this.singleActiveShadow = `0 1px 7px rgba(${this.rgb}, ${rate})`
    },
    userClick(isDown) {
      this.$emit('update:listenUserInput', true)
      if (!isDown) {
        var userClickActiveDate = new Date()
        this.userClickActiveDate = userClickActiveDate
        setTimeout(() => {
          if (userClickActiveDate === this.userClickActiveDate) {
            this.userClickActive = isDown
          }
        }, 300)
      } else {
        this.userClickActive = isDown
      }
    },
    focusOn(isFocus) {
      this.isActive = isFocus
    },
    reset() {
      this.showText = ''
      this.status = 0
      if (!this.innerCode) this.innerCode = ''
    },
    submit(newCode) {
      this.loading = true
      if (+new Date() - new Date(this.lastUpdate) < 3 * 1000) {
        setTimeout(() => {
          this.loading = false
          this.userInput(newCode)
        }, 3000)
        return
      }
      this.lastUpdate = new Date()
      setTimeout(() => {
        this.checkCodeMethod(newCode)
          .then(() => {
            this.status = 1
            this.showText = ''
          })
          .catch(err => {
            this.status = -1
            this.innerCode = ''
            this.showText = err.message
          })
          .finally(() => {
            this.loading = false
          })
      }, 500)
    },
    userInput(newCode) {
      if (this.loading || !this.listenUserInput) return
      this.$nextTick(() => {
        this.innerCode = newCode
        this.reset()
      })
      this.$emit('update:code', newCode)
      if (newCode.length === 6) {
        this.submit(newCode)
      }
    },
    pswChrBackColor(i) {
      return this.innerCode.length < i ? '#fff0' : this.pswChrActiveBackColor
    },
    pswChrSize(i) {
      return this.innerCode.length < i ? 0 : `${this.normalSize}%`
    },
    pswChrPos(i) {
      return this.innerCode.length < i
        ? '50%'
        : `${(100 - this.normalSize) / 2}%`
    }
  }
}
</script>

<style lang="scss" scoped>
.input {
  display: inline-block;
  position: relative;
  margin: 0 0 0 10px;
  .single {
    transition: all 0.5s ease;
    border: 1px solid #cccccc3f;
    text-align: center;
    float: left;
    &:first-child {
      border-radius: 25% 0 0 25%;
    }
    &:last-child {
      border-radius: 0 25% 25% 0;
    }
    .pswChr {
      transition: all 0.5s;
      position: relative;
      border-radius: 100%;
    }
  }
}
.mask {
  text-align: center;
  position: absolute;
  font-size: 2em;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  transition: all 0.5s;
  pointer-events: none;
  z-index: 1;
}
</style>
