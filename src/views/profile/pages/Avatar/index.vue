<template>
  <div>
    <Loading />
  </div>
</template>

<script>
export default {
  name: 'Avatar',
  label: '我的头像',
  icon: 'patriarch',
  index: 2,
  components: {
    Loading: () => import('@/views/Loading')
  },
  methods: {}
}
</script>
