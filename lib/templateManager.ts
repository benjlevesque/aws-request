import parse from "json-templates";
import path from "path";
import fs from "fs";
import { promisify } from "util";

const readFile = promisify(fs.readFile);

export const parseTemplate = async <T = any>(name: string, params: any) => {
  if (!require.main) throw new Error("require.main undefined");
  var appDir = path.dirname(require.main.filename);

  const filename = path.join(appDir, "templates", name + ".json");
  const templateString = await readFile(filename, "utf8");

  const template = parse(templateString);
  const data: T = JSON.parse(template(params));
  return data;
};
