import { list } from "../../../lib/config";
import { Object } from "core-js";

export const command = "list";
export const describe = "List the key values from the configuration";
export const handler = () => {
  const conf = list();
  for (const key of Object.keys(conf)) {
    console.log(`${key}=${conf[key]}`);
  }
};
