import read from "@3-/read";
import { join } from "node:path";
import yaml from "js-yaml";

const yml_path = join(import.meta.dirname, "schema.yml"),
  templates = yaml.load(read(yml_path));

export default (exports_list) => {
  if (exports_list.length === 0) {
    return structuredClone(templates.no_exports);
  }

  const schema = structuredClone(templates.has_exports),
    { properties: exports_properties, required: required_exports } = schema.properties.exports;

  for (const [name, params, is_fn] of exports_list) {
    let item_schema;
    if (is_fn) {
      item_schema = structuredClone(templates.fn_base);
      item_schema.properties.description.description = "导出的函数 " + name + " 的主要用途";

      if (params && params.length > 0) {
        const param_props = {};
        for (const param of params) {
          param_props[param] = {
            type: "string",
            description:
              "参数 " + param + " 的用途。如果是回调函数，必须说明其具体的参数 and 返回值。",
          };
        }
        item_schema.properties.params = {
          type: "object",
          properties: param_props,
          required: params,
        };
        item_schema.required.push("params");
      }
    } else {
      item_schema = structuredClone(templates.var_base);
      item_schema.properties.description.description = "导出的变量 " + name + " 的主要用途";
    }

    exports_properties[name] = item_schema;
    required_exports.push(name);
  }

  return schema;
};
