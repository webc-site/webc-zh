<script>
import { onMount } from "svelte";
import ReadmeDoc from "~/page/Index/Readme/Doc.svelte";
import ReadmeToc from "~/page/Index/Readme/Toc.svelte";

let readme_name = $state(""),
  readme_content = $state.raw([]),
  loading = $state(true),
  scrollToHeading = $state(null);

const readme_toc = $derived(
  readme_content.map((sec, idx) => [...sec, idx]).filter(([level]) => level >= 2),
);

onMount(async () => {
  const m = await import("../../gen/com/readme.js");
  readme_content = m.default;
  readme_name = readme_content[0]?.[1] || "WebC.site";
  loading = false;
});
</script>

<template lang="pug">
+if loading
  b.wait
  +else
    ReadmeDoc(
      name={ readme_name }
      readme={ readme_content }
      bind:scrollTo={ scrollToHeading }
    )
    +if readme_toc.length
      ReadmeToc(toc={ readme_toc } onclick={ scrollToHeading })
</template>

<style lang="stylus">
.wait
  margin auto
</style>