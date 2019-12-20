<template>
  <el-cascader
    v-model="dataArrInner"
    :options="dataOptionsInner"
    :show-all-levels="true"
    @active-item-change="handleItemChange"
  />
</template>

<script>
import { deepClone } from '@/utils'
import { updateSelect } from '@/api/cascaderSelector'
export default {
  name: 'CascaderSelector',
  props: {
    disabled: {
      type: Boolean,
      default: true
    },
    label: {
      type: String,
      default: ''
    },
    dataArr: {
      type: Array,
      default() {
        return []
      }
    },
    dataOptions: {
      type: Array,
      default() {
        return []
      }
    },
    code: {
      type: String,
      default: '1'
    },
    childGetterMethod: {
      type: Function,
      default() {
        return () => {}
      }
    }
  },
  data() {
    return {
      dataArrInner: [],
      dataOptionsInner: [
        {
          label: '选择地域',
          value: 0,
          children: []
        },
        {
          label: '不选择',
          value: -1
        }
      ],
      codeInner: {
        value: ''
      }
    }
  },
  watch: {
    // code: {
    //   handler(val) {
    //     this.codeInner.value = val.toString()
    //   },
    //   deep: true,
    //   immediate: true
    // },
    // codeInner: {
    //   handler(val) {
    //     this.$emit('update:code', val.value)
    //   },
    //   deep: true,
    //   immediate: true
    // },
    // dataArr: {
    //   handler(val) {
    //     this.dataArrInner = val
    //   },
    //   deep: true,
    //   immediate: true
    // },
    // dataOptions: {
    //   handler(val) {
    //     // this.dataOptionsInner = val
    //   },
    //   deep: true,
    //   immediate: true
    // }
  },
  methods: {
    handleItemChange(val) {
      this.dataArrInner = val // 用于更新页面实体
      updateSelect(
        this.dataOptionsInner,
        this.dataArrInner,
        this.codeInner,
        this.childGetterMethod
      )
    }
  }
}
</script>

<style>
</style>
