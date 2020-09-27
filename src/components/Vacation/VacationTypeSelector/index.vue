<template>
  <div v-loading="loading">
    <el-link v-show="hide&&urlDict" type="primary" @click="hide = false">{{ iType }}</el-link>
    <ul
      v-if="!loading"
      class="card-list"
      :style="{top:hide?'-17rem':0,transform: hide?'scale(0)':null,opacity:hide?0:1,position:hide?'absolute':null}"
    >
      <li
        v-for="(v,i) in list"
        :key="i"
        class="card-item"
        :style="getStyle(v)"
        @click="selectType(v)"
      >
        <div class="item-content">
          <span class="item-title text-gradient">{{ v.alias }}</span>
          <div class="outer-description">
            <VacationTypeDetail
              v-model="list[i]"
              :show-tag="false"
              :left-length="leftLength"
              class="inner-description"
            />
          </div>
        </div>
      </li>
    </ul>
  </div>
</template>

<script>
const bgPath = 'dataview/vacationtype'
const staticfile = '/file/staticfile/'
import VacationTypeDetail from '../VacationType/VacationTypeDetail'
import { requestFile } from '@/api/common/file'
import { debounce } from '../../../utils'
export default {
  name: 'VacationTypeSelector',
  components: { VacationTypeDetail },
  model: {
    prop: 'vacationType',
    event: 'change'
  },
  props: {
    vacationType: {
      type: String,
      default: null
    },
    types: {
      type: Array,
      default: null
    },
    leftLength: {
      type: Number,
      default: 0
    }
  },
  data: () => ({
    loading: false,
    iType: null,
    defaultUrl: null,
    urlDict: {},
    hide: false
  }),
  computed: {
    requireHide() {
      return debounce(() => {
        this.hideDirect()
      }, 1000)
    },
    list() {
      return this.types
        .filter(i => !i.disabled)
        .map(i => {
          i.backgroundUrl = this.getBackground(i)
          i.invalid = this.checkDisabled(i)
          return i
        })
    }
  },
  watch: {
    vacationType: {
      handler(val) {
        this.iType = val
      },
      immediate: true
    },
    types: {
      handler(val) {
        this.$nextTick(() => {
          this.loadBgUrl()
        })
      },
      immediate: true
    }
  },
  mounted() {
    requestFile(bgPath, 'default.jpg').then(data => {
      this.defaultUrl = `${process.env.VUE_APP_BASEURL}${staticfile}${data.file.id}`
    })
  },
  methods: {
    getStyle(v) {
      const iType = this.iType
      return {
        background: v.backgroundUrl,
        transition: 'all 0.5s ease',
        'box-shadow':
          v.name === iType ? '0 0 0.5rem 0.5rem rgba(0, 139, 255, 0.5)' : '',
        cursor: v.invalid ? 'no-drop' : 'pointer',
        filter: v.invalid ? 'grayscale(1)' : null,
        opacity: v.invalid ? 0.2 : 1
      }
    },
    getBackground(v) {
      const bg = this.urlDict[v.name] || this.defaultUrl
      if (bg) {
        return `url(${bg}) center center/cover no-repeat`
      }
      return 'gray'
    },
    loadBgUrl() {
      this.loading = true
      const types = this.types
      const cb = (data, type) => {
        const id = data.file.id
        const url = `${process.env.VUE_APP_BASEURL}${staticfile}${id}`
        this.urlDict[type.name] = id ? url : null
      }
      const null_data = {
        file: {
          id: null
        }
      }
      const loader = []
      for (let i = 0; i < types.length; i++) {
        const type = types[i]
        if (type.background && !this.urlDict[type.name]) {
          loader.push(
            new Promise(res => {
              requestFile(bgPath, type.background)
                .then(d => res(d))
                .catch(e => res(null_data))
            })
          )
        }
      }
      Promise.all(loader).then(result => {
        for (let i = 0; i < result.length; i++) {
          cb(result[i], types[i])
        }
        this.loading = false
      })
    },
    checkDisabled(v) {
      const leftLength = this.leftLength
      if (v.primary && leftLength === 0) return '已无假可休'
      if (!v.allowBeforePrimary && !v.primary && leftLength > 0) {
        return '正休假未休完'
      }
      return false
    },
    selectType(v) {
      if (v.invalid) {
        this.$notify.error({
          title: '无法休此类型假期',
          message: v.invalid
        })
        return
      }
      this.iType = v.name
      this.$emit('change', this.iType)
      this.requireHide()
    },
    hideDirect() {
      this.hide = true
    }
  }
}
</script>
<style lang="scss" scoped>
.card-list {
  transition: all 0.5s cubic-bezier(0.19, 1, 0.22, 1);
  text-align: center;
  font-size: 1.5rem;
  justify-content: space-between;
  li {
    list-style: none;
  }
}
.card-item {
  height: 18rem;
  width: 12rem;
  float: left;
  margin: 0.5rem 0.5rem;
  overflow: hidden;
  .item-content {
    transition: all 0.8s cubic-bezier(0.19, 1, 0.22, 1);
    height: 100%;
    background-color: rgba(0, 139, 204, 0.8);
    margin-top: 15.5rem;
    &:hover {
      margin-top: 0;
      background-color: rgba(0, 139, 255, 0.9);
    }
  }
  .outer-description {
    font-size: 0.9rem;
    line-height: 1.2rem;
    color: #fff;
    text-align: left;
  }
  .item-title {
    overflow-wrap: normal;
    margin-bottom: 0.3rem;
  }
  .inner-description {
    padding: 0 0.5rem;
    ul {
      list-style: none;
    }
  }
}
.text-gradient {
  display: inline-block;
  color: #fff;
}
</style>
