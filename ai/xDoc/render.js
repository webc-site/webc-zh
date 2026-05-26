const renderExport = (name, params, is_fn, exp_val) => {
  if (!exp_val) return "";
  const has_params = params && params.length > 0,
    lines = [];

  let heading = "## `" + name;
  if (is_fn && !has_params) {
    heading += "()";
  }
  heading += "` : " + exp_val.description;
  lines.push(heading);

  if (exp_val.params && Object.keys(exp_val.params).length > 0) {
    lines.push("### 参数");
    for (const key of Object.keys(exp_val.params)) {
      lines.push("- " + key + " : " + (exp_val.params[key] || ""));
    }
  }

  if (exp_val.return) {
    lines.push("### 返回值");
    lines.push(exp_val.return);
  }

  if (exp_val.exception) {
    lines.push("### 异常");
    lines.push(exp_val.exception);
  }

  return lines.join("\n");
};

export default (data, exports_list) => {
  const lines = ["# " + data.title];
  if (exports_list.length === 0) {
    if (data.description) {
      lines.push("", data.description);
    }
  } else {
    const exports_md = exports_list
      .map(([name, params, is_fn]) => renderExport(name, params, is_fn, data.exports?.[name]))
      .filter(Boolean)
      .join("\n\n");
    if (exports_md) {
      lines.push("", exports_md);
    }
  }
  return lines.join("\n") + "\n";
};
