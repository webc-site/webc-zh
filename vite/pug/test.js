#!/usr/bin/env bun

import pugHack from "~/vite/pug/hack.js";

let pug = `p >mail_or_phone
  |>test
  | > test
  | >mail >or >phone

+if 1

  form(
    on:change=change
    @change=change
    @click={reset.call(this)}
    @click={signin(1)}
    @click={signin=1}
    src:url
    class:red=abc
    class:red
    @&ref
    alt:
  )
  h2(class:red=abc)
  +elif x == 1
    b 3

form(value:test @click=hi @submit)
input(type="checkbox" checked&me autocomplete="{ up ? 'off' : null }")
Test(@message)

mixin p_input(placeholder)
  li
    input(
      type="text"
      placeholder=" "
    )&attributes(attributes)
    label(for!=attributes.id)!= placeholder
+each li as [c,r,d,n]
  tr {sign(n)}

+p_input(>mail)(type="email" &mail)#i-user-mail
+each _LANG as i
  a(@click={c(i[1])} class:n={i[1]==NOW}) {i[0]}
i {(i[1]/100).toFixed(2)} EUR
select(@change=change)
+if md != undefined
  Scroll(@&S)
    +if A
      Side
        Toc(A:)
    b
      Mc
        MdTxt(@&M md:md)
      i-t.F foot
  +else
    Wait
form(@&form @submit)
  u`;

pug = `MdTxt(@&M @click=xx md:md bind:xxx=md this={xx})
i-t.F foot
a(href={'//'+host})
b(@&b class:Wait=!tip)`;

console.log(pugHack(pug, "src/Index.svelte"));
