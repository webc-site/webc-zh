import XBox from "../XBox/XBox.js";
import { On } from "x/On.js";
import { newEl } from "x/dom.js";
import { langGet, langSet, LANG_LI } from "x/i18n.js";
import { cE } from "x/cE.js";

const LG = " Lg",
  BTN_LG = "Btn" + LG;

const open = () => {
  const dialog = XBox(),
    [main, title, btn_container] = ["main", "h6", "b"].map(newEl),
    cur_lang = langGet() ?? 0;

  main.className = "I18n" + LG;
  title.innerText = "请选择页面语言";

  btn_container.append(
    ...LANG_LI.map(([name, id]) => {
      const button = newEl("button");
      button.innerText = name;
      button.className = cur_lang == id ? BTN_LG + " Main" : BTN_LG;
      On(button, {
        click: () => {
          langSet(id);
          dialog.close();
        },
      });
      return button;
    }),
  );
  main.append(title, btn_container);
  dialog.append(main);
};

cE(
  "i18n",
  class extends HTMLElement {
    connectedCallback() {
      if (this.firstChild) return;

      const [btn, icon] = ["button", "i"].map(newEl);

      btn.className = "BtnC lang" + LG;
      btn.type = "button";
      btn.setAttribute("aria-label", "语言");

      icon.className = "Ico";
      btn.append(icon);

      On(btn, {
        click: open,
        keydown: (e) => {
          // 13: Enter, 32: Space
          if ([13, 32].includes(e.keyCode)) {
            e.preventDefault();
            open();
          }
        },
      });

      this.append(btn);
    }
  },
);
