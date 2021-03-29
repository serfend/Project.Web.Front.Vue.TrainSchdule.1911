<template>
  <Welcome :list="routes" :show-title="false" style="height:1080px" />
</template>

<script>
import { default_pages } from './setting'
export default {
  name: 'MemberRateWelcome',
  components: {
    Welcome: () => import('@/views/welcome')
  },
  data: () => ({ routes: default_pages })
}
</script>
