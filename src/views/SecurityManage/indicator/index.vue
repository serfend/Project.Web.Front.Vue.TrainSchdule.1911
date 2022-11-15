<template>
  <div class="indicator-container">
    <transition-group
      name="slide-fade"
      tag="ul"
      class="slide-container"
      @enter="enter"
      @before-enter="beforeEnter"
      @leave="leave"
      @before-leave="beforeLeave"
    >
      <div
        v-for="(item, index) in filtered_list"
        :key="item.name"
        :index="item.index"
        :sindex="index"
        class="single-indicator"
      >
        <Flip v-model="item.flip_front">
          <template #front>
            <SingleIndicator
              :data="item"
              :focus="item.active"
              @click.native="setActive(item)"
            />
          </template>
          <template #back>
            <SingleIndicator
              :data="item"
              :focus="item.active"
              @click.native="setActive(item)"
            />
          </template>
        </Flip>
      </div>
    </transition-group>
    <el-row style="text-align:center">
      <Pagination
        class="styled-primary-pagination"
        :pagesetting.sync="pages"
        :total-count="indicators.length"
        layout="total,prev,pager,next,jumper"
        small
        background
        hide-on-single-page
      />
    </el-row>
  </div>
</template>
<script>
import Velocity from 'velocity-animate'
import api_indicator from '@/api/securityManage/indicator'
export default {
  name: 'IndicatorContainer',
  components: {
    SingleIndicator: () => import('./SingleIndicator'),
    Pagination: () => import('@/components/Pagination'),
    Flip: () => import('vue-flip')
  },
  props: {
    countPerGroup: { type: Number, default: 8 }
  },
  data: () => ({
    indicators: [],
    current_group: 0,
    group_player: null,
    last_active: null,
    last_active_index: null
  }),
  computed: {
    pages: {
      get() {
        return {
          pageIndex: this.current_group,
          pageSize: this.countPerGroup
        }
      },
      set(v) {
        this.current_group = v.pageIndex
      }
    },
    filtered_list() {
      const { indicators, current_group, countPerGroup } = this
      const start = current_group * countPerGroup
      const end = start + countPerGroup
      return indicators.slice(start, end)
    }
  },
  mounted() {
    this.refresh()
    this.group_player = setInterval(() => {
      if (this.last_active && new Date() - this.last_active < 20e3) return
      const max_page = Math.ceil(this.indicators.length / this.countPerGroup)
      const current_page = this.current_group + 1
      if (current_page >= max_page) {
        this.current_group = 0
        return
      }
      this.current_group += 1
    }, 8e3)
  },
  destroyed() {
    clearInterval(this.group_player)
  },
  methods: {
    getDelay(el) {
      const index = Number(el.getAttribute('index'))
      const sindex = Number(el.getAttribute('sindex'))
      const delay = sindex * 100
      return { index, sindex, delay }
    },
    beforeEnter(el) {
      const { index, delay } = this.getDelay(el)
      setTimeout(() => {
        this.indicators[index].flip_front = true
      }, delay + 50)
      el.style.opacity = 0
      el.style.display = 'block'
    },
    enter(el, done) {
      const { index, delay } = this.getDelay(el)
      setTimeout(() => {
        this.indicators[index].flip_front = false
        Velocity(el, { opacity: 1 }, { complete: done })
      }, delay + 50)
    },
    beforeLeave(el) {
      const { offsetLeft, offsetTop } = el
      const { delay } = this.getDelay(el)
      this.$nextTick(() => {
        el.style.left = `${offsetLeft}px`
        el.style.top = `${offsetTop}px`
        el.style.position = 'absolute'
        el.style.transform = 'translate(10px, 10px)'
      })
      setTimeout(() => {
        el.style.transform = 'translate(-50%, 10px)'
      }, delay)
    },
    leave(el, done) {
      const { index, delay } = this.getDelay(el)
      this.indicators[index].flip_front = true
      setTimeout(() => {
        Velocity(el, { opacity: 0 }, { complete: done })
      }, delay)
    },
    next_group() {},
    setActive(i) {
      const { index } = i
      this.last_active = new Date()
      if (this.last_active_index !== null) {
        this.indicators[this.last_active_index].active = false
      }
      if (this.last_active_index === index) {
        this.last_active_index = null
        return
      }
      this.last_active_index = index
      i.active = true
    },
    refresh() {
      api_indicator
        .get_indicators({ type: null, date: new Date() })
        .then(data => {
          this.indicators = data.list.map((i, index) => {
            i.flip_front = true
            i.index = index
            i.active = false
            return i
          })
        })
    }
  }
}
</script>
<style lang="scss" scoped>
@mixin common() {
  height: 100%;
  width: 100%;
}
.slide-container {
  display: grid;
  grid-template-columns: 50% 50%;
  width: 100%;
  height: 44rem;
}
.single-indicator {
  @include common();
  transition-duration: 0.5s;
  transition-timing-function: ease;
  transition-property: transform;
}
.indicator-container {
  @include common();
}
@import "../style";
</style>
