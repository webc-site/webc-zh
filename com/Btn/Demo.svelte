<script>
import { GIT_HOME } from "~/sh/example/conf/url/CODE.js";
</script>

<template lang="pug">
section
  header 按钮样式 (.Btn)
  div.btn-container
    button.Btn.Lg 默认按钮
    button.Btn.Lg.Blue 蓝色按钮
    a.Btn.Lg(href={ GIT_HOME }) 链接按钮

  header 图标按钮 (.BtnC)
  div.btn-container
    button.BtnC.Lg(aria-label="添加")
</template>

<style lang="stylus">
@import '~/com/Btn/demo/_.css'

:global
  @import '~/com/Btn/var.styl'
  @import '~/com/Btn/Btn.styl'

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

.btn-container
  display flex
  gap 12px
  align-items center
  flex-wrap wrap
</style>