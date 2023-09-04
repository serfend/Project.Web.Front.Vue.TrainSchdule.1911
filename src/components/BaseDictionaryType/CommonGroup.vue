<template>
  <span v-waves :class="[`single-item${darkMode?'-dark':''}`,isSelector?'selector':null,inner_selected?'selected':null]" @click="handleClick">
    <span v-if="inner_data">
      <el-tag :style="{'margin-right':'0.5rem','background-color':inner_data.color}" effect="dark">{{ inner_data.level }}</el-tag>
      <el-tooltip class="item" effect="dark" :content="inner_data.alias" placement="top">
        <span :class="`item-alias${darkMode?'-dark':''}`">{{ inner_data.alias }}</span>
      </el-tooltip>
    </span>
    <el-tag v-else>未加载</el-tag>
  </span>
</template>

<script>
import waves from '@/directive/waves'
export default {
  name: 'CommonGroup',
  directives: {
    waves
  },
  model: {
    prop: 'id',
    event: 'change'
  },
  props: {
    id: { type: String, default: null },
    data: { type: Object, default: null },
    isSelector: { type: Boolean, default: false },
    selected: { type: Boolean, default: false },
    groupDetail: { type: Function, default: () => ({}) },
    darkMode: { type: Boolean, default: true }
  },
  data: () => ({
    inner_data: null,
    loading: false,
    inner_selected_value: false
  }),
  computed: {
    inner_selected: {
      get () {
        return this.inner_selected_value
      },
      set (val) {
        this.inner_selected_value = val
        this.$emit('update:selected', val)
      }
    },
    item () {
      return (this.data || this.inner_data || { alias: '未选择' }
      )
    }
  },
  watch: {
    selected: {
      handler (val) {
        this.inner_selected_value = val
      },
      immediate: true
    },
    id: {
      handler (val) {
        if (!val) return
        this.refresh()
      },
      immediate: true
    },
    data: {
      handler(v) {
        this.inner_data = v
      }, immediate: true
    }
  },
  methods: {
    refresh () {
      const id = this.id
      this.loading = true
      this.groupDetail({ group: id })
        .then(data => {
          this.inner_data = data.model
          this.$emit('update:data', this.inner_data)
        })
        .finally(() => {
          this.loading = false
        })
    },
    handleClick () {
      if (!this.isSelector) return
      this.inner_selected = !this.inner_selected
      this.$emit('click')
    }
  }
}
</script>
<style lang="scss" scoped>
@import '@/styles/element-variables';
%base-single-item {
  transition: all 0.5s ease;
  border-radius: 5px;
  padding: 0.5rem;
  width: 12rem;
  display: flex;
  align-items: center;
  color: $--color-text-regular;
	margin-top:0.5rem;
}
.single-item{
	@extend %base-single-item;
  box-shadow: 1px 1px 3px 0 rgba(0, 0, 0, 0.5);
}
.single-item-dark{
	@extend %base-single-item;
  box-shadow: 1px 1px 3px 0 rgba(255, 255, 255, 0.5);
}
.selector {
  cursor: pointer;
  user-select: none;
}
.selected {
  box-shadow: 0 2px 12px 0 rgba(24, 118, 224, 0.5);
  background-color: $--color-primary;
  color: $--border-color-light;
	.item-alias-dark{
		color:#000;
	}
	.item-alias{
		color:#fff;
	}
}
%base-item-alias{
  font-size: 0.8rem;
  margin-left: 0.5rem;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.item-alias {
  color: #555;
	@extend %base-item-alias;
}
.item-alias-dark{
  color: #ccc;
	@extend %base-item-alias;
}
</style>
