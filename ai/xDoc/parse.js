import { parseSync } from "oxc-parser";

export default (code, file_name) => {
  const ast = parseSync(file_name, code),
    exports_list = [];
  if (!ast.program?.body) return exports_list;

  for (const node of ast.program.body) {
    const { type, declaration } = node;
    if (type === "ExportNamedDeclaration" && declaration) {
      const { type: decl_type, declarations } = declaration;
      if (decl_type === "VariableDeclaration") {
        for (const decl of declarations) {
          const { id, init } = decl,
            name = id.name,
            { type: init_type, callee, params: init_params } = init || {},
            is_fn =
              init &&
              (init_type === "ArrowFunctionExpression" ||
                init_type === "FunctionExpression" ||
                (init_type === "CallExpression" &&
                  (callee?.property?.name === "bind" || callee?.name?.includes("bind")))),
            params =
              is_fn && init_params
                ? init_params.map((p) => p.name).filter(Boolean)
                : is_fn
                  ? []
                  : null;
          exports_list.push([name, params, is_fn]);
        }
      } else if (decl_type === "FunctionDeclaration") {
        const { id, params } = declaration,
          name = id.name,
          param_names = params.map((p) => p.name).filter(Boolean);
        exports_list.push([name, param_names, true]);
      }
    } else if (type === "ExportDefaultDeclaration" && declaration) {
      const { type: decl_type, params, id } = declaration;
      if (decl_type === "ArrowFunctionExpression" || decl_type === "FunctionExpression") {
        const param_names = params.map((p) => p.name).filter(Boolean);
        exports_list.push(["default", param_names, true]);
      } else if (decl_type === "FunctionDeclaration") {
        const name = id ? id.name : "default",
          param_names = params.map((p) => p.name).filter(Boolean);
        exports_list.push([name, param_names, true]);
      }
    }
  }
  return exports_list;
};
