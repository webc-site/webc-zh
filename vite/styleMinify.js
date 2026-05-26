import { transform } from "lightningcss";

export default () => ({
  name: "minify-html-styles",
  transformIndexHtml: {
    order: "post",
    handler: (html) =>
      html.replace(
        /(<style[^>]*>)([\s\S]*?)(<\/style>)/gi,
        (match, open_tag, css_content, close_tag) => {
          const { code } = transform({
            filename: "inline.css",
            code: Buffer.from(css_content),
            minify: true,
            sourceMap: false,
          });
          return open_tag + code.toString() + close_tag;
        },
      ),
  },
});
