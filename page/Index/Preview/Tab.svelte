<script>
import Select from "~/page/Index/Preview/Select.svelte";

let {
  active = $bindable(),
  cdn = $bindable(),
  cdn_li = [],
  runner = $bindable(),
  runner_li = [],
  onChange,
} = $props();

const cdn_opt = $derived(cdn_li.map((key) => ({ label: key, value: key }))),
  runner_opt = $derived(runner_li.map((item) => ({ label: item.split(" ")[0], value: item })));
</script>

<template lang="pug">
nav
  Select(
    label="在线引用"
    mode={ 0 }
    bind:active={ active }
    bind:value={ cdn }
    li={ cdn_opt }
    onChange!={ onChange.bind(null, 0) }
  )
  Select(
    label="打包构建"
    mode={ 1 }
    bind:active={ active }
    bind:value={ runner }
    li={ runner_opt }
    onChange!={ onChange.bind(null, 1) }
  )
</template>

<style lang="stylus">
nav
  display inline-flex
  align-items center
  margin-left -4px
  gap 8px
</style>