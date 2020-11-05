<template>
  <el-cascader
    ref="elcascader"
    v-model="staticValue"
    :props="props"
    :show-all-levels="true"
    :placeholder="data&&(multiple?data.map(i=>i[labelName]).join(' '):data[labelName])||placeholder||'未选中任何节点'"
    :style="{width:'100%',color:data&&data.length>0?'#00f':'#ccc'}"
    clearable
    :disabled="disabled"
    @change="handleItemChange"
  />
</template>

<script>
export default {
  name: 'CascaderSelector',
  model: {
    prop: 'data',
    event: 'change',
  },
  props: {
    data: {
      type: [Array, Object],
      default: null,
    },
    disabled: {
      type: Boolean,
      default: false,
    },
    placeholder: {
      type: String,
      default: null,
    },
    valueName: {
      type: String,
      default: 'value',
    },
    labelName: {
      type: String,
      default: 'label',
    },
    multiple: {
      type: Boolean,
      default: false,
    },
    childGetterMethod: {
      type: Function,
      default() {
        return () => {}
      },
    },
  },
  data() {
    return {
      staticValue: [],
      props: {
        getChild: (id) => {
          return this.childGetterMethod(id)
        },
        lazy: true,
        checkStrictly: true,
        multiple: this.multiple,
        // expandTrigger: 'hover', 如果自动展开可能会导致偏移和无法选中的情况
        lazyLoad(node, callback) {
          if (node.root) node.value = 'root'
          this.getChild(node.value).then((data) => {
            var list = data.list
            const nodes = Array.from(list).map((item) => ({
              value: item.code + '',
              label: item.name,
              leaf: false,
            }))
            callback(nodes)
          })
        },
      },
    }
  },
  methods: {
    handleItemChange(val) {
      this.$nextTick(() => {
        const nodes = this.$refs.elcascader.getCheckedNodes()
        const items = nodes.map((i) => {
          const item = {}
          item[this.valueName] = i.value
          item[this.labelName] = i.label
          return item
        })
        const data = this.multiple ? items : items[0]
        this.$emit('change', data)
      })
    },
  },
}
</script>

<style>
</style>
