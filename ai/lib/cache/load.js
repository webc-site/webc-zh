import { existsSync, readFileSync } from "node:fs";
import yaml from "js-yaml";
import { unpack } from "msgpackr";
import read from "@3-/read";

export default (cache_yml_path, tmp_msgpack_path) => {
  let cache_yml = {};
  if (existsSync(cache_yml_path)) {
    try {
      cache_yml = yaml.load(read(cache_yml_path)) || {};
    } catch (e) {
      console.warn("读取 YAML 缓存失败:", e.message);
    }
  }

  let cache_msgpack = {};
  if (existsSync(tmp_msgpack_path)) {
    try {
      cache_msgpack = unpack(readFileSync(tmp_msgpack_path)) || {};
    } catch (e) {
      console.warn("读取 Msgpack 缓存失败:", e.message);
    }
  }

  return [cache_yml, cache_msgpack];
};
