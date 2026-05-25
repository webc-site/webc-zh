<script>
import MdDoc from "~/page/Index/MdDoc.svelte";
import Preview from "~/page/Index/Preview/Preview.svelte";

let { info } = $props(),
  readme = $state(""),
  svgs = $state.raw([]),
  files = $state.raw([]),
  demo = $state.raw(null),
  loading = $state(true);

$effect(() => {
  const load_func = info?.[2];
  if (load_func) {
    loading = true;
    load_func().then(async (m) => {
      const [com_readme, demo_func, com_svgs, com_files] = m.default;
      readme = com_readme;
      svgs = com_svgs || [];
      files = com_files || [];
      if (demo_func) {
        const demo_mod = await demo_func();
        demo = demo_mod.default;
      } else {
        demo = null;
      }
      loading = false;
    });
  }
});
</script>

<template lang="pug">
+if loading
  b.wait
  +else
    MdDoc(
      name={ info[0] }
      title={ info[1] }
      readme={ readme }
      svgs={ svgs }
    )
    b.divider
    b.right
      Preview(name={ info[0] } active_demo={ demo } files={ files })
</template>

<style lang="stylus">
@import '~/styl/var.styl'

.wait
  margin auto

.divider
  display none

  @media $narrow
    display block
    height 2px
    width 100%
    background url('/svg/divider.svg') no-repeat center / 100% 100%
    margin 8px 0

.right
  display flex
  flex-direction column
  flex 1
  min-width 0
  min-height 0
  gap var(--gap)
  padding 0
  box-sizing border-box

@media $narrow
  :global(v-scroll)
    flex 1
    min-height 260px
    mask-image linear-gradient(to bottom, #000 calc(100% - var(--gap)), transparent 100%)

  .right
    flex 1
    min-height 200px
    gap var(--gap)
    padding 0
</style>