<script>
let { toc = [], onclick } = $props();
</script>

<template lang="pug">
v-scroll
  b
    b 章节导航
    b
      +each toc as [level, title, _, idx]
        button(class="level-{level}" onclick!={ () => onclick?.(idx) }) {title}
</template>

<style lang="stylus">
@import '~/styl/var.styl'

v-scroll
  width 240px
  height 100%
  border-left 1px solid #ffffff1a
  background linear-gradient(135deg, #ffffff1f 0, #ffffff05 100%)
  backdrop-filter blur(30px) saturate(190%)
  box-shadow -4px 0 24px #00000005, inset 1px 0 0 #ffffff26

  &::part(scroll)
    box-sizing border-box

  @media $narrow
    display none

  > b
    display block
    padding var(--gap)
    box-sizing border-box

    > b:first-child
      display inline-block
      font-size 11px
      font-weight 600
      letter-spacing 1px
      color #0000004d
      text-transform uppercase
      margin-bottom 8px

    > b:last-child
      display flex
      flex-direction column
      gap 4px

  button
    display block
    width 100%
    text-align left
    background none
    border 1px solid transparent
    padding 4px 8px
    cursor pointer
    border-radius 8px
    transition all 0.25s cubic-bezier(0.4, 0, 0.2, 1)
    line-height 1.4
    box-sizing border-box

    &:hover
      color #0071e3
      background #ffffff66
      border-color #0071e31a
      box-shadow 0 2px 8px #0000000a, inset 0 1px 0 #ffffff80
      transform translateX(4px)

    &.level-2
      font-weight 600
      color #1d1d1f
      font-size 14px
      margin-top 8px

      &:first-child
        margin-top 0

      &:hover
        color #0071e3

    &.level-3
      font-weight 500
      color #424245
      font-size 13px

    &.level-4
      font-weight 400
      color #86868b
      font-size 12px

    &.level-5
      font-weight 400
      color #86868b
      font-size 11px
      padding-left 16px

    &.level-6
      font-weight 400
      color #86868b
      font-size 11px
      padding-left 24px
</style>