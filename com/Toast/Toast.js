import { D, newEl } from "x/dom.js";

export const TOAST_TIMEOUT = 1,
  TOAST_HAS_CLOSE = 2,
  TOAST_BODY = 3;

let top_h = 0;

const LI = [],
  toast = (render, conf_li = []) => {
    let timeout = 9,
      has_close = 1,
      body;

    for (const [flag, val] of conf_li) {
      if (flag === TOAST_TIMEOUT) {
        timeout = val;
      } else if (flag === TOAST_HAS_CLOSE) {
        has_close = val;
      } else if (flag === TOAST_BODY) {
        body = val;
      }
    }

    const el = newEl("b");

    body = body || [...D.getElementsByTagName("dialog")].reverse().find((i) => i.open) || D.body;

    el.className = "Toast animated fadeInRight";
    el.style.marginTop = top_h + "px";

    render(el);

    LI.push(el);
    body.appendChild(el);
    top_h += 14 + el.offsetHeight;

    const closeToast = () => {
      el.classList.add("fadeOutRight");
      setTimeout(() => {
        const idx = LI.indexOf(el);
        if (idx > -1) {
          LI.splice(idx, 1);
        }
        if (el.parentNode) {
          el.parentNode.removeChild(el);
        }
        top_h = 0;
        for (const i of LI) {
          i.style.marginTop = top_h + "px";
          top_h += 14 + i.offsetHeight;
        }
      }, 500);
    };

    el.close = closeToast;

    if (has_close) {
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

export const toastErr = (render, conf_li = []) => {
  const el = toast(render, conf_li);
  el.classList.add("ERR");
  return el;
};

export default toast;
