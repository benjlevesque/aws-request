import { get } from "../../../lib/config";

export const command = "get <key>";
export const describe = "Gets a key from the configuration";
export const handler = ({ key }: IGetCommandParams) => {
  console.log(`${key} = ${get(key)}`);
};

export interface IGetCommandParams {
  key: string;
}
