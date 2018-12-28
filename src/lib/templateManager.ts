import parse from "json-templates";

export const parseTemplate = async <T = any>(template: any, params: any) => {
  if (typeof template !== "string") {
    template = JSON.stringify(template);
  }
  const tpl = parse(template);
  const data: T = JSON.parse(tpl(params));
  return data;
};
