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
        <Flip v-model="item.flip_front" width="100%" height="100%">
          <template #front>
            <SingleIndicator
              :data="item"
              :focus.sync="item.active"
              @click.native="setActive(item)"
            />
          </template>
          <template #back>
            <h2>{{ item.name }}</h2>
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
        @next-click="newFocus"
        @prev-click="newFocus"
      />
    </el-row>
  </div>
</template>
<script>
import { to_dict } from '@/utils/data-handle'
import Velocity from 'velocity-animate'
import api_indicator from '@/api/securityManage/indicator'
import { distinct } from '@/utils'
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
    indicator_catalogue: [],
    indicators: [],
    indicator_anicache: {},
    current_group: -1,
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
      const { indicators } = this
      const { pageIndex, pageSize } = this.pages
      const start = pageIndex * pageSize
      const end = start + pageSize
      return indicators.slice(start, end)
    },
    total_count() {
      return this.indicator_catalogue.length
    }
  },
  mounted() {
    this.run_group_refresh()
  },
  destroyed() {
    clearInterval(this.group_player)
  },
  methods: {
    getDelay(el) {
      const item = Number(el.getAttribute('item'))
      const sindex = Number(el.getAttribute('sindex'))
      const delay = sindex * 100
      return { item, sindex, delay }
    },
    register_animation (index, front, delay, delete_after_move) {
      if (!this.indicator_anicache[index]) this.indicator_anicache[index] = this.indicators[index]

      setTimeout(() => {
        const item = this.indicator_anicache[index]
        if (item)item.flip_front = front
        if (delete_after_move) delete this.indicator_anicache[index]
      }, delay)
    },
    beforeEnter(el) {
      const { index, delay } = this.getDelay(el)
      this.register_animation(index, true, delay + 50)
      el.style.opacity = 0
      el.style.display = 'block'
    },
    enter(el, done) {
      const { index, delay } = this.getDelay(el)
      this.register_animation(index, false, delay + 50)
      setTimeout(() => {
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
      this.register_animation(index, true, 0)
      setTimeout(() => {
        Velocity(el, { opacity: 0 }, { complete: done })
      }, delay)
    },
    next_group() {
      const max_page = Math.ceil(this.total_count / this.countPerGroup)
      const current_page = this.current_group + 1
      if (current_page >= max_page) {
        this.current_group = 0
        return
      }
      this.current_group += 1
    },
    newFocus () {
      this.last_active = new Date()
    },
    setActive(i) {
      const { index } = i
      this.newFocus()
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
    run_group_refresh () {
      const next_round = () => {
        this.group_player = setTimeout(this.run_group_refresh, 8e3)
      }
      clearTimeout(this.group_player)
      if (this.last_active_index !== null) {
        // 检查是否对象已释放
        const i = this.indicators[this.last_active_index]
        if (i && i.active) return
        this.last_active_index = null
      }
      if (this.last_active && new Date() - this.last_active < 8e3) return next_round()
      this.refresh()
        .then(() => {})
        .finally(() => {
          next_round()
        })
    },
    refresh() {
      return new Promise(res => {
        const load_data = () => {
          this.refresh_indicators_data().finally(() => {
            res()
          })
        }
        const handle_catalogue = data => {
          const response_list = data.list
            .slice(1)
          const dict_next = to_dict(response_list) // 第一个必然是通用指标，需跳过
          const catalogue = this.indicator_catalogue
          const dict_prev = to_dict(catalogue)
          const to_remove = []
          catalogue.map((i, index) => {
            if (!dict_next[i]) to_remove.push(index)
          })
          to_remove.reverse().map(i => {
            catalogue.splice(i, 1)
          })
          response_list.map((i, index) => {
            if (!dict_prev[i]) catalogue.push(i)
          })
        }
        api_indicator.all_indicators().then(data => {
          handle_catalogue(data)
        }).finally(() => {
          load_data()
        })
      })
    },
    update_single(index, indicators) {
      return new Promise((res, rej) => {
        const target_item = indicators[index]
        if (!target_item || !target_item.name) {
          return rej()
        }
        api_indicator
          .get_indicator({
            name: target_item.name
          })
          .then(data => {
            const item = data.list[0] || {}
            const currentConfig = item.currentConfig || {}
            const currentData = item.currentData || {}
            const mapped_item = {
              name: target_item.name, // 应使用发出时的名称
              alias: currentConfig.alias || '未命名',
              description: currentConfig.description,
              value: currentData.currentValue,
              message: currentData.message,
              range: [currentConfig.min, currentConfig.max],
              ranges: currentConfig.range,
              exceedingUsers: currentData.exceedingUsers,
              valid: !!(currentData.name)
            }
            Object.assign(indicators[index], mapped_item)
            res(indicators[index])
          })
          .catch(e => rej())
      })
    },
    refresh_indicators_data() {
      return new Promise(res => {
        const { indicators, indicator_catalogue, countPerGroup } = this
        const new_indicators = indicators.filter(i => !i.is_removed) // deepClone(indicators)
        const dict = to_dict(indicator_catalogue)

        this.$nextTick(async () => {
          this.next_group()
          const { pageIndex, pageSize } = this.pages
          // 检查当前页是否有删除的
          let need_check = countPerGroup
          let current_pos = pageIndex * pageSize
          if (current_pos > new_indicators.length)current_pos = 0
          let need_update = []
          const check_single = async () => {
            // 记录开始位置，开始i检查需要移除的项目
            let need_run = true
            while (need_run) {
              if (current_pos >= new_indicators.length) {
                break
              }
              const item = new_indicators[current_pos]
              if (item && dict[item.name]) need_run = false
              else {
                new_indicators[current_pos].is_removed = true
                current_pos++
              }
            }
          }
          while (need_check-- > 0 && current_pos < new_indicators.length) {
            await check_single()
            if (current_pos < new_indicators.length)need_update.push(current_pos) // 添加有效项目
            current_pos++
          }
          // 将新增的放到后续去
          new_indicators.map(i => {
            if (!i || !i.name) return
            delete dict[i.name]
          })
          Object.keys(dict).map(i => {
            new_indicators.push({
              name: i,
              index: new_indicators.length,
              flip_front: false,
              active: false
            })
            need_update.push(new_indicators.length - 1)
          })
          // 所有新增的都是可以直接上屏的
          while (need_check-- >= 0 && current_pos < new_indicators.length) {
            need_update.push(current_pos)
            current_pos++
          }
          need_update = distinct(need_update)
          Promise.all(
            need_update.map(i => {
              new_indicators[i].index = i
              return this.update_single(i, new_indicators)
            })
          ).finally(() => {
            this.indicators = new_indicators.filter(i => !i.is_removed)
            res()
          })
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
