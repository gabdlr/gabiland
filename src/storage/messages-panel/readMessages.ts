import { readFile } from "fs/promises";
import { message } from "../../messages-panel/message.model";
export async function readMessages() {
  let messages: message[] = [];
  try {
    const messagesFile = await readFile("./build/db.json", {
      encoding: "utf8",
    });
    messages = JSON.parse(messagesFile);
  } catch (error) {
    //handle error
  }
  return messages;
}
