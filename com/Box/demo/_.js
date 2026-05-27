const simple_btn = document.getElementById("btn-simple");

if (simple_btn) {
  simple_btn.onclick = () => {
    const dialog = Box(),
      form = document.createElement("form"),
      title = document.createElement("h3"),
      p = document.createElement("p"),
      btn_ok = document.createElement("button");

    form.className = "Lg";
    title.textContent = "简单弹出层";
    p.textContent = "这是一个基于原生 dialog 并用 .Lg 类包装的毛玻璃弹出框。";
    btn_ok.type = "submit";
    btn_ok.textContent = "确定";

    form.append(title, p, btn_ok);
    dialog.append(form);

    form.onsubmit = (e) => {
      e.preventDefault();
      dialog.close();
    };
  };
}
