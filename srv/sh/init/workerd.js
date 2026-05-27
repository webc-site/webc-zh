import { writeFileSync, readFileSync, chmodSync, rmSync, mkdirSync, existsSync } from "node:fs";
import { join } from "node:path";
import { gunzipSync } from "node:zlib";
import { tmpdir } from "node:os";
import { spawnSync } from "node:child_process";
import { PLATFORM, ARCH, GITHUB_PREFIX, BIN_DIR, BIN_PATH } from "./env.js";
import download from "./download.js";

const latestTag = async () => {
    const res = await fetch(GITHUB_PREFIX + "latest", { redirect: "manual" }),
      location = res.headers.get("location");
    if (!location) throw new Error("获取最新版本标签失败");
    return location.substring(location.lastIndexOf("/") + 1);
  },
  localVersion = () => {
    if (!existsSync(BIN_PATH)) return null;
    const res = spawnSync(BIN_PATH, ["--version"], { encoding: "utf8" });
    if (res.error) return null;
    const match = res.stdout.match(/workerd\s+(\d{4}-\d{2}-\d{2})/);
    if (match) return match[1].replace(/-/g, "");
    return null;
  };

export default async () => {
  const tag = await latestTag(),
    local_ver = localVersion();

  if (local_ver && tag.includes(local_ver)) {
    console.log("workerd 已是最新版: " + tag + "，跳过下载");
    return;
  }

  const tmp_dir = join(tmpdir(), "workerd-install-" + Date.now());
  mkdirSync(tmp_dir, { recursive: true });

  try {
    const file_name = "workerd-" + PLATFORM + "-" + ARCH + ".gz",
      download_url = GITHUB_PREFIX + "download/" + tag + "/" + file_name,
      tmp_path = join(tmp_dir, file_name);

    console.log("开始下载: " + download_url);
    await download(download_url, tmp_path);

    console.log("正在解压...");
    const compressed = readFileSync(tmp_path),
      decompressed = gunzipSync(compressed);

    mkdirSync(BIN_DIR, { recursive: true });
    writeFileSync(BIN_PATH, decompressed);
    chmodSync(BIN_PATH, 0o755);
    console.log("已安装至 " + BIN_PATH);
  } finally {
    try {
      rmSync(tmp_dir, { recursive: true, force: true });
      console.log("临时文件夹已清理");
    } catch {
      // 静默忽略删除失败
    }
  }
};
