<template>
  <ul class="card-list">
    <li
      v-for="(v,i) in list"
      :key="i"
      class="card-item"
      :style="{background:getBackground(v),transition:'all 0.5s ease','box-shadow': v.name==iType?'0 0 0.5rem 0.5rem rgba(0, 139, 255, 0.5)':''}"
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
</template>

<script>
const bgPath = 'dataview/vacationtype'
const staticfile = '/file/staticfile/'
import VacationTypeDetail from '../VacationType/VacationTypeDetail'
import { requestFile } from '@/api/common/file'
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
    iType: null,
    defaultUrl: null,
    urlDict: {}
  }),
  computed: {
    list() {
      return this.types.filter(i => !i.disabled)
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
    getBackground(v) {
      const bg = this.urlDict[v.name] || this.defaultUrl
      if (bg) {
        return `url(${bg}) center center/cover no-repeat`
      }
      return 'gray'
    },
    loadBgUrl() {
      const types = this.types
      for (let i = 0; i < types.length; i++) {
        const type = types[i]
        if (type.background && !this.urlDict[type.name]) {
          requestFile(bgPath, type.background).then(data => {
            const url = `${process.env.VUE_APP_BASEURL}${staticfile}${data.file.id}`
            this.urlDict[type.name] = url
          })
        }
      }
    },
    checkDisabled(v) {
      const leftLength = this.leftLength
      return (
        (!v.allowBeforePrimary && !v.primary && leftLength > 0) ||
        (v.primary && leftLength === 0)
      )
    },
    selectType(v) {
      this.iType = v.name
      this.$emit('change', this.iType)
    }
  }
}
</script>
<style lang="scss" scoped>
.card-list {
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
  cursor: pointer;
  float: left;
  margin: 0.5rem 0.5rem;
  overflow: hidden;
  .item-content {
    height: 100%;
    background-color: rgba(0, 139, 204, 0.8);
    margin-top: 15.5rem;
    transition: all 0.5s cubic-bezier(0.19, 1, 0.22, 1);
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
