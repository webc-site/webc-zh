import Box from "../Box/Box.js";
import { On } from "x/On.js";
import { newEl } from "x/dom.js";

export default (render, on_ok) => {
  const wait = "Wait",
    button = "button",
    lg = "Lg",
    btn_class = "Btn " + lg,
    dialog = Box(),
    [main, content_box, btn_box, btn_cancel, btn_ok] = ["main", "b", "b", button, button].map(
      newEl,
    );

  main.className = "Confirm " + lg;
  [btn_cancel, btn_ok].forEach((btn) => {
    btn.type = button;
    btn.className = btn_class;
  });

  [
    [btn_ok, "确定"],
    [btn_cancel, "取消"],
  ].forEach(([btn, txt]) => btn.append(newEl("i"), txt));

  btn_box.append(btn_cancel, btn_ok);
  main.append(content_box, btn_box);
  dialog.append(main);

  content_box.className = wait;

  setTimeout(async () => {
    try {
      await render(content_box);
    } finally {
      content_box.classList.remove(wait);
    }
  });

  On(btn_cancel, {
    click: () => dialog.close(),
  });

  On(btn_ok, {
    click: async () => {
      if (on_ok) {
        await on_ok();
      }
      dialog.close();
    },
  });

  return dialog;
};
