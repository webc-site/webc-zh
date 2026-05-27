import CODE from "@3-/lang/CODE.js";

export default (name) => {
  const idx = CODE.indexOf(name);
  if (idx === -1) {
    console.warn("⚠️ " + name + " 不存在");
  }
  return idx;
};
