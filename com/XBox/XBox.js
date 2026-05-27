import { On } from "x/On.js";
import { B, D } from "x/dom.js";
import Box from "../Box/Box.js";

export const xClose = (dialog) => {
    const x = D.createElement("a");
    x.className = "aX";
    dialog.prepend(x);
    On(x, { click: () => dialog.close() });
    return dialog;
  },
  escClose = (dialog) => {
    On(dialog, {
      close: On(B, {
        keyup: (e) => {
          if (27 == e.keyCode) {
            // 27 为 Escape 键
            const { target } = e;
            if (["INPUT", "TEXTAREA"].includes(target.tagName)) {
              target.blur();
              return;
            }
            dialog.close();
          }
        },
      }),
    });
    return dialog;
  };

export default (func) => {
  const box = Box();
  if ("function" == typeof func) func(box);
  return xClose(escClose(box));
};
