const cards_count = 12,
  h_scroll_container = document.querySelector("h-scroll > b"),
  v_scroll_container = document.querySelector("v-scroll > b");

if (h_scroll_container) {
  for (let i = 0; i < cards_count; ++i) {
    const card = document.createElement("b");
    card.style.setProperty("--theme-hue", (i * 45) % 360);
    card.style.setProperty("--theme-hue-next", (i * 45 + 25) % 360);
    h_scroll_container.appendChild(card);
  }
}

if (v_scroll_container) {
  for (let i = 0; i < cards_count; ++i) {
    const card = document.createElement("b");
    card.style.setProperty("--theme-hue", (i * 35) % 360);
    card.style.setProperty("--theme-hue-next", (i * 35 + 15) % 360);
    v_scroll_container.appendChild(card);
  }
}
