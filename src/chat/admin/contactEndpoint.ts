const sg = require("@sendgrid/mail");
import { IncomingMessage } from "http";
import { env } from "process";
import { findEnvironmentVariable } from "./../../utils/envVarHandler";
import { getRequestBody } from "./../../utils/getRequestBody";
export async function sendChatContactEmail(request: IncomingMessage) {
  let roomNumber: string | undefined = undefined;
  const adminChatToken = env["ADMIN_CHAT_TOKEN"]
    ? env["ADMIN_CHAT_TOKEN"]
    : await findEnvironmentVariable("ADMIN_CHAT_TOKEN");
  const URL = env["URL"] ? env["URL"] : await findEnvironmentVariable("URL");
  const requestBody = await getRequestBody<{ roomName: string }>(request);
  roomNumber = requestBody.roomName.substring(
    requestBody.roomName.search(/-/) + 1
  );
  if (roomNumber && adminChatToken) {
    sg.setApiKey(
      env["SENDGRID_API_KEY"]
        ? env["SENDGRID_API_KEY"]
        : await findEnvironmentVariable("SENDGRID_API_KEY")
    );
    const msg = {
      to: "gab.delosrios@gmail.com",
      from: "gdelosrios@cys.com.ar",
      subject: "Someone is waiting in the embassy!",
      text: "One new message!",
      html: `Ambassador!, access through this <a href='${URL}/admin/chat?room=${roomNumber}&token=${adminChatToken}'>link</a>`,
    };
    sg.send(msg);
  }
}
