import fs from "fs";
import configFile from "config-file";
import path from "path";
const homedir = require("os").homedir();

const getConfigPath = () => path.resolve(homedir, ".route53");
const load = () => {
  var opts = configFile.home(".route53");
  if (opts == null) {
    console.log("config not found... creating default.");
    fs.appendFileSync(getConfigPath(), "{}");
    opts = configFile.home(".route53");
  }
  return opts;
};
const saveConfig = (conf: any) => {
  fs.writeFileSync(getConfigPath(), JSON.stringify(conf));
};

export const list = () => load();

export const add = (key: string, value: string) => {
  const conf = load();
  conf[key] = value;
  saveConfig(conf);
};

export function get(key: string): any {
  const conf = load();
  return conf[key];
}

export const remove = (key: string) => {
  const conf = load();
  delete conf[key];
  saveConfig(conf);
};
