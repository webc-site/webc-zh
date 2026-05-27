<script>
import { onMount } from "svelte";
import cdn from "~/conf/web/cdn.npm.js";
import cdn_pkg from "~/conf/web/npm/CDN_PKG.js";
import cli from "~/conf/web/npm/CLI.js";
import ver from "~/conf/web/ver/webc.site.js";
import Code from "~/page/Index/Preview/Import/Code.svelte";
import Fiddle from "~/page/Index/Preview/Fiddle.svelte";
import Tab from "~/page/Index/Preview/Tab.svelte";

let { name, files = [] } = $props();

const MODE_DIRECT = 0,
  MODE_BUILD = 1,
  CDN_LI = Object.keys(cdn),
  RUNNER_LI = ["bunx", "npx", "pnpm dlx", "yarn dlx"],
  IMPORT_MODE = "import_mode",
  CDN = "cdn",
  CLI_RUNNER = "cli_runner";

let active_cdn = $state(CDN_LI[0]),
  active_runner = $state(RUNNER_LI[0]),
  mode = $state(MODE_DIRECT);

const onChange = (new_mode, value) => {
  localStorage.setItem(IMPORT_MODE, new_mode);
  if (new_mode == MODE_DIRECT) {
    localStorage.setItem(CDN, value);
  } else if (new_mode == MODE_BUILD) {
    localStorage.setItem(CLI_RUNNER, value);
  }
};

onMount(() => {
  const stored_mode = localStorage.getItem(IMPORT_MODE);
  if (stored_mode != null) {
    const val = Number(stored_mode);
    if ([MODE_DIRECT, MODE_BUILD].includes(val)) {
      mode = val;
    }
  }

  const stored_cdn = localStorage.getItem(CDN);
  if (stored_cdn && CDN_LI.includes(stored_cdn)) {
    active_cdn = stored_cdn;
  }

  const stored_runner = localStorage.getItem(CLI_RUNNER);
  if (stored_runner && RUNNER_LI.includes(stored_runner)) {
    active_runner = stored_runner;
  }
});

const urls_text = $derived.by(() => {
    const css_lines = [],
      js_lines = [];
    for (const file of files) {
      const line = file.replace("$URL", cdn[active_cdn](cdn_pkg, ver));
      if (line.trim().startsWith("<")) {
        css_lines.push(line.trim());
      } else {
        js_lines.push(line);
      }
    }
    let text = css_lines.join("\n");
    if (js_lines.length > 0) {
      if (text) text += "\n";
      text += '<script type="module">' + js_lines.join("\n") + "</" + "script>";
    }
    return text;
  }),
  cli_text = $derived(active_runner + " " + cli + "@latest " + name);
</script>

<template lang="pug">
+if files.length > 0
  article.Lg
    h2
      b
        Tab(
          bind:active={ mode }
          bind:cdn={ active_cdn }
          cdn_li={ CDN_LI }
          bind:runner={ active_runner }
          runner_li={ RUNNER_LI }
          onChange!={ onChange }
        )
      Fiddle(name={ name } urls_text={ urls_text } cdn={ active_cdn })
    Code(text={ mode == MODE_DIRECT ? urls_text : cli_text })
</template>

<style lang="stylus">
@import '~/styl/var.styl'

.Lg
  @media $mobile
    &::before, &::after
      display none

article
  position relative
  z-index 2
  border-radius 24px
  padding var(--gap)
  box-sizing border-box
  line-height normal
  width 100%

  h2
    font-size 15px
    font-weight 600
    color #1d1d1f
    margin 0 0 16px
    display flex
    align-items center
    justify-content space-between

    > b
      display flex
      align-items center
      gap 12px

  @media $mobile
    border-radius 16px
    padding 0 var(--gap) var(--gap)
</style>