<template>
  <Welcome menu-name="xjxt.welcome" />
</template>

<script>
export default {
  name: 'TsWelcome',
  components: {
    Welcome: () => import('./index')
  }
}
</script>
