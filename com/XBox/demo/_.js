const xbox_btn = document.getElementById("btn-xbox");

if (xbox_btn) {
  xbox_btn.onclick = () => {
    const dialog = xBox(),
      form = document.createElement("form"),
      title = document.createElement("h3"),
      p = document.createElement("p");

    form.className = "Lg";
    title.textContent = "带有关闭按钮的弹窗 (XBox)";
    p.textContent = "这是一个基于 Box 并封装了右上角关闭(aX)和 Esc 键退出功能的弹窗。";

    form.append(title, p);
    dialog.append(form);
  };
}
