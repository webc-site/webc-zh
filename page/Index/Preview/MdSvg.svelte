<script>
import Copy from "~/page/lib/Copy.svelte";

let { svgs = [] } = $props();
</script>

<template lang="pug">
+if svgs.length > 0
  article.Lg
    h2 样式变量
    table
      thead
        tr
          th 变量名
          th 预览
          th 资源文件
      tbody
        +each svgs as [name, url, file_path]
          tr
            td
              b
                code {name}
                Copy(text={ name })
            td
              b
                img(src={ url } alt={ name })
            td
              code {file_path}
</template>

<style lang="stylus">
@import '~/styl/var.styl'

.Lg
  @media $mobile
    &::before, &::after
      display none

article
  border-radius 24px
  padding var(--gap)
  box-sizing border-box
  line-height normal

  h2
    font-size 15px
    font-weight 600
    color #1d1d1f
    margin 0 0 16px

  table
    width 100%
    border-collapse collapse
    text-align left
    font-size 13px

    tr
      border-bottom 1px solid #0000000a

      &:last-child
        border-bottom 0

    th, td
      padding 12px 16px
      vertical-align middle

      &:first-child
        padding-left 0

      &:last-child
        padding-right 0

    th
      font-weight 600
      color #86868b
      font-size 12px
      text-transform uppercase
      letter-spacing 0.5px

      &:nth-child(2)
        text-align center

    td:nth-child(1)
      font-weight 500
      color #0071e3
      width 45%

      b
        display flex
        align-items center
        gap 8px
        white-space nowrap

        code
          font-size 12px
          color #0071e3
          padding 3px 8px
          border-radius 6px
          white-space nowrap

    td:nth-child(2)
      width 20%
      text-align center

      b
        display inline-flex
        align-items center
        justify-content center
        width 48px
        height 48px
        border-radius 8px
        border 1px solid #00000008
        background-image:
          linear-gradient(45deg, #f0f0f0 25%, transparent 25%, transparent 75%, #f0f0f0 75%, #f0f0f0),
          linear-gradient(45deg, #f0f0f0 25%, #ffffff 25%, #ffffff 75%, #f0f0f0 75%, #f0f0f0)
        background-size 12px 12px
        background-position 0 0, 6px 6px
        box-shadow 0 2px 8px #0000000a
        overflow hidden
        user-select none

        img
          max-width 32px
          max-height 32px
          object-fit contain
          transition transform 0.2s ease
          user-select none
          pointer-events none

        &:hover
          img
            transform scale(1.15)

    td:nth-child(3)
      width 35%

      code
        font-size 12px
        color #515154
        padding 3px 8px
        border-radius 6px
        border 1px solid #00000003
        white-space nowrap

  @media $mobile
    border-radius 16px
    padding var(--gap) 20px
    overflow-x auto

    table
      font-size 12px

      th, td
        padding 8px 12px

        &:first-child
          padding-left 0

        &:last-child
          padding-right 0
</style>