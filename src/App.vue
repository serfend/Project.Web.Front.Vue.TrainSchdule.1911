<template>
  <div id="app">
    <router-view />
  </div>
</template>

<script>
export default {
  name: 'App',
  mounted() {
    // this.$notify.info('按住Ctrl+鼠标滚轮可以缩放哦~')
    var scale = 1.25
    document.body.style.zoom = scale

    this.$confirm(`当前屏幕已缩放到${scale}倍尺寸，是否保持?`, '确认尺寸', {
      distinguishCancelAndClose: true,
      confirmButtonText: '是',
      cancelButtonText: '否'
    })
      .then(data => {
        console.log(data)
      })
      .catch(action => {
        console.log(action)
        if (action === 'cancel') {
          document.body.style.zoom = ''
          this.$notify.info(
            '您取消了页面缩放，之后也可以通过Ctrl+鼠标滚轮进行缩放'
          )
        }
      })
  }
}
</script>
