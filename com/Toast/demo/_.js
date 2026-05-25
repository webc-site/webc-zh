const btn = document.getElementById("btn-toast"),
  btn_err = document.getElementById("btn-toast-err");

if (btn) {
  btn.onclick = () => {
    toast("操作成功！");
  };
}

if (btn_err) {
  btn_err.onclick = () => {
    toast.err("操作失败，请重试！");
  };
}
