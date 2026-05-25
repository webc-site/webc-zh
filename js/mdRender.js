import { default_renderer, parser, parser_write, parser_end } from "streaming-markdown";
import Prism from "prismjs";
import "prismjs/themes/prism.css";
import "prismjs/components/prism-pug.js";
import "prismjs/components/prism-stylus.js";

Prism.languages.svelte = Prism.languages.markup;

export default (element, readme) => {
  if (!element || !readme) {
    return;
  }

  element.innerHTML = "";
  const renderer = default_renderer(element),
    p = parser(renderer);
  parser_write(p, readme);
  parser_end(p);

  element.querySelectorAll("pre code").forEach((el) => {
    const classes_to_add = [];
    el.classList.forEach((cls) => {
      if (!cls.startsWith("language-") && !cls.startsWith("lang-")) {
        classes_to_add.push("language-" + cls);
      }
    });
    classes_to_add.forEach((cls) => {
      el.classList.add(cls);
      if (el.parentElement && el.parentElement.tagName == "PRE") {
        el.parentElement.classList.add(cls);
      }
    });
    Prism.highlightElement(el);
  });

  element.querySelectorAll("blockquote").forEach((bq) => {
    const first_child = bq.firstElementChild || bq,
      html = first_child.innerHTML;
    if (html) {
      const match = html.match(
        /^(?:\[!(TIP|NOTE|WARNING|IMPORTANT|CAUTION)\]|<a>!(TIP|NOTE|WARNING|IMPORTANT|CAUTION)<\/a>)\s*(?:<br\s*\/?>)?/i,
      );
      if (match) {
        const type = (match[1] || match[2]).toUpperCase(),
          clean_html = html.slice(match[0].length).trim(),
          header = document.createElement("b"),
          icon_el = document.createElement("i");

        if (clean_html == "") {
          first_child.remove();
        } else {
          first_child.innerHTML = clean_html;
        }

        bq.classList.add("alert", "alert-" + type.toLowerCase());
        icon_el.className = "alert-icon";
        header.className = "alert-title";
        header.appendChild(icon_el);
        header.appendChild(document.createTextNode(" " + type));
        bq.insertBefore(header, bq.firstChild);
      }
    }
  });
};
