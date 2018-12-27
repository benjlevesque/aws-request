import { Argv } from "yargs";
export const command = "config <command>";
export const describe = "Configuration";
export const builder = (yargs: Argv) => {
  yargs.demandCommand(1, "").commandDir("./commands", {
    extensions: ["ts"]
  });
  return yargs;
};
