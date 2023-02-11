import { stat, open } from "node:fs/promises";

export async function storeMessage(message: string) {
  let messageToStore = message;
  try {
    let cursorPosition = 0;
    let buffer = Buffer.from("");
    const endPosition = (await stat("./build/db.json")).size;
    messageToStore = messageToStore.trim();
    let message = { content: messageToStore };
    if (endPosition === 2) {
      cursorPosition = endPosition - 1;
      buffer = Buffer.from(JSON.stringify(message, null, 4) + "]");
    } else {
      cursorPosition = endPosition - 1;
      buffer = Buffer.from("," + JSON.stringify(message, null, 4) + "]");
    }
    const db = await open("./build/db.json", "r+");
    await db.write(buffer, 0, buffer.length, cursorPosition);
    db.close();
  } catch (e) {
    //handle error
  }
}
