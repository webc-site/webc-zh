<script>
import toast, { toastErr, TOAST_TIMEOUT } from "./Toast.js";

const showToast3s = () => {
    toast(
      (el) => {
        el.innerText = "普通提示 (3秒后自动消失)";
      },
      [[TOAST_TIMEOUT, 3]],
    );
  },
  showToastErr5s = () => {
    toastErr(
      (el) => {
        el.innerText = "错误提示 (5秒后自动消失)";
      },
      [[TOAST_TIMEOUT, 5]],
    );
  },
  showToastDefault = () => {
    toast((el) => {
      el.innerText = "普通提示 (9秒后自动消失)";
    });
  },
  showToastErrDefault = () => {
    toastErr((el) => {
      el.innerText = "错误提示 (9秒后自动消失)";
    });
  };
</script>

<template lang="pug">
section
  header 吐司提示 (Toast) 演示
  b.btn-group
    button.Btn.Lg(onclick!={ showToast3s }) 普通 (3秒后自动消失)
    button.Btn.Lg(onclick!={ showToastErr5s }) 错误 (5秒后自动消失)
    button.Btn.Lg(onclick!={ showToastDefault }) 普通 (9秒后自动消失)
    button.Btn.Lg(onclick!={ showToastErrDefault }) 错误 (9秒后自动消失)
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