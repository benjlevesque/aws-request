import { Argv } from "yargs";
export const command = "config <command>";
export const describe = "Configuration";
export const builder = (yargs: Argv) => {
  yargs.demandCommand(1, "").commandDir("./commands", {
    extensions: process.env.NODE_ENV === "development" ? ["ts"] : ["js"]
  });
  return yargs;
};
