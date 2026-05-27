import { writeFileSync } from "node:fs";
import yaml from "js-yaml";
import { pack } from "msgpackr";

export default (cache_yml_path, tmp_msgpack_path, next_cache_yml, next_cache_msgpack) => {
  writeFileSync(tmp_msgpack_path, pack(next_cache_msgpack));
  writeFileSync(cache_yml_path, yaml.dump(next_cache_yml));
};
