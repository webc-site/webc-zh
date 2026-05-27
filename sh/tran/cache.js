import hash from "~/sh/tran/hash.js";
import isStr from "@3-/is_str";

export default (val) => {
  const cache = (v) => {
    if (isStr(v)) {
      return hash(v);
    }
    if (Array.isArray(v)) {
      return v.map(cache);
    }
    if (v && typeof v === "object") {
      const res = {};
      for (const [k, v_in] of Object.entries(v)) {
        res[k] = cache(v_in);
      }
      return res;
    }
    return v;
  };
  return cache(val);
};
