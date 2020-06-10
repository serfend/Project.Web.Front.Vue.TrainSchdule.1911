<template>
  <div>
    <CompanySelector
      v-if="Object.prototype.toString.call(innerData)==='[object Object]'"
      v-model="innerData"
      :company-select-names="companySelectNames"
    />
    <div v-else style="display:flex;">
      <div v-for="(item,index) in innerData" :key="index" class="color-selector">
        <CompanySelector
          v-model="innerData[index]"
          :company-select-name="companySelectNames?companySelectNames[index]:''"
        />
        <i class="el-icon-close delete-btn" @click="removeItem(index)" />
      </div>
      <el-button icon="el-icon-plus" size="mini" style="height:36px" @click="addNew" />
    </div>
  </div>
</template>

<script>
import CompanySelector from './CompanySelector'
export default {
  name: 'CompaniesSelector',
  components: { CompanySelector },
  model: {
    prop: 'data',
    event: 'change'
  },
  props: {
    data: {
      type: [Array, Object],
      default: () => []
    },
    companySelectNames: {
      type: [Array, String],
      default: null
    }
  },
  data: () => ({
    innerData: []
  }),
  watch: {
    data: {
      handler(val) {
        this.innerData = val
      },
      immediate: true
    },
    innerData: {
      handler(val) {
        this.$emit('change', this.innerData)
      }
    }
  },
  methods: {
    removeItem(index) {
      this.innerData.splice(index, 1)
      var arr = this.companySelectNames
      arr.splice(index, 1)
      this.$emit('update:companySelectNames', arr)
    },
    addNew() {
      for (var i = 0; i < this.innerData.length; i++) {
        if (!this.innerData[i].code) return
      }
      this.innerData.push({ code: '', name: '选择单位' })
    }
  }
}
</script>

<style lang="scss" scoped>
.list-picker {
  display: inline-flex;
  align-items: center;
}
.color-selector {
  display: flex;
  flex-direction: column;
  align-items: center;
  .delete-btn {
    transition: all 0.5s;
    transform: scale(0);
  }
  &:hover {
    .delete-btn {
      transform: scale(1);
      &:hover {
        cursor: pointer;
        color: #800;
      }
    }
  }
}
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s;
}

.fade-enter,
.fade-leave-to {
  opacity: 0;
}
</style>
