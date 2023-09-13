import { decode } from "node:querystring";
export function parseURL(url: string) {
  let decodedString = Object.keys(decode(url))[0];
  return decodedString;
}
