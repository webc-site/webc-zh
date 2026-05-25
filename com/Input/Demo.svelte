<script>
let val = "李四";
</script>

<template lang="pug">
section
  header 默认状态 (未输入)
  b.Input.Lg
    input#input-empty(type="text" placeholder=" ")
    label(for="input-empty") 电子邮箱

  header 预设值状态
  b.Input.Lg
    input#input-val(type="text" placeholder=" " value="z@example.com")
    label(for="input-val") 电子邮箱

  header
    | 当前绑定的值是 {val}
  b.Input.Lg
    input#input-bind(type="text" placeholder=" " bind:value={ val })
    label(for="input-bind") 用户名
</template>

<style lang="stylus">
:global
  @import '~/com/Input/var.styl'
  @import '~/com/Input/Input.styl'

section
  display flex
  flex-direction column
  gap 20px
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
</style>