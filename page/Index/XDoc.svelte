<script>
import codeUrl from "~/sh/example/conf/web/url/CODE.js";
import readme from "~/gen/x_readme.js";
import list from "~/gen/x.js";
import Md from "~/page/lib/Md.svelte";
import Github from "~/page/lib/MdGithub.svelte";
import Top from "~/page/lib/MdTop.svelte";

const readme_title = readme[0],
  readme_desc = readme[1],
  parseDoc = (doc) => {
    if (!doc) {
      return [];
    }
    const lines = doc.split("\n"),
      sections = [];
    let current = null;
    for (const line of lines) {
      if (line.startsWith("## ") && line.indexOf(":") >= 0) {
        if (current) {
          sections.push(current);
        }
        const idx = line.indexOf(":");
        let name = line.slice(3, idx).trim();
        if (name.startsWith("`") && name.endsWith("`")) {
          name = name.slice(1, -1);
        }
        const desc = line.slice(idx + 1).trim();
        current = [0, name, desc, []];
      } else {
        if (!current) {
          current = [1, "", "", []];
        }
        current[3].push(line);
      }
    }
    if (current) {
      sections.push(current);
    }
    return sections.map((s) => [s[0], s[1], s[2], s[3].join("\n").trim()]);
  };
</script>

<template lang="pug">
c-vs
  b
    article
      Top(
        name={ readme_title }
        title={ readme_desc }
        url={ codeUrl(readme_title) }
      )

      b.util-list
        +each list as [name, title, doc, code]
          details
            summary
              b
                h2 {name}
                b {title}
              b
                i.icon-arrow

            b
              +if doc
                +each parseDoc(doc) as [type, name, desc, body]
                  +if type == 0
                    h2.title
                      code {name}
                      b {desc}
                    +if body
                      Md(readme={ body })
                  +if type != 0
                    +if body
                      Md(readme={ body })
              h3.code-header
                | 源代码
                Github(url!={ codeUrl('x/' + name + '.js') })
              b
                Md(readme="```javascript\n{code}\n```")
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

      .util-list
        display flex
        flex-direction column
        gap var(--gap)
        margin-top var(--gap)

        details
          display flex
          flex-direction column
          border-radius 16px
          border 1px solid #0000000a
          background #ffffff55
          backdrop-filter blur(20px)
          box-shadow 0 4px 12px #00000003, inset 0 1px 1px #ffffffb3
          overflow hidden
          transition all 0.25s ease

          &:hover
            background #ffffff80
            border-color #00000010
            box-shadow 0 8px 24px #00000008

          &[open]
            .icon-arrow
              transform rotate(180deg)
              filter opacity(80%)

          summary
            display flex
            align-items center
            justify-content space-between
            padding var(--gap)
            background #00000002
            gap var(--gap)
            cursor pointer
            user-select none
            outline none
            list-style none
            transition background-color 0.25s ease

            &::-webkit-details-marker
              display none

            &:hover
              background #00000006

            > b:first-child
              display flex
              align-items baseline
              gap 12px
              flex-wrap wrap

              h2
                font-variation-settings 'wght' 900
                color #1d1d1f
                margin 0

              b
                font-size 13px
                color #86868b
                font-weight 400

            > b:last-child
              display flex
              align-items center
              gap 16px
              flex-shrink 0

              .icon-arrow
                width 16px
                height 16px
                background url('/svg/down.svg') no-repeat center / contain
                filter opacity(40%)
                transition transform 0.25s cubic-bezier(0.4, 0, 0.2, 1), filter 0.25s ease

          > b
            display block
            padding var(--gap)
            border-top 1px solid #00000005
            background #ffffff22
            animation fadeIn 0.25s ease
            font-variation-settings 'wght' 300

            :global(h2)
              @extend $h2

              margin 0

            .title
              @extend $h2

              display flex
              align-items baseline
              gap 12px
              margin 0
              margin-bottom 16px
              flex-wrap wrap

              @media $mobile
                gap 8px
                margin-bottom 8px

              code
                font-size 15px
                color #0071e3
                border 1px solid #0071e322
                background linear-gradient(135deg, #0071e309, #0071e31a)
                padding 3px 8px
                border-radius 6px
                font-family var(--font-mono)
                font-weight 600
                font-variation-settings 'wght' 600

                @media $mobile
                  font-size 13px
                  padding 2px 6px

              b
                font-size 15px
                color #6e7681
                font-weight 300
                font-variation-settings 'wght' 300

                @media $mobile
                  font-size 13px
                  margin-left 0
                  width 100%

            :global(h3)
              @extend $h3

              color #666
              font-size 14px
              margin 8px 0

            .code-header
              display flex
              align-items center

              :global(a)
                width 16px
                height 16px
                border none
                background none
                backdrop-filter none
                box-shadow none
                color #86868b
                padding 0
                margin-top 1px
                transition all 0.25s ease
                margin-left 8px

                &::before
                  width 16px
                  height 16px

                &:hover
                  color #0071e3
                  background none
                  transform none
                  box-shadow none
                  transform scale(1.2)

            :global(pre)
              margin-top 0
              margin-bottom 0

    @media $mobile
      font-size 14px

      article
        padding 0 20px var(--gap)

@keyframes fadeIn
  from
    opacity 0
    transform translateY(-4px)

  to
    opacity 1
    transform translateY(0)
</style>