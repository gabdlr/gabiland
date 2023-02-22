import { stat } from "node:fs/promises";
import { createReadStream } from "node:fs";
import { extname } from "node:path";
import { ServerResponse } from "node:http";
import { MIME_TYPES } from "./mime.types";
export async function serveStaticFile(url: string, res: ServerResponse) {
  return prepareFile(url, res);

  async function prepareFile(
    filePath: string,
    res: ServerResponse
  ): Promise<ServerResponse | undefined> {
    const exists = await stat(`.${filePath}`);
    if (!exists) return undefined;
    const MIME_TYPES = {
      default: "application/octet-stream",
      html: "text/html; charset=UTF-8",
      js: "application/javascript",
      css: "text/css",
      png: "image/png",
      jpg: "image/jpg",
      gif: "image/gif",
      ico: "image/x-icon",
      svg: "image/svg+xml",
      webp: "image/webp",
      txt: "text/plain",
    };
    const streamPath = process.cwd() + filePath;
    const ext = <MIME_TYPES>extname(streamPath).substring(1).toLowerCase();
    const stream = createReadStream(streamPath);
    const mimeType = MIME_TYPES[ext] || MIME_TYPES.default;
    const statusCode = 200;
    res.writeHead(statusCode, { "Content-Type": mimeType });
    stream.pipe(res);
  }
}
