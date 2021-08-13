<template>
  <div>
    <CompanySelector v-model="company" :style="{width}" />
    <div v-loading="loading" class="group-list">
      <PartyGroup
        v-for="i in options"
        :key="i.key"
        :data="i"
        :selected.sync="i.selected"
        :is-selector="true"
        @click="handleClick(i)"
      />
    </div>
  </div>
</template>

<script>
import { getList, groupDetail } from '@/api/zzxt/party-group'
export default {
  name: 'PartyGroupSelector',
  components: {
    CompanySelector: () => import('@/components/Company/CompanySelector'),
    PartyGroup: () => import('./index')
  },
  model: {
    prop: 'value',
    event: 'change'
  },
  props: {
    width: { type: String, default: '15rem' },
    value: { type: [String, Array], default: null },
    multi: { type: Boolean, default: false }
  },
  data: () => ({
    company: null,
    options: [],
    loading: false
  }),
  computed: {
    inner_value: {
      get() {
        return this.value
      },
      set(val) {
        const multi = this.multi
        const isArray =
          Object.prototype.toString.call([]) ===
          Object.prototype.toString.call(val)
        if (isArray && !multi) val = val[0]
        else if (!isArray && multi) val = [val]
        this.$emit('update:value', val)
        this.$emit('change', val)
      }
    }
  },
  watch: {
    value: {
      handler(val) {
        this.load_group_detail()
      },
      immediate: true
    },
    company: {
      handler(val) {
        if (!val) return
        this.load_groups(val)
      },
      immediate: true,
      deep: true
    }
  },
  methods: {
    load_groups() {
      const company = this.company.code
      this.loading = true
      this.options = []
      getList({ company })
        .then(data => {
          this.options = data.list.map((i, index) => {
            const selected = index === 0
            return Object.assign({ selected }, i)
          })
          if (this.options.length) this.inner_value = this.options[0].id
        })
        .finally(() => {
          this.loading = false
        })
    },
    load_group_detail() {
      if (!this.value) return
      const list =
        Object.prototype.toString.call([]) !==
        Object.prototype.toString.call(this.value)
          ? [this.value]
          : this.value
      const dict = {}
      this.options.map(i => {
        dict[i.id] = true
      })
      list
        .filter(group => !dict[group])
        .map(group => {
          groupDetail({ group }).then(data => {
            this.options.push(data.model)
          })
        })
    },
    handleClick(i) {
      if (!this.multi) {
        this.remove_all_select(i)
        return this.$emit('change', i.id)
      }
      const list = this.options.filter(i => i.selected).map(i => i.id)
      return this.$emit('change', list)
    },
    remove_all_select(i) {
      this.options.map(item => {
        if (item.id === i.id) return
        item.selected = false
      })
    }
  }
}
</script>
<style lang="scss" scoped>
.group-list {
  margin-top: 1rem;
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  row-gap: 1rem;
}
</style>
