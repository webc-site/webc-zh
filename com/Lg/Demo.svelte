<template lang="pug">
section
  header 液态玻璃边框样式 (.Lg)
  b
    article.Lg
      h3 标题示例
      p 内容示例。通过 Liquid Glass 视觉规范展现毛玻璃、悬浮效果。
</template>

<style lang="stylus">
@import '~/com/Lg/var.styl'

:global
  @import '~/com/Lg/Lg.styl'

section
  display flex
  flex-direction column
  gap 16px
  width 100%
  max-width 480px
  margin 0 auto
  padding 24px
  box-sizing border-box

header
  font-size 14px
  font-weight 600
  color #1d1d1f
  margin-top 8px

article.Lg
  border-radius 24px
  padding 24px
  box-sizing border-box
  display flex
  flex-direction column
  gap 12px
  min-height 120px

  h3
    margin 0
    font-size 16px
    font-weight 600
    color #1d1d1f

  p
    margin 0
    font-size 14px
    color #515154
    line-height 1.5
</style>