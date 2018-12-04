import fs from "fs";
import config from "config-file";
import path from "path";
const homedir = require("os").homedir();

const getConfigPath = () => path.resolve(homedir, ".route53");
const getConfig = () => {
  var opts = config.home(".route53");
  if (opts == null) {
    console.log("config not found... creating default.");
    fs.appendFileSync(getConfigPath(), "{}");
    opts = config.home(".route53");
  }
  return opts;
};
const saveConfig = conf => {
  fs.writeFileSync(getConfigPath(), JSON.stringify(conf));
};

export const listConfig = argv => {
  const conf = getConfig();
  for (const key of Object.keys(conf)) {
    console.log(`${key}=${conf[key]}`);
  }
};
export const addConfig = argv => {
  const conf = getConfig();
  conf[argv.key] = argv.value;
  saveConfig(conf);
};
