<template>
  <el-cascader
    :props="props"
    :show-all-levels="true"
    style="width:100%"
    @change="handleItemChange"
  />
</template>

<script>
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
      props: {
        getChild: id => {
          return this.childGetterMethod(id)
        },
        lazy: true,
        checkStrictly: true,
        lazyLoad(node, resolve) {
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
      var v = val[val.length - 1]
      this.props
      this.$emit('update:code', v)
    }
  }
}
</script>

<style>
</style>
