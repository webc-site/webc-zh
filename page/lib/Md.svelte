<script>
import mdRender from "~/js/mdRender.js";

let { readme } = $props(),
  element = $state(null);

$effect(() => {
  mdRender(element, readme);
});
</script>

<template lang="pug">
b(bind:this={ element })
</template>

<style lang="stylus">
@import '~/styl/var.styl'

b
  display block
  text-autospace auto
  text-spacing-trim auto
  overflow-wrap break-word

  :global(h1), :global(h2), :global(h3), :global(h4)
    color #1d1d1f
    font-weight 300
    font-variation-settings 'wght' 300
    margin-top 24px
    margin-bottom 16px

    :global(code)
      font-size 0.85em
      vertical-align middle
      padding 1px 6px
      position relative
      top -1px

  :global(h1)
    font-size 26px

  :global(h2)
    font-size 20px

  :global(h3)
    font-size 16px

  :global(p)
    margin-bottom 16px
    line-height 1.7
    text-align justify
    text-justify inter-character

  :global(ul), :global(ol)
    margin-bottom 16px
    padding-left 16px
    line-height 1.7

    :global(ul), :global(ol)
      padding-left 20px
      margin-top 8px
      margin-bottom 0

  :global(ul)
    list-style-type disc

  :global(ol)
    list-style-type decimal

  :global(li)
    margin-bottom 8px
    padding-left 4px
    color #333336

  :global(li::marker)
    color #86868b

  :global(em)
    font-style normal
    text-emphasis filled circle
    text-emphasis-position under

  :global(blockquote:not(.alert))
    margin 20px 0
    padding 10px 16px
    border-left 4px solid #e5e7eb
    color #6e7681

  :global(code)
    font-size 13px
    padding 2px 6px
    border-radius 4px
    color #1b6e30
    border 1px solid #30d15822
    background linear-gradient(135deg, #30d1580c, #24b24b1c)

  :global(pre)
    border 1px solid #00000012
    border-radius 12px
    padding 14px 16px
    overflow-x auto
    margin-bottom 20px
    margin-top 12px
    background #ffffff80
    backdrop-filter blur(25px) saturate(180%)
    box-shadow inset 0 1px 0 0 #ffffffa6, 0 4px 12px #00000005

    :global(code)
      background transparent
      border 0
      padding 0
      border-radius 0
      color #1d1d1f
      line-height 1.6

    //Modern Light syntax coloring:
    :global(.token.comment), :global(.token.prolog), :global(.token.doctype), :global(.token.cdata)
      color #86868b
      font-style italic

    :global(.token.punctuation)
      color #6e7681

    :global(.token.keyword), :global(.token.tag), :global(.token.operator)
      color #ad208e

    :global(.token.keyword)
      font-weight 600

    :global(.token.string), :global(.token.char), :global(.token.attr-value)
      color #248a3d

    :global(.token.number), :global(.token.boolean)
      color #1c00cf

    :global(.token.function)
      color #0071e3

    :global(.token.class-name), :global(.token.maybe-class-name), :global(.token.selector)
      color #5c2699

    :global(.token.attr-name)
      color #8a3ffc

    :global(.token.property)
      color #1d1d1f

    :global(.token.regex)
      color #c41a16

  :global(pre[class*='language-']), :global(code[class*='language-']), :global(:not(pre) > code[class*='language-'])
    background transparent

  :global(a)
    position relative
    z-index 1
    color #3b3dbf
    text-decoration none
    padding-bottom 7px
    margin-bottom -4px
    box-decoration-break clone
    background-image url('/svg/wave.svg'), linear-gradient(90deg, #ffd60a99 0, #ff9f0a33 100%)
    background-repeat repeat-x, no-repeat
    background-size 12px 6px, 0 0.45em
    background-position 0 100%, 0 70%
    transition color 0.25s ease, background-size 0.25s cubic-bezier(0.4, 0, 0.2, 1)

    &:hover
      color #ff6200
      background-image url('/svg/waveOrange.svg'), linear-gradient(90deg, #ffd60a99 0, #ff9f0a33 100%)
      background-size 12px 0, 100% 0.45em

  :global(blockquote.alert)
    margin 20px 0
    padding 16px 20px 16px 52px
    border-radius 12px
    box-sizing border-box
    position relative
    backdrop-filter blur(20px) saturate(180%)
    box-shadow 0 4px 12px #00000003

    :global(.alert-title)
      position absolute
      left 16px
      top 18px
      font-size 0
      margin 0
      padding 0

      :global(.alert-icon)
        display block
        width 22px
        height 22px
        mask-size contain
        mask-repeat no-repeat
        mask-position center
        flex-shrink 0

    :global(p)
      margin 0
      color #1d1d1f

      &:not(:last-child)
        margin-bottom 8px

  :global(blockquote.alert-note)
    background linear-gradient(135deg, #5ac8fa05, #0071e30a)

    :global(.alert-icon)
      mask-image url('/svg/note.svg')
      background linear-gradient(135deg, #5ac8fa, #0071e3)

  :global(blockquote.alert-tip)
    background linear-gradient(135deg, #ffd60a08, #ff9f0a0e)

    :global(.alert-icon)
      mask-image url('/svg/tip.svg')
      background linear-gradient(135deg, #ffd60a, #ff9f0a)

  :global(blockquote.alert-important)
    background linear-gradient(135deg, #f1a7ff05, #af52de0a)

    :global(.alert-icon)
      mask-image url('/svg/important.svg')
      background linear-gradient(135deg, #f1a7ff, #af52de)

  :global(blockquote.alert-warning)
    background linear-gradient(135deg, #ffdb4d05, #ff95000a)

    :global(.alert-icon)
      mask-image url('/svg/warning.svg')
      background linear-gradient(135deg, #ffdb4d, #ff9500)

  :global(blockquote.alert-caution)
    background linear-gradient(135deg, #ff95b305, #ff3b300a)

    :global(.alert-icon)
      mask-image url('/svg/caution.svg')
      background linear-gradient(135deg, #ff95b3, #ff3b30)

  :global(table)
    background linear-gradient(0, #ffffff26, #ffffff73)
    border 1px solid #0000001f
    border-collapse collapse
    box-shadow 0 0 3px #00000014 inset
    margin 16px 0
    text-align center
    width 100%

    :global(td), :global(tr)
      position relative

      &:before
        content ''
        opacity 0.4
        position absolute

    :global(tr)
      &:before
        background url('/svg/hlineS.svg') repeat-x
        height 1px
        left 0
        right 0

      &:first-child:before
        background none

    :global(td)
      &:before
        background url('/svg/vlineS.svg') repeat-y
        bottom 0
        left 0
        top 0
        width 1px

      &:first-child:before
        background none

    :global(thead)
      position relative
      background linear-gradient(0, #ffffff1f, #ffffff61)
      box-shadow 0 0 3px #00000014 inset

      &:after
        content ''
        opacity 0.4
        position absolute
        left 0
        right 0
        bottom 0
        height 1px
        background url('/svg/hline-solid.svg') no-repeat
        background-size 100% 100%

    :global(tbody > tr > td), :global(thead > tr > th)
      border none
      padding 16px

  :global(summary + table)
    margin-top -16px

    :global(thead)
      box-shadow none

    :global(tbody > tr:first-child::before)
      background url('/svg/hline.svg') repeat-x

  :global(details > table)
    border 0

    &:last-child
      margin-bottom -8px

  @media $mobile
    :global(h1)
      font-size 20px

    :global(h2)
      font-size 17px

    :global(pre)
      padding 12px
      border-radius 8px
      font-size 12px

    :global(blockquote.alert)
      padding 12px 14px 12px 42px
      border-radius 8px

      :global(.alert-title)
        left 12px
        top 13px

        :global(.alert-icon)
          width 18px
          height 18px
</style>