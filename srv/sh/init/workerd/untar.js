import { writeFileSync, readFileSync, chmodSync, rmSync, mkdirSync } from "node:fs";
import { join } from "node:path";
import { gunzipSync } from "node:zlib";
import { tmpdir } from "node:os";
import { PLATFORM, ARCH, GITHUB_PREFIX, BIN_DIR, BIN_PATH } from "./env.js";
import download from "./download.js";
import ver from "./ver.js";

export default async (tag) => {
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
    return ver();
  } finally {
    try {
      rmSync(tmp_dir, { recursive: true, force: true });
      console.log("临时文件夹已清理");
    } catch {
      // 静默忽略删除失败
    }
  }
};
