import { onLang } from "x/i18n.js";

const container = document.getElementById("btn-container"),
  text = document.getElementById("lang-text");

if (container && text) {
  const lang_names = {
    0: "English",
    1: "中文",
    2: "Deutsch",
    3: "日本語",
    4: "Français",
  };

  const btn = I18n();

  onLang((idx) => {
    text.innerText = (lang_names[idx] || "语言 " + idx) + " (索引: " + idx + ")";
  });

  container.appendChild(btn);
}
