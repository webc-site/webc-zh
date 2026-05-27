import hash from "~/sh/tran/hash.js";
import isStr from "@3-/is_str";

export default async (ali_tran, from_lang, to_lang, src_val, cache_val, target_val) => {
  const translateVal = async (s_val, c_val, t_val) => {
    if (isStr(s_val)) {
      if (!s_val.trim()) {
        return s_val;
      }
      if (c_val === hash(s_val) && isStr(t_val) && t_val.trim()) {
        return t_val;
      }
      return (await ali_tran(from_lang, to_lang, s_val)) || "";
    }
    if (Array.isArray(s_val)) {
      const c_arr = Array.isArray(c_val) ? c_val : [],
        t_arr = Array.isArray(t_val) ? t_val : [];
      return await Promise.all(s_val.map((item, i) => translateVal(item, c_arr[i], t_arr[i])));
    }
    if (s_val && typeof s_val === "object") {
      const c_obj = c_val && typeof c_val === "object" ? c_val : {},
        t_obj = t_val && typeof t_val === "object" ? t_val : {},
        keys = Object.keys(s_val),
        vals = await Promise.all(
          Object.values(s_val).map((v, i) => translateVal(v, c_obj[keys[i]], t_obj[keys[i]])),
        ),
        res = {};
      keys.forEach((k, idx) => {
        res[k] = vals[idx];
      });
      return res;
    }
    return s_val;
  };
  return await translateVal(src_val, cache_val, target_val);
};
