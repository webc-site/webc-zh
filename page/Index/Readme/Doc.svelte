<script>
import { GIT_HOME } from "~/sh/example/conf/web/url/CODE.js";
import Md from "~/page/lib/Md.svelte";
import Github from "~/page/lib/MdGithub.svelte";

let { name, readme, scrollTo = $bindable() } = $props(),
  article_el = $state(null);

const url = $derived(GIT_HOME),
  sections = $derived(Array.isArray(readme) ? readme : []);

scrollTo = (idx) => {
  if (!article_el) return;
  const target = article_el.querySelector("#section-" + idx);
  if (target) {
    target.scrollIntoView({ behavior: "smooth", block: "start" });
  }
};
</script>

<template lang="pug">
c-vs
  b
    article(bind:this={ article_el })
      +each sections as [level, title, body], idx
        section(id="section-{idx}")
          +if level == 1
            b
              h1 {name}
              Github(url={ url })
          +if level == 2
            h2 {title}
          +if level == 3
            h3 {title}
          +if level == 4
            h4 {title}
          +if level == 5
            h5 {title}
          +if level == 6
            h6 {title}
          +if body
            Md(readme={ body })
</template>

<style lang="stylus">
@import '~/styl/var.styl'
@import '~/page/Index/styl'

c-vs
  flex 1
  min-width 0
  min-height 0

  &::part(scroll)
    box-sizing border-box
    overflow-x hidden

  > b
    display block
    line-height 1.7
    color #333336
    padding var(--gap) var(--gap) var(--gap) 0
    box-sizing border-box

    @media $mobile
      padding var(--gap) 0

    article
      padding 0 0 var(--gap)
      box-sizing border-box
      max-width 800px
      margin 0 auto

      section
        display block

      h2, h3, h4, h5, h6
        margin-top 24px
        margin-bottom 16px

      h2
        @extend $h2

      h3
        @extend $h3

      h4
        @extend $h4

      h5
        @extend $h5

      h6
        @extend $h6

      section > b
        display flex
        align-items center
        justify-content space-between
        gap 16px
        margin-bottom var(--gap)

        @media $mobile
          align-items flex-start

        :global(a)
          @media $mobile
            margin-right 44px

        h1
          font-size 28px
          font-weight 700
          color #1d1d1f
          line-height 1.2
          margin 0

          @media $mobile
            font-size 22px

    @media $mobile
      font-size 14px

      article
        padding 0 20px var(--gap)
</style>