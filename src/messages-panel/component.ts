import { logError } from "../error-logger/errorLogger";
import { readMessages } from "../storage/messages-panel/readMessages";
export async function renderMessagePanelComponent() {
  let messagesHTML = "";
  let messages = [];
  try {
    messages = await readMessages();
    if (messages.length > 0) {
      messages.forEach(
        (message) =>
          (messagesHTML += ` <div class="alert alert-success my-1">${message.content}</div>`)
      );
    }
  } catch (error) {
    logError(error);
  }
  /*prettier-ignore */
  return ( 
  `
  <div class="card w-100" style="height: 400px; overflow-y: auto; background-color: rgba(255, 255, 255, 0.1);">
    <div class="card-body d-flex flex-column-reverse">
    ` + messagesHTML +`
    </div>
  </div>`);
}
