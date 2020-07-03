<template>
  <el-cascader
    ref="elcascader"
    v-model="staticValue"
    :props="props"
    :show-all-levels="true"
    :placeholder="placeholder===null?'未选择':placeholder"
    :style="{width:'100%',color:code?'#00f':'#ccc'}"
    clearable
    :disabled="disabled"
    @change="handleItemChange"
  />
</template>

<script>
export default {
  name: 'CascaderSelector',
  props: {
    disabled: {
      type: Boolean,
      default: false
    },
    placeholder: {
      type: String,
      default: ''
    },
    code: {
      type: [String, Array],
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
  watch: {
    code: {
      handler(v) {
        if (this.staticValue !== v) {
          this.staticValue = v
        }
      },
      immediate: true
    }
  },
  methods: {
    handleCodeChange(val) {
      if (this.multiple) {
        this.$emit('update:code', val)
      } else {
        const v = val[val.length - 1]
        this.$emit('update:code', v)
      }
    },
    handleItemChange(val) {
      this.handleCodeChange(val)
      if (!this.multiple) {
        // event of selectChange should delay for a perior due to a bug of metaphysics
        // only while use none multiple,can emit name
        setTimeout(() => {
          let text = this.$refs.elcascader.inputValue
          let lastIndex = -1
          if (text) {
            text = text.replace('*', '')
            lastIndex = text.lastIndexOf('/')
            text = text.substr(lastIndex + 1)
          }
          this.$emit('select-change', text)
        }, 50)
      }
    }
  }
}
</script>

<style>
</style>
