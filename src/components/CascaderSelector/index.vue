<template>
  <el-cascader
    ref="elcascader"
    v-model="staticValue"
    :props="props"
    :show-all-levels="true"
    :placeholder="placeholder===null?'未选择':placeholder"
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
    event: 'change'
  },
  props: {
    data: {
      type: [Array, Object],
      default: null
    },
    disabled: {
      type: Boolean,
      default: false
    },
    placeholder: {
      type: String,
      default: ''
    },
    multiple: {
      type: Boolean,
      default: false
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
      staticValue: [],
      props: {
        getChild: id => {
          return this.childGetterMethod(id)
        },
        lazy: true,
        checkStrictly: true,
        multiple: this.multiple,
        expandTrigger: 'hover',
        lazyLoad(node, resolve) {
          if (node.root) node.value = 'root'
          this.getChild(node.value).then(data => {
            var list = data.list
            const nodes = Array.from(list).map(item => ({
              value: item.code + '',
              label: item.name,
              leaf: false
            }))
            resolve(nodes)
          })
        }
      }
    }
  },
  methods: {
    handleItemChange(val) {
      const nodes = this.$refs.elcascader.getCheckedNodes()
      const items = nodes.map(i => ({
        value: i.value,
        label: i.label
      }))
      const data = this.multiple ? items : items[0]
      this.$emit('change', data)
    }
  }
}
</script>

<style>
</style>
