<template>
  <div v-if="types">
    <el-select v-show="filtedTypes && filtedTypes.length" v-model="inner_value" :multiple="multi" clearable>
      <el-option
        v-for="(item) in filtedTypes"
        :key="item.id"
        :value="item.value"
        :label="item.alias"
        :disabled="isDisabled(item)"
      >
        <Index :type="item.value" />
      </el-option>
    </el-select>
    <div v-show="!filtedTypes || !filtedTypes.length">当前无任何类型可选</div>
  </div>
</template>

<script>
export default {
  name: 'FaceDeviceOptionSelector',
  components: {
    Index: () => import('./index')
  },
  model: {
    event: 'change',
    prop: 'value'
  },
  props: {
    value: { type: Array, default: () => [] },
    valueRange: { type: Array, default: () => [1, 999] },
    except: { type: Array, default: null },
    multi: { type: Boolean, default: false }
  },
  data: () => ({
    inner_value_value: null
  }),
  computed: {
    inner_value: {
      set(val) {
        val = val || []
        this.inner_value_value = val
        this.$emit('update:value', val)
        this.$emit('change', val)
      },
      get() {
        return this.inner_value_value
      }
    },
    filtedTypes () {
      const userFilter = this.types
      return userFilter
    },
    types () {
      return this.$store.state.sec.faceDeviceOptions
    },
    exceptDict() {
      const dict = {}
      if (!this.except) return dict
      this.except.forEach(i => {
        dict[i] = true
      })
      return dict
    }
  },
  watch: {
    value: {
      handler(val) {
        this.inner_value_value = val
      },
      immediate: true
    }
  },
  mounted() {
    this.$store.dispatch('sec/initDictionary')
  },
  methods: {
    isDisabled(item) {
      const userDisabled = this.exceptDict[item.value]
      return userDisabled
    }
  }
}
</script>
