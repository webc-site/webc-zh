import Box from "./Box.js";

const simple_btn = document.getElementById("btn-simple");

if (simple_btn) {
  simple_btn.onclick = () => {
    const dialog = Box(),
      form = document.createElement("form"),
      title = document.createElement("h3"),
      p = document.createElement("p"),
      btn_ok = document.createElement("button");

    title.textContent = "简单弹出层";
    p.textContent = "这是一个没有任何样式的默认弹出层，可以通过确定按钮关闭它。";
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
