<template>
  <el-cascader
    ref="elcascader"
    v-model="staticValue"
    :props="props"
    :show-all-levels="true"
    :placeholder="placeholder===null?'未选择':placeholder"
    style="width:100%"
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
      type: String,
      default: ''
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
        if (this.staticValue[this.staticValue.length - 1] !== v) {
          this.staticValue = []
        }
      },
      immediate: true
    }
  },
  methods: {
    handleItemChange(val) {
      var v = val[val.length - 1]
      this.$emit('update:code', v)
      setTimeout(() => {
        this.$emit('select-change', this.$refs.elcascader.inputValue)
      }, 50)
    }
  }
}
</script>

<style>
</style>
