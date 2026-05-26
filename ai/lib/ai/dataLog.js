import ERR from "@3-/log/ERR.js";
import GRAY from "@3-/log/GRAY.js";
import YELLOW from "@3-/log/YELLOW.js";

export default (data) => {
  const error = data.info.error;
  if (error) {
    ERR(error.name, JSON.stringify(error.data, null, 2));
    return;
  }

  const parts = data.parts;
  if (parts) {
    const reasoning = parts
        .filter((p) => p.type === "reasoning")
        .map((p) => p.text)
        .join(""),
      reply = parts
        .filter((p) => p.type === "text")
        .map((p) => p.text)
        .join("");

    if (reasoning) {
      GRAY("\n💡 " + reasoning);
    }

    YELLOW("\n← " + reply);
    return reply;
  }
};
