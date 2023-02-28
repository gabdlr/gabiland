import { IncomingMessage } from "http";

export function getRequestBody<T extends Object>(
  request: IncomingMessage
): Promise<T> {
  return new Promise((resolve, reject) => {
    const requestBody: Uint8Array[] = [];
    request.on("data", (chunk) => {
      requestBody.push(chunk);
    });
    request.on("end", () => {
      resolve(JSON.parse(Buffer.concat(requestBody).toString()));
    });
    request.on("error", (e) => {
      reject(e);
    });
  });
}
