<template>
  <span>
    <el-link v-show="innerHide" type="primary" @click="startSelect">{{
      vNowSelect || "未选择"
    }}</el-link>
    <el-link
      v-show="innerHide && vNowSelect"
      @click="cancelSelect"
    >取消选择</el-link>
    <el-dialog v-if="asDialog" :visible.sync="dialog_show" append-to-body>
      <div style="height:35rem">
        <VacationTypeSelectorInner
          v-model="innerNowSelect"
          :types.sync="innerTypes"
          :hide.sync="innerHide"
          :now-select="nowSelect"
          :left-length="leftLength"
          :entity-type="entityType"
          :check-filter="checkFilter"
        />
      </div>
    </el-dialog>
    <VacationTypeSelectorInner
      v-else
      v-model="innerNowSelect"
      :types.sync="innerTypes"
      :hide.sync="innerHide"
      :now-select="nowSelect"
      :left-length="leftLength"
      :entity-type="entityType"
      :check-filter="checkFilter"
    />
  </span>
</template>
<script>
export default {
  name: 'VacationTypeSelector',
  components: {
    VacationTypeSelectorInner: () => import('./VacationTypeSelectorInner')
  },
  model: {
    prop: 'nowSelect',
    event: 'change'
  },
  props: {
    nowSelect: { type: String, default: null },
    types: { type: Array, default: null },
    leftLength: { type: Number, default: 0 },
    entityType: { type: String, required: true },
    checkFilter: { type: Boolean, default: true },
    hide: { type: Boolean, default: false },
    asDialog: { type: Boolean, default: false }
  },
  data: () => ({
    vInnerHide: true,
    vNowSelect: null,
    dialog_show: false
  }),
  computed: {
    innerNowSelect: {
      get() {
        return this.vNowSelect
      },
      set(val) {
        this.vNowSelect = val
        this.dialog_show = false
        this.$emit('change', val)
      }
    },
    innerTypes: {
      get() {
        return this.types
      },
      set(val) {
        this.$emit('update:types', val)
      }
    },
    innerHide: {
      get() {
        return this.vInnerHide
      },
      set(val) {
        this.vInnerHide = val
        this.$emit('update:hide', val)
      }
    }
  },
  watch: {
    dialog_show(v) {
      if (v) return
      this.vInnerHide = true
    },
    nowSelect: {
      handler(v) {
        this.vNowSelect = v
      },
      immediate: true
    }
  },
  methods: {
    startSelect() {
      this.innerHide = false
      this.dialog_show = true
    },
    cancelSelect() {
      this.$emit('change', null)
      this.vNowSelect = null
    }
  }
}
</script>
