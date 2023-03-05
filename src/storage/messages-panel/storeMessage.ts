import { message } from "../../messages-panel/message.model";
import { readMessages } from "./readMessages";
import { writeFile } from "fs/promises";
export async function storeMessage(message: message) {
  try {
    const messages = await readMessages();
    messages.push(message);
    writeFile("./build/db.json", JSON.stringify(messages));
  } catch (error) {
    //handle error
  }
}
