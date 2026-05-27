import { onLang, LANG_LI } from "x/i18n.js";
import { D } from "x/dom.js";

const lang_names = [
  ["English", 0],
  ["中文", 1],
  ["Deutsch", 2],
  ["日本語", 3],
  ["Français", 4],
];
LANG_LI.splice(0, LANG_LI.length, ...lang_names);

onLang((val) => {
  const text = D.getElementById("lang-text"),
    idx = val ?? 1,
    item = lang_names.find(([, id]) => id == idx);

  if (text) text.innerText = (item ? item[0] : "语言 " + idx) + " (索引: " + idx + ")";
});
