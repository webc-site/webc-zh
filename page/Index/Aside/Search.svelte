<script>
let { search_query = $bindable() } = $props();
</script>

<template lang="pug">
b
  input(type="text" placeholder="搜索组件..." bind:value={ search_query })
</template>

<style lang="stylus">
@import '~/styl/var.styl'

b
  position relative
  display flex

  input
    box-sizing border-box
    flex 1
    min-width 0
    padding 10px 36px 10px 16px
    font-size 14px
    border-radius 10px
    transition all 0.3s cubic-bezier(0.4, 0, 0.2, 1)
    background url('/svg/search.svg') no-repeat right 12px center, linear-gradient(to bottom, #ffffff00, #ffffff00)
    border 1px solid #0000001f
    color #1d1d1f
    outline none

    &::placeholder
      color #86868b
      font-weight normal

    &:focus
      border-color #0071e3
      background url('/svg/search.svg') no-repeat right 12px center, linear-gradient(to bottom, #ffffffcc, #ffffff4d)

    @media $mobile
      font-size 16px
</style>