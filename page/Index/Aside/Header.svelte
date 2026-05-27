<script>
let { active_index } = $props();
</script>

<template lang="pug">
b.aside-header
  a(href="/" class!={ active_index == -2 ? 'active' : '' })
    i.icon-home
    b 主页
  a(
    href="https://groups.google.com/g/webc-site"
    target="_blank"
    rel="noopener noreferrer"
  )
    i.icon-forum
    b 论坛
</template>

<style lang="stylus">
.aside-header
  display flex
  gap 8px
  margin-bottom 12px

  a
    flex 1
    display flex
    align-items center
    justify-content center
    gap 8px
    padding 10px
    font-size 13px
    font-weight 500
    border-radius 10px
    border 1px solid #00000005
    background #ffffff66
    color #1d1d1f
    text-align left
    cursor pointer
    position relative
    text-decoration none
    box-shadow 0 1px 2px #00000005
    transition all 0.25s cubic-bezier(0.4, 0, 0.2, 1)

    &:hover
      background #ffffffb3
      border-color #0000000f
      box-shadow 0 4px 12px #0000000a
      transform translateY(-0.5px)

    &.active
      background #0071e314
      border-color #0071e333
      color #0071e3
      font-weight 600

    i
      width 16px
      height 16px
      mask-size contain
      mask-repeat no-repeat
      mask-position center
      display inline-block
      background currentColor

      &.icon-home
        mask-image url('/svg/home.svg')

      &.icon-forum
        mask-image url('/svg/group.svg')
</style>