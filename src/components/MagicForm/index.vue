<template>
  <el-form>
    <el-form-item v-if="setting&&setting.type" label="默认值">
      <component :is="setting.type" v-model="setting.default" />
    </el-form-item>
    <el-collapse>
      <el-form-item v-for="i in innerData" :key="i.key" :alias="i.key" :label="i.label">
        <el-collapse-item>
          <el-tooltip slot="title" content="启用后将跟随父级默认值">
            <el-switch
              v-if="i.__setting&&i.__setting.useParent!==undefined"
              v-model="i.__setting.useParent"
            />
          </el-tooltip>
          <component
            :is="i.type"
            v-show="!i.__setting||(i.__setting&&!i.__setting.useParent)"
            v-model="i.value"
          />
        </el-collapse-item>
      </el-form-item>
    </el-collapse>
  </el-form>
</template>

<script>
export default {
  name: 'MagicForm',
  model: {
    prop: 'data',
    event: 'changed'
  },
  props: {
    /* prop to defined formitems,for example you can use:
  {
    color:{
      label:'theme primary color',
      value:['#ff00ffff','#ff0000ff'],
      type:'el-color-picker' // would generate a color picker list,also you can use ()=>import(`components`)
    },
    server:{
      label:'api server',
      value:{
        __default:'server.com', // default value when child use `__useParent` it would effect
        server1:{
          label:'server primary',
          value:'google.com',
          type:'el-input',
          __useParent:false
        },
        server2:{
          label:'server emergency',
          value:'m1.google.com',
          type:'el-input',
          __useParent:true
        }
      }
    } // would generate 2 items in item `server`
  }
  to generate 2 formitems on which user can input custome value in it,
  and its would be emit by update:data
   */
    data: {
      type: Object,
      default: null
    },
    alias: {
      type: String,
      default: null
    }
  },
  data: () => ({
    innerData: null,
    setting: {
      useParent: false,
      default: null,
      type: null
    },
    loading: false
  }),
  watch: {
    innerData: {
      handler(val) {
        this.$nextTick(() => {
          this.updateValue()
        })
      },
      deep: true
    },
    default: {
      handler(val) {
        this.$nextTick(() => {
          this.updateValue()
        })
      }
    },
    data: {
      handler(val) {
        if (this.innerData) return
        this.loading = true
        setTimeout(() => {
          val = val || {}
          if (val.__setting) {
            this.setting = {}
            this.setting.useParent = val.__setting.useParent
            this.setting.default = val.__setting.default
            this.setting.type = val.__setting.type
            delete val.__setting
          }
          var list = Object.keys(val)
          this.innerData = list.map(i => {
            var item = Object.assign({ key: i }, val[i])
            if (!item.type) {
              var isObj =
                Object.prototype.toString.call(item.value) === '[object Object]'
              if (isObj) {
                item.type = 'MagicForm'
              } else {
                throw new Error(
                  `form item invalid:${item.key} is leaf node but its type not defined`
                )
              }
            }
            return item
          })
          this.$nextTick(() => {
            this.loading = false
          })
        }, 500)
      },
      deep: true,
      immediate: true
    }
  },
  methods: {
    updateValue() {
      if (this.loading) return
      var val = this.innerData
      var changedItem = {}
      for (var item of val) {
        changedItem[item.key] = Object.assign({}, item)
        if (
          changedItem[item.key].__setting &&
          changedItem[item.key].__setting.useParent
        ) {
          changedItem[item.key].value = this.setting.default
        }
      }
      changedItem.__setting = {
        useParent: this.setting.useParent,
        default: this.setting.default,
        type: this.setting.type
      }
      console.log(changedItem)
      this.$emit('changed', changedItem)
    }
  }
}
</script>

<style>
</style>
