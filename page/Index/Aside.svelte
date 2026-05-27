<script>
import coms from "~/gen/com/index.js";
import readme from "~/gen/x_readme.js";
import Header from "~/page/Index/Aside/Header.svelte";
import Search from "~/page/Index/Aside/Search.svelte";

const HIGHLIGHT_KEY = "search-match",
  PAGE_X = -3;

let { active_index = $bindable(), aside_open = $bindable(), class: className = "" } = $props(),
  search_query = $state(""),
  nav_el = $state(null),
  touch_start_x = 0,
  touch_start_y = 0;

const onTouchStart = (e) => {
    if (e.touches && e.touches[0]) {
      touch_start_x = e.touches[0].clientX;
      touch_start_y = e.touches[0].clientY;
    }
  },
  onTouchEnd = (e) => {
    if (e.changedTouches && e.changedTouches[0]) {
      const touch = e.changedTouches[0],
        dx = touch.clientX - touch_start_x,
        dy = touch.clientY - touch_start_y;
      if (Math.abs(dx) > Math.abs(dy) * 1.5 && Math.abs(dx) > 50) {
        aside_open = false;
      }
    }
  };

const filtered_comps = $derived(
  (() => {
    const q = search_query.trim().toLowerCase(),
      kws = q ? q.split(/\s+/) : [];
    return coms
      .map((c, i) => [c, i])
      .filter(([[name, desc]]) => {
        if (!kws.length) return true;
        const n = name.toLowerCase(),
          d = desc.toLowerCase();
        return kws.some((kw) => n.includes(kw) || d.includes(kw));
      });
  })(),
);

$effect(() => {
  const _ = filtered_comps;
  if (!nav_el) return;
  if (typeof CSS == "undefined" || !CSS.highlights) return;

  CSS.highlights.delete(HIGHLIGHT_KEY);

  const q = search_query.trim().toLowerCase(),
    kws = q ? q.split(/\s+/).filter(Boolean) : [];
  if (!kws.length) return;

  const ranges = [],
    walk = document.createTreeWalker(nav_el, NodeFilter.SHOW_TEXT);
  let node;
  while ((node = walk.nextNode())) {
    if (node.parentElement?.matches("a > b:nth-child(3)")) continue;

    const text = node.textContent.toLowerCase();

    for (const kw of kws) {
      let pos = 0;
      while ((pos = text.indexOf(kw, pos)) != -1) {
        const range = new Range();
        range.setStart(node, pos);
        range.setEnd(node, pos + kw.length);
        ranges.push(range);
        pos += kw.length;
      }
    }
  }

  if (ranges.length) {
    const highlight = new Highlight(...ranges);
    CSS.highlights.set(HIGHLIGHT_KEY, highlight);
  }
});
</script>

<template lang="pug">
aside(class!={ className } ontouchstart!={ onTouchStart } ontouchend!={ onTouchEnd })
  c-vs
    nav(bind:this={ nav_el })
      Header(active_index={ active_index })
      Search(bind:search_query={ search_query })
      b.x-nav
        a(href="/x" class!={ active_index == PAGE_X ? 'active' : '' })
          b →
          b x
          b {readme[1]}
      b.nav-list
        +each filtered_comps as [[name, desc], idx]
          a(href!={ '/' + name } class!={ idx == active_index ? 'active' : '' })
            b →
            b {name}
            b {desc}
</template>

<style lang="stylus">
@import '~/styl/var.styl'

aside
  width 248px
  display flex
  flex-direction column
  flex-shrink 0
  box-sizing border-box

  c-vs
    flex 1
    min-height 0

    &::part(scroll)
      box-sizing border-box
      padding-left var(--gap)

  nav
    width 100%
    padding var(--gap) 0
    display flex
    flex-direction column
    box-sizing border-box

  .nav-list, .x-nav
    display flex
    flex-direction column
    gap 6px

    a
      box-sizing border-box
      padding 12px 16px
      font-size 14px
      border-radius 10px
      transition all 0.25s cubic-bezier(0.4, 0, 0.2, 1)
      display flex
      flex-direction column
      align-items stretch
      gap 4px
      background #ffffff66
      border 1px solid #00000008
      color #1d1d1f
      text-align left
      cursor pointer
      position relative
      text-decoration none
      box-shadow 0 1px 2px #00000005

      &:hover, &.active
        padding-right 38px

      &:hover
        background #ffffffb3
        border-color #0000000f
        box-shadow 0 4px 12px #0000000a
        transform translateY(-1px)

        > b:nth-child(1)
          opacity 1
          transform translateX(0)

      &.active
        background #0071e314
        border-color #0071e333
        color #0071e3
        box-shadow inset 0 1px 1px #ffffff80

        > b:nth-child(2)
          color #0071e3

        > b:nth-child(3)
          color #0071e3cc

        > b:nth-child(1)
          opacity 1
          color #0071e3
          transform translateX(0)

      > b
        &:nth-child(1)
          position absolute
          right 12px
          left auto
          top 50%
          margin-top -8px
          opacity 0
          transform translateX(6px)
          transition all 0.25s ease

        &:nth-child(2)
          font-size 15px
          font-weight 600

        &:nth-child(3)
          font-size 12px
          color #86868b
          white-space nowrap
          overflow hidden
          text-overflow ellipsis
          font-weight 400
          transition color 0.25s ease

  .x-nav
    margin-top 12px

  .nav-list
    margin-top 6px

  @media $mobile
    position fixed
    top 0
    right 0
    bottom 0
    left auto
    width 280px
    max-width 85%
    z-index 100
    background #f5f5f7ee
    backdrop-filter blur(40px)
    transform translateX(100%)
    transition transform 0.35s cubic-bezier(0.4, 0, 0.2, 1)
    padding 0

    c-vs
      &::part(scroll)
        padding-left 0

    nav
      padding 16px 16px 32px

    &.show
      transform translateX(0)

:global(::highlight(search-match))
  background #ffe066
  color #000000
</style>