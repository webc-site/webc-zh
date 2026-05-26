<script>
let { options = [], value, align = "left", width = "100%", onSelect } = $props();

const list = $derived(
  options.map((item) => {
    if (typeof item == "string") {
      return { label: item.split(" ")[0], value: item };
    }
    return item;
  }),
);
</script>

<template lang="pug">
nav(class={ align } style="--width:{width}")
  +each list as item
    button(
      type="button"
      class!={ value == item.value ? 'selected' : '' }
      onclick!={ (e) => onSelect?.(item.value, e) }
    ) {item.label}
</template>

<style lang="stylus">
nav
  position absolute
  top 100%
  margin-top 6px
  width var(--width)
  display flex
  flex-direction column
  gap 6px
  z-index 999
  animation scale-in 0.15s cubic-bezier(0.16, 1, 0.3, 1)

  &.left
    left 0

  &.right
    right 0

  button
    border 1px solid #00000014
    background #ffffff99
    backdrop-filter blur(20px) saturate(190%)
    width 100%
    height 32px
    padding 0 14px
    border-radius 16px
    display inline-flex
    align-items center
    justify-content flex-start
    font-size 12px
    font-weight 500
    color #1d1d1f
    cursor pointer
    box-shadow 0 4px 12px #0000000d
    transition all 0.2s cubic-bezier(0.4, 0, 0.2, 1)
    white-space nowrap
    box-sizing border-box

    &:hover
      background #fffffff2
      border-color #00000026
      box-shadow 0 6px 16px #00000014
      transform translateY(-1px)
      color #0071e3

    &.selected
      color #0071e3
      font-weight 600
      background #fffffff2
      border-color #0071e366
      box-shadow 0 6px 16px #0071e31a

      &:hover
        background #ffffff
        border-color #0071e3

@keyframes scale-in
  0%
    opacity 0
    transform scale(0.96) translateY(-4px)
    pointer-events none

  99%
    pointer-events none

  100%
    opacity 1
    transform scale(1) translateY(0)
    pointer-events auto
</style>