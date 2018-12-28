import { promisify } from "util";

export default (ms: number) => promisify(setTimeout)(ms);
