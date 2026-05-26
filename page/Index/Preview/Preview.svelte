<script>
import Import from "~/page/Index/Preview/Import.svelte";

let { name, active_demo, files = [] } = $props();
</script>

<template lang="pug">
v-scroll
  b
    +if active_demo
      +const DemoComponent = active_demo
      Import(name={ name } files={ files })
      article.Lg
        b
          DemoComponent
      +else
        article.Lg
          b
</template>

<style lang="stylus">
@import '~/styl/var.styl'

.Lg
  @media $mobile
    &::before, &::after
      display none

v-scroll
  flex 1
  min-width 0
  min-height 0

  &::part(scroll)
    box-sizing border-box
    overflow-x hidden

  > b
    display flex
    flex-direction column
    gap var(--gap)
    padding var(--gap) var(--gap) var(--gap) 0
    box-sizing border-box
    flex 1

    @media $mobile
      padding var(--gap) 0

article
  display flex
  flex-direction column
  overflow hidden
  border-radius 24px
  //flex: [flex-grow] [flex-shrink] [flex-basis];
  //1 (grow)   : 放大比例。当父容器有剩余空间时，填满所有剩余空间。
  //0 (shrink) : 缩小比例。当父容器空间不足时，固定大小，绝对不被压缩（实现 flex: none 效果）。
  //auto       : 基础大小。以元素自身内容的高度/宽度（或设置的 height/width）作为基准进行伸缩计算。
  flex 1 0 auto

  > b
    margin auto
    padding 32px
    box-sizing border-box
    max-width 100%

  @media $mobile
    border-radius 16px

    > b
      padding 20px 16px
</style>