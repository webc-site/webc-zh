import XBox from "../XBox/XBox.js";
import { On } from "x/On.js";
import { newEl } from "x/dom.js";
import { langGet, langSet } from "x/i18n.js";

const LG = " Lg",
  BTN_LG = "Btn" + LG;

export default (NAME) => {
  const [btn, icon] = ["button", "i"].map(newEl);

  btn.className = "BtnC lang" + LG;
  btn.type = "button";
  btn.setAttribute("aria-label", "语言");

  icon.className = "Ico";
  btn.append(icon);

  const open = () => {
    const dialog = XBox(),
      [main, title, btn_container] = ["main", "h6", "b"].map(newEl),
      cur_lang = langGet() ?? 0;

    main.className = "I18n" + LG;
    title.innerText = "请选择页面语言";

    const buttons = NAME((...args) => {
      const [name, id] = Array.isArray(args[0]) ? args[0] : args,
        button = newEl("button");
      button.innerText = name;
      button.className = cur_lang == id ? BTN_LG + " Main" : BTN_LG;
      On(button, {
        click: () => {
          langSet(id);
          dialog.close();
        },
      });
      return button;
    });

    btn_container.append(...buttons);
    main.append(title, btn_container);
    dialog.append(main);
  };

  const onKeydown = (e) => {
    // 13: Enter, 32: Space
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
