<script>
let { url = "" } = $props();
</script>

<template lang="pug">
+if url
  a(
    href!={ url }
    target="_blank"
    title="查看源码"
    aria-label="GitHub"
    onclick!={ (e) => e.stopPropagation() }
  )
</template>

<style lang="stylus">
a
  display inline-flex
  align-items center
  justify-content center
  width 32px
  height 32px
  border-radius 50%
  border 1px solid #00000014
  color #1d1d1f
  background linear-gradient(135deg, #ffffff66, #ffffff1f)
  backdrop-filter blur(8px)
  box-shadow inset 0 1px 1px #ffffff99, 0 1px 2px #0000000a
  transition all 0.25s cubic-bezier(0.4, 0, 0.2, 1)
  text-decoration none
  box-sizing border-box

  &::before
    content ''
    width 20px
    height 20px
    background-color currentColor
    mask-image url('/svg/github.svg')
    mask-size contain
    mask-repeat no-repeat
    mask-position center

  &:hover
    color #0071e3
    border-color #0047e333
    background linear-gradient(135deg, #ffffff99, #ffffff33)
    transform scale(1.06) translateY(-1px)
    box-shadow inset 0 1px 1px #ffffffcc, 0 4px 12px #0000000f, 0 1px 2px #0000000a

  &:active
    transform scale(0.96)
    background linear-gradient(135deg, #ffffff4d, #ffffff0f)
    box-shadow inset 0 1px 2px #0000000d
</style>