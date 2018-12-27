import fs from "fs";
import configFile from "config-file";
import path from "path";
const homedir = require("os").homedir();

const fileName = ".request/aws";

const getConfigPath = () => path.resolve(homedir, fileName);
const load = () => {
  var opts = configFile.home(fileName);
  return opts || {};
};

const saveConfig = (conf: any) => {
  const configPath = getConfigPath();
  const configDir = path.dirname(configPath);
  if (!fs.existsSync(configDir)) {
    fs.mkdirSync(configDir, { recursive: true });
  }
  fs.writeFileSync(configPath, JSON.stringify(conf));
};

export const exists = () => fs.existsSync(getConfigPath());

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
