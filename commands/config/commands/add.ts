import { add } from "../../../lib/config";

export const command = "add <key> <value>";
export const describe = "Add a key value pair to the configuration";
export const handler = ({ key, value }: IAddCommandParams) => add(key, value);

export interface IAddCommandParams {
  key: string;
  value: any;
}
