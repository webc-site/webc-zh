import { platform as osPlatform, arch as osArch } from "node:os";
import { join } from "node:path";
import ROOT from "~/srv/sh/const/ROOT.js";

const platform = osPlatform(),
  arch = osArch(),
  darwin = "darwin",
  linux = "linux",
  arm64 = "arm64",
  PLATFORM_MAP = { darwin, linux, win32: "windows" },
  ARCH_MAP = { x64: "64", arm64 };

export const PLATFORM = PLATFORM_MAP[platform],
  ARCH = ARCH_MAP[arch],
  GITHUB_PREFIX = "https://github.com/cloudflare/workerd/releases/",
  BIN_DIR = join(ROOT, "bin"),
  BIN_PATH = join(BIN_DIR, "workerd");

if (!PLATFORM) throw new Error("不支持的系统平台: " + platform);
if (!ARCH) throw new Error("不支持的 CPU 架构: " + arch);
