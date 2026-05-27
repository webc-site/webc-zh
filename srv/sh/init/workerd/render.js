import { existsSync } from "node:fs";
import { join, dirname, relative } from "node:path";
import read from "@3-/read";
import write from "@3-/write";
import { Eta } from "eta";
import SRV from "../../const/SRV.js";
import { PORT } from "../../../conf/workerd/CONF.js";

export default (date) => {
  const template_path = join(SRV, "conf/workerd.capnp"),
    output_path = join(SRV, "sh/gen/srv.capnp"),
    conf_path = join(SRV, "conf/workerd/compatibilityDate.js"),
    template = read(template_path),
    eta = new Eta(),
    main = relative(dirname(output_path), join(SRV, "dist/main.js")),
    rendered = eta.renderString(template, { compatibilityDate: date, main, PORT });
  write(output_path, "# DON'T EDIT , GEN BY sh/init.js\n\n" + rendered);
  console.log("已生成配置至: " + output_path + " ( compatibilityDate: " + date + " )");

  if (!existsSync(conf_path)) {
    write(conf_path, 'export default "' + date + '";\n');
    console.log("已生成兼容日期配置: " + conf_path);
  }
};
