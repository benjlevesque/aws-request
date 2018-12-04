import { addConfig, listConfig } from ".";
import yargs from "yargs";
export const command = "config";
export const describe = "Configuration";
export const builder = yargs => {
  yargs
    .command(
      "add <key> <value>",
      "",
      _yargs => {
        return _yargs.positional("key", {}).positional("value", {});
      },
      addConfig
    )
    .command("list", "", _ => {}, listConfig);

  return yargs;
};
export const handler = yargs => {};
