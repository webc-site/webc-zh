const TOAST_TIMEOUT = 1,
  toastErr = (render, conf_li) => {
    const el = toast(render, conf_li);
    el.classList.add("ERR");
    return el;
  },
  btn_3s = document.getElementById("btn-toast-3s"),
  btn_err_5s = document.getElementById("btn-toast-err-5s"),
  btn_default = document.getElementById("btn-toast-default"),
  btn_err_default = document.getElementById("btn-toast-err-default");

if (btn_3s) {
  btn_3s.onclick = () => {
    toast(
      (el) => {
        el.innerText = "普通提示 (3秒后自动消失)";
      },
      [[TOAST_TIMEOUT, 3]],
    );
  };
}

if (btn_err_5s) {
  btn_err_5s.onclick = () => {
    toastErr(
      (el) => {
        el.innerText = "错误提示 (5秒后自动消失)";
      },
      [[TOAST_TIMEOUT, 5]],
    );
  };
}

if (btn_default) {
  btn_default.onclick = () => {
    toast((el) => {
      el.innerText = "普通提示 (9秒后自动消失)";
    });
  };
}

if (btn_err_default) {
  btn_err_default.onclick = () => {
    toastErr((el) => {
      el.innerText = "错误提示 (9秒后自动消失)";
    });
  };
}
