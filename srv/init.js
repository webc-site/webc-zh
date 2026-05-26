#!/usr/bin/env bun
import { tmpdir, platform as osPlatform, arch as osArch } from "node:os";
import { join } from "node:path";
import { writeFileSync, readFileSync, chmodSync, rmSync, mkdirSync } from "node:fs";
import { gunzipSync } from "node:zlib";
import { SingleBar, Presets } from "cli-progress";

const { shades_classic } = Presets,
  darwin = "darwin",
  linux = "linux",
  arm64 = "arm64",
  PLATFORM_MAP = { darwin, linux, win32: "windows" },
  ARCH_MAP = { x64: "64", arm64 },
  GITHUB_PREFIX = "https://github.com/cloudflare/workerd/releases/",
  download = async (url, dest_path) => {
    const res = await fetch(url);
    if (!res.ok) throw new Error("下载失败: " + res.statusText);

    const total = parseInt(res.headers.get("content-length") || "0", 10),
      bar = new SingleBar({}, shades_classic),
      reader = res.body.getReader(),
      chunks = [];
    let loaded = 0;

    bar.start(total, 0);
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      chunks.push(value);
      loaded += value.length;
      bar.update(loaded);
    }
    bar.stop();

    const data = new Uint8Array(loaded);
    let offset = 0;
    for (const chunk of chunks) {
      data.set(chunk, offset);
      offset += chunk.length;
    }
    writeFileSync(dest_path, data);
  },
  install = async (platform, arch, tmp_dir) => {
    const tag_res = await fetch(GITHUB_PREFIX + "latest", {
        redirect: "manual",
      }),
      { headers } = tag_res,
      location = headers.get("location");
    if (!location) throw new Error("获取最新版本标签失败");

    const tag = location.substring(location.lastIndexOf("/") + 1),
      file_name = "workerd-" + platform + "-" + arch + ".gz",
      download_url = GITHUB_PREFIX + "download/" + tag + "/" + file_name,
      tmp_path = join(tmp_dir, file_name);

    console.log("开始下载:", download_url);
    await download(download_url, tmp_path);

    console.log("正在解压...");
    const compressed = readFileSync(tmp_path),
      decompressed = gunzipSync(compressed),
      bin_dir = join(import.meta.dirname, "../bin"),
      bin_path = join(bin_dir, "workerd");

    mkdirSync(bin_dir, { recursive: true });
    writeFileSync(bin_path, decompressed);
    chmodSync(bin_path, 0o755);
    console.log("已安装至", bin_path);
  },
  main = async () => {
    const platform = PLATFORM_MAP[osPlatform()],
      arch = ARCH_MAP[osArch()];

    if (!platform) throw new Error("不支持的系统平台: " + osPlatform());
    if (!arch) throw new Error("不支持的 CPU 架构: " + osArch());

    const tmp_dir = join(tmpdir(), "workerd-install-" + Date.now());
    mkdirSync(tmp_dir, { recursive: true });
    try {
      await install(platform, arch, tmp_dir);
    } finally {
      try {
        rmSync(tmp_dir, { recursive: true, force: true });
        console.log("临时文件夹已清理");
      } catch {
        // 静默忽略删除失败
      }
    }
  };

if (import.meta.main) await main();
