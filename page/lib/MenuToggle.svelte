<script>
let { onclick } = $props();
</script>

<template lang="pug">
button(aria-label="菜单" onclick!={ onclick })
  b
  b
  b
</template>

<style lang="stylus">
@import '~/styl/var.styl'

button
  display none

  @media $mobile
    display inline-flex
    flex-direction column
    align-items center
    justify-content center
    gap 3px
    position absolute
    top var(--gap)
    right 20px
    z-index 102
    width 32px
    height 32px
    border-radius 50%
    border 1px solid #00000014
    color #1d1d1f
    background linear-gradient(135deg, #ffffff66, #ffffff1f)
    backdrop-filter blur(8px)
    box-shadow inset 0 1px 1px #ffffff99, 0 1px 2px #0000000a
    transition all 0.25s cubic-bezier(0.4, 0, 0.2, 1)
    cursor pointer
    padding 0

    &:hover
      color #0071e3
      border-color #0047e333
      background linear-gradient(135deg, #ffffff99, #ffffff33)
      transform scale(1.06) translateY(-1px)
      box-shadow inset 0 1px 1px #ffffffcc, 0 4px 12px #0000000f, 0 1px 2px #0000000a

      > b
        background currentColor

    &:active
      transform scale(0.96)
      background linear-gradient(135deg, #ffffff4d, #ffffff0f)
      box-shadow inset 0 1px 2px #0000000d

    > b
      width 14px
      height 2px
      background currentColor
      border-radius 1px
      transition all 0.3s ease
</style>