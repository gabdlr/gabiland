import url from "node:url";
import { env } from "node:process";
import { findEnvironmentVariable } from "./../../utils/envVarHandler";
import { AdminChatRequestParams } from "./adminChatRequestParams.model";

export async function resolveAdminChatRequest(urlString: string) {
  let response = undefined;
  const params: AdminChatRequestParams = <AdminChatRequestParams>(
    (<unknown>url.parse(urlString, true).query)
  );
  if (params.room && params.token) {
    if (validateRoom(params.room) && (await validateToken(params.token))) {
      response = params.room;
      return response;
    }
  }
}

function validateRoom(room: string) {
  return new RegExp(/\d+/).test(room);
}

async function validateToken(token: string) {
  return (
    token ===
    (env["ADMIN_CHAT_TOKEN"]
      ? env["ADMIN_CHAT_TOKEN"]
      : await findEnvironmentVariable("ADMIN_CHAT_TOKEN"))
  );
}
