import { mount } from "svelte";
import { B } from "x/dom.js";
import Index from "~/page/entry/Index.svelte";
mount(Index, { target: B });
import "~/page/entry/init.js";
