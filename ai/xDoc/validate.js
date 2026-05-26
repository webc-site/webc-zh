import Ajv from "ajv";
import isStr from "@3-/is_str";

const ajv = new Ajv(),
  ok = (v) =>
    v !== "" &&
    v !== null &&
    v !== undefined &&
    !(typeof v === "object" && Object.keys(v).length === 0);

export const clean = (obj) => {
    if (typeof obj !== "object" || obj === null) {
      if (isStr(obj)) {
        const trimmed = obj.trim();
        return trimmed === "" ? undefined : trimmed;
      }
      return obj;
    }
    if (Array.isArray(obj)) {
      const cleaned_arr = obj.map(clean).filter(ok);
      return cleaned_arr.length > 0 ? cleaned_arr : undefined;
    }
    const cleaned_obj = {};
    for (const key in obj) {
      const val = clean(obj[key]);
      if (ok(val)) {
        cleaned_obj[key] = val;
      }
    }
    return Object.keys(cleaned_obj).length > 0 ? cleaned_obj : undefined;
  },
  validate = (data, schema) => {
    try {
      const check = ajv.compile(schema),
        valid = check(data);
      if (!valid) {
        return check.errors.map((err) => (err.instancePath || "Root") + " " + err.message);
      }
      return [];
    } catch (e) {
      return ["Schema compile error: " + e.message];
    }
  };
