const rich_btn = document.getElementById("btn-rich");

if (rich_btn) {
  rich_btn.onclick = () => {
    Confirm(
      (el) => {
        const h3 = document.createElement("h3"),
          p = document.createElement("p");
        h3.textContent = "危险操作";
        p.textContent = "此操作不可逆，请确认您已备份数据。";
        el.append(h3, p);
      },
      () => {
        alert("危险操作已确认");
      },
    );
  };
}
