import { onLang } from "x/i18n.js";
import { D } from "x/dom.js";

const container = D.getElementById("btn-container"),
  text = D.getElementById("lang-text");

if (container && text) {
  const lang_names = [
      ["English", 0],
      ["中文", 1],
      ["Deutsch", 2],
      ["日本語", 3],
      ["Français", 4],
    ],
    btn = i18n(lang_names.forEach.bind(lang_names));

  onLang((val) => {
    const idx = val?.[1] ?? 1;
    const item = lang_names.find(([, id]) => id == idx);
    text.innerText = (item ? item[0] : "语言 " + idx) + " (索引: " + idx + ")";
  });

  container.appendChild(btn);
}
