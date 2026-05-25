<script>
import Copy from "~/page/lib/Copy.svelte";

let { text = "" } = $props(),
  overlay_el = $state();

const copy = (e) => {
  if (e.target.closest("button")) {
    return;
  }
  const btn = overlay_el.querySelector("button");
  btn.click();
};

const onKeydown = (e) => {
  // 13: Enter, 32: Space
  if ([13, 32].includes(e.keyCode)) {
    copy(e);
  }
};
</script>

<template lang="pug">
b.code(onclick!={ copy } onkeydown!={ onKeydown } role="button" tabindex="0")
  b(bind:this={ overlay_el })
    Copy(text={ text })
  pre {text}
</template>

<style lang="stylus">
@import '~/styl/var.styl'

.code
  position relative
  display flex
  align-items center
  width 100%
  cursor pointer
  background transparent
  border none
  padding 0
  text-align left

  pre
    flex 1
    min-width 0
    margin 0
    overflow-x auto
    font-size 12px
    color #1d1d1f
    white-space pre-wrap
    word-break break-all

  > b
    display flex
    align-items center
    max-width 0
    opacity 0
    pointer-events none
    overflow hidden
    white-space nowrap
    transform scale(0.9) translateX(-12px)
    transition max-width 0.25s cubic-bezier(0.4, 0, 0.2, 1), opacity 0.2s ease, margin-right 0.25s ease, transform 0.25s cubic-bezier(0.34, 1.56, 0.64, 1)

  &:hover
    > b
      max-width 90px
      margin-right 8px
      opacity 1
      pointer-events auto
      transform scale(1) translateX(0)

  @media $mobile
    pre
      font-size 11px
</style>