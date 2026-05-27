import { writeFileSync } from "node:fs";
import { SingleBar, Presets } from "cli-progress";

const { shades_classic } = Presets;

export default async (url, dest_path) => {
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
};
