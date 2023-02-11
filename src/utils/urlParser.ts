import { decode } from "node:querystring";
export function parseURL(url: string) {
  let decodedString = Object.keys(decode(url.slice(1)))[0];
  return decodedString;
}
