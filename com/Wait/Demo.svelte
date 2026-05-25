<template lang="pug">
section
  header 独立加载 (.wait)
  b
    b.wait

  header 表单提交加载遮罩 (.ing)
  b
    form.ing
      h3 账户登录
      b
        label
          b 用户名
          input(type="text" placeholder="输入用户名" required)
      b
        label
          b 密码
          input(type="password" placeholder="输入密码" required)
      button(type="submit") 登录
</template>

<style lang="stylus">
@import '~/com/Wait/var.styl'
@import '~/com/Wait/Wait.styl'

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

section > b
  background #ffffff
  border 1px solid #0000000a
  border-radius 16px
  padding 24px
  box-shadow 0 4px 20px #00000005, inset 0 1px 0 #ffffff
  display flex
  flex-direction column
  gap 16px
  min-height 120px

  &:first-of-type
    justify-content center
    align-items center

form
  display flex
  flex-direction column
  gap 16px
  width 100%

  h3
    margin 0
    font-size 18px
    font-weight 600
    color #1d1d1f

  > b
    label
      display flex
      flex-direction column
      gap 6px
      font-size 12px
      font-weight 500
      color #86868b

      b
        font-weight 500

  input
    padding 10px 14px
    border-radius 10px
    border 1px solid #0000000f
    background #f5f5f7
    font-size 14px
    outline none
    transition all 0.2s ease

    &:focus
      border-color #0071e3
      background #ffffff
      box-shadow 0 0 0 4px #0071e31a

button
  margin-top 8px
  padding 12px
  border-radius 10px
  background #0071e3
  color #ffffff
  font-weight 600
  font-size 14px
  border none
  transition all 0.2s ease

  &:hover:not(:disabled)
    background #0077ed

  &:active:not(:disabled)
    transform scale(0.98)

  &:disabled
    background #e5e5ea
    color #aeaeae
    cursor not-allowed
</style>