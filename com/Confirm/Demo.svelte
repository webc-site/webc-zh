<script>
import Confirm from "./Confirm.js";
import { newEl } from "x/dom.js";
import "../Btn/Btn.styl";

const showRichConfirm = () => {
    Confirm((el) => {
      const h3 = newEl("h3"),
        p = newEl("p");
      h3.textContent = "危险操作";
      p.textContent = "此操作不可逆，请确认您已备份数据。";
      el.append(h3, p);
    });
  },
  showAsyncConfirm = () => {
    Confirm(
      (el) => {
        return new Promise((resolve) => {
          setTimeout(() => {
            const h3 = newEl("h3");
            h3.textContent = "异步渲染完成";
            el.append(h3);
            resolve();
          }, 1500);
        });
      },
      () => {
        return new Promise((resolve) => {
          setTimeout(resolve, 1000);
        });
      },
    );
  };
</script>

<template lang="pug">
section
  header 弹出层演示
  b.btn-group
    button.Btn.Lg(onclick!={ showRichConfirm }) 渲染函数
    button.Btn.Lg(onclick!={ showAsyncConfirm }) 异步等待
</template>

<style lang="stylus">
:global
  @import '~/com/Confirm/var.styl'
  @import '~/com/Confirm/Confirm.styl'
  //由于 Confirm 依赖 Box 样式进行定位，故在这里把 Box.styl 也导入为全局
  @import '~/com/Box/Box.styl'
  @import '~/com/Btn/var.styl'
  @import '~/com/Btn/Btn.styl'
  @import '~/com/Wait/var.styl'
  @import '~/com/Wait/Wait.styl'

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