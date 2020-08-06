<template>
  <div>
    <OrgTree
      :data.sync="data"
      :horizontal="horizontal"
      :collapsable="collapsable"
      label-class-name="item-node"
      selected-class-name="myred"
      :render-content="renderContent"
      selected-key="selected"
      @on-expand="onExpand"
      @on-node-click="onNodeClick"
      @on-node-mouseover="onMouseover"
      @on-node-mouseout="onMouseout"
    />
  </div>
</template>

<script>
import { companyChild, companyDetail } from '@/api/company'
import OrgTree from 'vue-tree-color'
export default {
  name: 'CompanyTreeSelector',
  components: { OrgTree },
  data: () => ({
    data: {},
    current: {
      active: false,
      focus: null,
      select: null
    },
    horizontal: true,
    collapsable: true
  }),
  mounted() {
    const mapper = i => {
      i.id = i.code
      i.expand = false
      i.childrend = null
      return i
    }
    companyDetail().then(data => {
      const cur = data.model
      companyChild().then(data => {
        this.data = Object.assign(mapper(cur), {
          children: data.list.map(mapper)
        })
      })
    })
  },
  methods: {
    onMouseout(e, data) {
      this.current.active = false
    },
    onMouseover(e, data) {
      this.current.focus = data
      this.current.active = true
    },
    renderContent(h, data) {
      return data.name
    },
    onExpand(e, data) {
      if ('expand' in data) {
        data.expand = !data.expand

        if (!data.expand && data.children) {
          this.collapse(data.children)
        }
      } else {
        this.$set(data, 'expand', true)
      }
    },
    onNodeClick(e, data) {
      this.$set(data, 'selected', !data.selected)
    },
    collapse(list) {
      list.forEach(function(child) {
        if (child.expand) {
          child.expand = false
        }
      })
    },
    toggleExpand(data, val) {
      var _this = this
      if (Array.isArray(data)) {
        data.forEach(function(item) {
          _this.$set(item, 'expand', val)
          if (item.children) {
            _this.toggleExpand(item.children, val)
          }
        })
      } else {
        this.$set(data, 'expand', val)
        if (data.children) {
          _this.toggleExpand(data.children, val)
        }
      }
    }
  }
}
</script>
<style lang="scss" >
.item-node {
  cursor: pointer;
}
.myred {
  background: #f00;
}
.floating {
  background: rgba(0, 0, 0, 0.7);
  width: 160px;
  height: 100px;
  position: absolute;
  color: #fff;
  padding-top: 15px;
  border-radius: 15px;
  padding-left: 15px;
  box-sizing: border-box;
  left: 0;
  top: 0;
  transition: all 0.3s;
  z-index: 999;
  text-align: left;
  font-size: 12px;
}
</style>
