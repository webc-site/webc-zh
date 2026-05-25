<script>
import { onMount } from "svelte";
import { routeDelay } from "x/routeDelay.js";
import coms from "~/gen/com/index.js";
import Aside from "~/page/Index/Aside.svelte";
import MenuToggle from "~/page/lib/MenuToggle.svelte";

const PAGE_HOME = -2,
  PAGE_X = -3;

let active_index = $state(-1),
  aside_open = $state(false),
  ActivePage = $state(null);

const active_comp_info = $derived(coms[active_index]),
  toggleAside = () => {
    aside_open = !aside_open;
  };

onMount(() => {
  return routeDelay(async (url) => {
    aside_open = false;
    ActivePage = null;
    let mod;
    if (!url) {
      active_index = PAGE_HOME;
      mod = await import("~/page/Index/Home.svelte");
    } else {
      const lower_url = url.toLowerCase();
      if (lower_url == "x") {
        active_index = PAGE_X;
        mod = await import("~/page/Index/X.svelte");
      } else {
        const index = coms.findIndex(([name]) => name.toLowerCase() == lower_url);
        active_index = index == -1 ? PAGE_HOME : index;
        if (index == -1) {
          mod = await import("~/page/Index/Home.svelte");
        } else {
          mod = await import("~/page/Index/Com.svelte");
        }
      }
    }
    ActivePage = mod.default;
  });
});
</script>

<template lang="pug">
main
  +if !aside_open
    MenuToggle(onclick!={ toggleAside })
  Aside(
    bind:active_index={ active_index }
    bind:aside_open={ aside_open }
    class!={ aside_open ? 'show' : '' }
  )
  section
    +if !ActivePage
      b.wait
      +else
        b.wrap
          ActivePage(info={ active_comp_info })
</template>

<style lang="stylus">
@import '~/styl/var.styl'

main
  display flex
  height 100dvh
  width 100vw
  background url('/svg/bg.svg') no-repeat center / cover
  color #1d1d1f
  overflow hidden
  gap var(--gap)
  box-sizing border-box
  position relative

section
  flex 1
  display flex
  flex-direction column
  overflow hidden

  .wait
    margin auto

  .wrap
    flex 1
    display flex
    gap var(--gap)
    overflow hidden

@media $mobile
  padding 0
</style>