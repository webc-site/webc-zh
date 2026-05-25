<script>
import toast, { toastErr } from "./Toast.js";

const showToast = () => {
    toast("操作成功！");
  },
  showToastErr = () => {
    toastErr("操作失败，请重试！");
  };
</script>

<template lang="pug">
section
  header 吐司提示 (Toast) 演示
  b.btn-group
    button.Btn.Main.Lg(onclick!={ showToast }) 成功提示
    button.Btn.Lg(onclick!={ showToastErr }) 错误提示
</template>

<style lang="stylus">
:global
  @import '~/com/Toast/var.styl'
  @import '~/com/Toast/Toast.styl'
  @import '~/com/Btn/var.styl'
  @import '~/com/Btn/Btn.styl'

section
  display flex
  flex-direction column
  gap 20px
  width 100%
  max-width 600px
  margin 40px auto
  padding 32px
  box-sizing border-box

header
  font-size 18px
  font-weight 600
  color #1d1d1f
  text-align center

.btn-group
  display flex
  gap 16px
  justify-content center
  flex-wrap wrap
</style>