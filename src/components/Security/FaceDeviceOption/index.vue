<template>
  <BaseDictionaryType :type="type" :dictionary="dict" />
</template>

<script>
export default {
  name: 'FaceDeviceOption',
  components: {
    BaseDictionaryType: () => import('@/components/BaseDictionaryType')
  },
  model: {
    prop: 'type',
    event: 'change'
  },
  props: {
    type: { type: Number, default: -1 }
  },
  computed: {
    dict () {
      return this.$store.state.sec.faceDeviceOptionsDict
    }
  }
}
</script>
