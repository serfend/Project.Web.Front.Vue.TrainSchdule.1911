<template>
  <div>
    <Loading />
  </div>
</template>

<script>
export default {
  name: 'MyInfo',
  label: '我的信息',
  icon: 'namecard',
  index: 1,
  components: {
    Loading: () => import('@/views/Loading')
  },
  methods: {}
}
</script>
