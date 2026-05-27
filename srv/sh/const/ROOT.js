import { dirname } from "node:path";

export default dirname(dirname(dirname(import.meta.dirname)));
