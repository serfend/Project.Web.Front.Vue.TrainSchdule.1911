<template>
  <el-cascader
    ref="elcascader"
    v-model="staticValue"
    :props="props"
    :show-all-levels="true"
    :placeholder="data&&(multiple?data.map(i=>i[labelName]).join(' '):data[labelName])||placeholder||'未选中任何节点'"
    :class="['card',data&&data.length?'active':'inactive']"
    clearable
    :disabled="disabled"
    :style="{width}"
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
    defaultSelectFirst: { type: Boolean, default: false },
    data: { type: [Array, Object], default: null },
    disabled: { type: Boolean, default: false },
    placeholder: { type: String, default: null },
    valueName: { type: String, default: 'value' },
    labelName: { type: String, default: 'label' },
    emitName: { type: String, default: 'label' }, // 回传place的值
    multiple: { type: Boolean, default: false },
    childGetterMethod: { type: Function, default: () => () => {} },
    place: { type: String, default: null },
    width: { type: String, default: null }
  },
  data() {
    return {
      staticValue: [],
      props: {
        getChild: id => {
          return this.childGetterMethod(id)
        },
        getSelf: () => this,
        lazy: true,
        checkStrictly: true,
        multiple: this.multiple,
        // expandTrigger: 'hover', 如果自动展开可能会导致偏移和无法选中的情况
        lazyLoad(node, callback) {
          if (node.root) node.value = 'root'
          const { valueName, labelName } = this.getSelf()
          this.getChild(node.value).then(data => {
            var list = data.list
            const nodes = Array.from(list).map(item => {
              return Object.assign(item, {
                value: `${item[valueName]}`,
                label: `${item[labelName]}`,
                leaf: false
              })
            })
            callback(nodes)
          })
        }
      }
    }
  },
  methods: {
    dblClick(v) {
      console.log(v)
    },
    handleItemChange(val) {
      const { emitName, multiple } = this
      this.$nextTick(() => {
        const nodes = this.$refs.elcascader.getCheckedNodes()
        const items = nodes.map(i => {
          const item = Object.assign({}, i.data)
          // item[valueName] = i[valueName]
          // item[labelName] = i[labelName]
          return item
        })
        const data = multiple ? items : items[0]
        this.$emit('change', data)
        const emitValue =
          data && (multiple ? data.map(i => i[emitName]) : data[emitName])
        this.$emit('update:emitValue', emitValue)
      })
    }
  }
}
</script>
<style lang="scss" scoped>
@import '@/styles/element-variables';
.card {
  width: '100%';
  transition: all ease 0.5s;
}
.active {
  color: $--color-primary;
}
.inactive {
  color: $--color-info;
}
</style>
