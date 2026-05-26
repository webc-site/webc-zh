<script>
import { onMount } from "svelte";
import I18n from "./I18n.js";
import { onLang } from "x/i18n.js";
import NAME from "@3-/lang/NAME.js";

let container = null;
let lang_idx = $state(1);

onMount(() => {
  const btn = I18n(NAME.forEach.bind(NAME));
  container.append(btn);
  return onLang((idx) => {
    lang_idx = idx;
  });
});
</script>

<template lang="pug">
section
  header 国际化选择组件 (I18n) 演示
  b
    b(bind:this={ container })
    p 当前选择的语言：
      strong {NAME[lang_idx]}
      | {" (索引: " + lang_idx + ")"}
</template>

<style lang="stylus">
:global
  @import '~/com/I18n/var.styl'
  @import '~/com/I18n/I18n.styl'

section
  display flex
  flex-direction column
  gap 20px
  width 100%
  max-width 650px
  margin 40px auto
  padding 32px
  box-sizing border-box
  align-items center

  > header
    font-size 18px
    font-weight 600
    color #1d1d1f
    text-align center

  > b
    display flex
    flex-direction column
    align-items center
    gap 16px
    padding 24px
    background #ffffff66
    border-radius 16px
    backdrop-filter blur(10px)
    border 1px solid #0000000d
    width 100%
    box-sizing border-box

    > p
      margin 0
      font-size 14px
      color #666
</style>