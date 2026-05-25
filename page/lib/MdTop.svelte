<script>
import Github from "~/page/lib/MdGithub.svelte";

let { name = "", title = "", url = "" } = $props();
</script>

<template lang="pug">
+if name
  b
    h1
      | {name}
      +if title
        b {title}
    Github(url={ url })
</template>

<style lang="stylus">
@import '~/styl/var.styl'

b
  display flex
  align-items center
  justify-content space-between
  gap 16px
  margin 0 0 var(--gap)

  @media $mobile
    align-items flex-start

  :global(a)
    @media $mobile
      margin-right 44px

h1
  display flex
  align-items baseline
  gap 12px
  font-size 28px
  font-weight 700
  color #1d1d1f
  line-height 1.2
  margin 0

  b
    font-size 16px
    font-weight 400
    color #86868b
    margin-bottom 0

  @media $mobile
    font-size 22px

    b
      font-size 13px
</style>