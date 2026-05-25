import { On } from "x/On.js";
import { B, newEl } from "x/dom.js";

export default () => {
  const dialog = newEl("dialog");

  dialog.className = "Box";

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
