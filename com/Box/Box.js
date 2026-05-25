import { On } from "x/On.js";
import { B, newEl } from "x/dom.js";

const Box = () => {
  const dialog = newEl("dialog");

  dialog.className = "uBox";

  On(dialog, {
    close: () => B.removeChild(dialog),
    cancel: (e) => e.preventDefault(),
  });

  B.prepend(dialog);

  setTimeout(() => {
    dialog.showModal();
  });

  return dialog;
};

export default Box;
