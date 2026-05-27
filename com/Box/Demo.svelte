<script>
import Box from "./Box.js";
import { newEl } from "x/dom.js";
import "../Lg/Lg.styl";
import "../Btn/Btn.styl";

const showSimpleBox = () => {
  const dialog = Box(),
    form = newEl("form"),
    title = newEl("h3"),
    p = newEl("p"),
    btn_ok = newEl("button");

  form.className = "Lg";
  title.textContent = "简单弹出层";
  p.textContent = "这是一个基于原生 dialog 并用 .Lg 类包装的毛玻璃弹出框。";
  btn_ok.type = "submit";
  btn_ok.textContent = "确定";
  btn_ok.className = "Btn Lg Main";

  form.append(title, p, btn_ok);
  dialog.append(form);

  form.onsubmit = (e) => {
    e.preventDefault();
    dialog.close();
  };
};
</script>

<template lang="pug">
section
  header Box 基础层演示
  b.btn-group
    button.Btn.Lg.Main(onclick!={ showSimpleBox }) 弹出简单 Box
</template>

<style lang="stylus">
:global
  @import '~/com/Btn/var.styl'
  @import '~/com/Btn/Btn.styl'
  @import '~/com/Box/Box.styl'

  //给 Demo 弹窗应用 .Lg 样式
  dialog.Box form.Lg
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