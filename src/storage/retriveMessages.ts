import { readFile } from "node:fs/promises";
export async function retriveMessages() {
  let displayMessages = "";
  try {
    const db = await readFile("./build/db.json");
    const messages: { content: string }[] = JSON.parse(db.toString());
    messages.forEach(
      (message) =>
        (displayMessages += ` <div class="alert alert-success my-1">${message.content}</div>`)
    );
  } catch (e) {
    //handle error
  }
  return displayMessages;
}
