import { B, D, newEl } from "x/dom.js";

let li_list = [],
  bottom_h = 0;

const toast = (msg, timeout = 9, body, close = 1, html) => {
  const el = newEl("b"),
    inner = newEl("b");

  body = body || [...D.getElementsByTagName("dialog")].reverse().find((i) => i.open) || B;

  el.className = "Toast animated fadeInLeft";
  el.style.marginBottom = bottom_h + "px";

  inner[html ? "innerHTML" : "innerText"] = msg;
  el.appendChild(inner);

  li_list.push(el);
  body.appendChild(el);
  bottom_h += 14 + el.offsetHeight;

  const closeToast = () => {
    el.classList.add("fadeOutLeft");
    setTimeout(() => {
      const idx = li_list.indexOf(el);
      if (idx > -1) {
        li_list.splice(idx, 1);
      }
      if (el.parentNode) {
        el.parentNode.removeChild(el);
      }
      bottom_h = 0;
      for (const i of li_list) {
        i.style.marginBottom = bottom_h + "px";
        bottom_h += 14 + i.offsetHeight;
      }
    }, 500);
  };

  el.close = closeToast;

  if (close) {
    const x = newEl("i");
    x.className = "x";
    x.onclick = closeToast;
    el.appendChild(x);
  }

  if (timeout) {
    setTimeout(closeToast, timeout * 1000);
  }

  return el;
};

export const toastErr = (msg, timeout = 9, body, close = 1, html) => {
  const el = toast(msg, timeout, body, close, html);
  el.classList.add("ERR");
  return el;
};

toast.err = toastErr;

export default toast;
