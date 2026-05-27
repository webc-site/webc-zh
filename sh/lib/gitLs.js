import { execFile } from "node:child_process";
import { promisify } from "node:util";

const execFileAsync = promisify(execFile),
  gitLs = async (pathspec, cwd) => {
    const args = ["ls-files", "-co", "--exclude-standard"];
    if (pathspec) {
      args.push("--");
      if (Array.isArray(pathspec)) {
        args.push(...pathspec);
      } else {
        args.push(pathspec);
      }
    }
    try {
      const { stdout } = await execFileAsync("git", args, {
        cwd,
        maxBuffer: 1024 * 1024 * 10,
      });
      return stdout.split("\n").filter(Boolean);
    } catch {
      return [];
    }
  };

export default gitLs;
