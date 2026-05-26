import XBox from "../XBox/XBox.js";
import { On } from "x/On.js";
import { newEl } from "x/dom.js";
import { langGet, langSet } from "x/i18n.js";
import NAME from "@3-/lang/NAME.js";

const LG = " Lg",
  BTN_LG = "Btn" + LG;

export default () => {
  if (langGet() === undefined) {
    langSet(1);
  }
  const [btn, icon] = ["button", "i"].map(newEl);

  btn.className = "BtnC lang" + LG;
  btn.type = "button";
  btn.setAttribute("aria-label", "语言");

  icon.className = "Ico";
  btn.append(icon);

  const open = () => {
    const dialog = XBox(),
      [main, title, btn_container] = ["main", "h6", "b"].map(newEl),
      cur_lang = langGet();

    main.className = "I18n" + LG;
    title.innerText = "请选择页面语言";

    NAME.forEach((name, i) => {
      const button = newEl("button");
      button.innerText = name;
      button.className = cur_lang == i ? BTN_LG + " Main" : BTN_LG;
      On(button, {
        click: () => {
          langSet(i);
          dialog.close();
        },
      });
      btn_container.append(button);
    });

    main.append(title, btn_container);
    dialog.append(main);
  };

  const onKeydown = (e) => {
    if ([13, 32].includes(e.keyCode)) {
      e.preventDefault();
      open();
    }
  };

  On(btn, {
    click: open,
    keydown: onKeydown,
  });

  return btn;
};
