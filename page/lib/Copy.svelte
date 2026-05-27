<script>
let { text = "" } = $props(),
  copied = $state(false);

const copy = () => {
  navigator.clipboard.writeText(text);
  copied = true;
  setTimeout(() => {
    copied = false;
  }, 1500);
};
</script>

<template lang="pug">
button(class!={ copied ? 'copied' : '' } onclick!={ copy })
  | {copied ? '已复制' : '复制'}
</template>

<style lang="stylus">
button
  display inline-flex
  align-items center
  justify-content center
  gap 4px
  padding 0 10px
  height 28px
  box-sizing border-box
  border-radius 6px
  font-size 12px
  font-weight 500
  border none
  background #0071e314
  color #0071e3
  cursor pointer
  transition all 0.2s cubic-bezier(0.4, 0, 0.2, 1)
  outline none
  user-select none

  &::before
    content ''
    width 12px
    height 12px
    background url('/svg/copy.svg') no-repeat center / contain
    filter invert(30%) sepia(87%) saturate(1915%) hue-rotate(192deg) brightness(97%) contrast(102%)
    transition filter 0.2s ease

  &:hover
    background #0071e326

  &:active
    transform scale(0.97)
    background #0071e338

  &.copied
    background #34c759
    color #ffffff

    &::before
      background-image url('/svg/ok.svg')
      filter invert(100%)
</style>