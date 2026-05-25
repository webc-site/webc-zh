const form = document.querySelector(".demo-form");
if (form) {
  form.addEventListener("submit", (e) => {
    e.preventDefault();
    form.classList.add("ing");
    setTimeout(() => {
      form.classList.remove("ing");
    }, 2000);
  });
}
