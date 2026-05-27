import md5B64 from "@3-/base64url/md5B64.js";

export default (str) => (str.length > 22 ? md5B64(str) : str);
