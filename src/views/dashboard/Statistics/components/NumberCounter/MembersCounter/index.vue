<template>
  <!-- no模块制作 -->
  <div class="no">
    <div class="no-hd">
      <ul>
        <li v-for="(i,index) in formatedList" :key="index" :style="{color:i.color}" class="counter">
          <CountTo :start-val="i.prev" :end-val="i.value" />
        </li>
      </ul>
    </div>
    <div class="no-bd">
      <ul>
        <li v-for="(i,index) in formatedList" :key="index">{{ i.title }}</li>
      </ul>
    </div>
  </div>
</template>

<script>
import CountTo from 'vue-count-to'
export default {
  name: 'MembersCounter',
  components: { CountTo },
  props: {
    data: {
      type: Array,
      default: () => []
    },
    autoplay: {
      type: Boolean,
      default: true
    }
  },
  data: () => ({
    color: ['#ff0', '#f0f', '#0ff', '#0f0', '#f00'],
    list: [],
    refresher: null
  }),
  computed: {
    formatedList() {
      return this.list.filter(i => i && i.title)
    }
  },
  watch: {
    data: {
      handler(val) {
        if (val) {
          this.list = val
        }
      },
      immediate: true
    }
  },
  mounted() {
    this.refresh()
  },
  methods: {
    refresh() {
      if (this.refresher) clearTimeout(this.refresher)
      this.refresher = setTimeout(this.refresh, 15000)
    },
    updateItem(title, value, color) {
      var r = this.findItem(title)
      if (!r) {
        r = {
          i: -1,
          item: {}
        }
      }
      r.item.prev = r.item.value ? r.item.value : 0
      r.item.value = value
      if (color) {
        r.item.color = color
      } else if (!r.item.color) {
        var cIndex = (r.i ? r.i : this.list.length + 1) % this.color.length
        r.item.color = color = this.color[cIndex]
      }

      if (r.i === -1) this.list.push(r.item)
    },
    removeItem(title) {
      var r = this.findItem(title)
      if (!r) return
      this.list.splice(r.i, 1)
    },
    findItem(title, list) {
      if (!list) list = this.list
      for (var i = 0; i < list.length; i++) {
        if (list[i].title === title) return { i, item: list[i] }
      }
      return null
    }
  }
}
</script>

<style lang="scss" scoped>
.filter-select {
  position: absolute;
  opacity: 0.5;
  z-index: 1;
}
.counter {
  transition: all 0.5s;
  &:hover {
    background-color: #ffffff3f;
  }
}
</style>
