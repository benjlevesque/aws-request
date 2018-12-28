import { remove } from "../../../lib/config";

export const command = "remove <key>";
export const aliases = "rm";
export const describe = "Removes a key value pair from the configuration";
export const handler = ({ key }: IRemoveCommandParams) => remove(key);

export interface IRemoveCommandParams {
  key: string;
}
