<script>
import xBox from "./XBox.js";
import { newEl } from "x/dom.js";
import "../Lg/Lg.styl";
import "../Btn/Btn.styl";

const showXBox = () => {
  const dialog = xBox(),
    form = newEl("form"),
    title = newEl("h3"),
    p = newEl("p");

  form.className = "Lg";
  title.textContent = "带有关闭按钮的弹窗 (XBox)";
  p.textContent = "这是一个基于 Box 并封装了关闭(aX)和 Esc 键退出功能的弹窗。";

  form.append(title, p);
  dialog.append(form);
};
</script>

<template lang="pug">
section
  header XBox 弹窗演示
  b.btn-group
    button.Btn.Lg.Main(onclick!={ showXBox }) 弹出 XBox
</template>

<style lang="stylus">
:global
  @import '~/com/Btn/var.styl'
  @import '~/com/Btn/Btn.styl'
  @import '~/com/Box/Box.styl'
  @import '~/com/XBox/var.styl'
  @import '~/com/XBox/XBox.styl'

  //给 Demo 弹窗应用 .Lg 样式
  dialog.Box
    form.Lg
      border-radius 16px
      padding 24px
      display flex
      flex-direction column
      gap 12px
      align-items flex-start
      min-width 280px

      h3
        margin 0
        font-size 18px
        font-weight 600
        color #1d1d1f

      p
        margin 0
        font-size 14px
        color #666
        line-height 1.5

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