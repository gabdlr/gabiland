import { IncomingMessage } from "http";
import { env } from "process";
import { findEnvironmentVariable } from "./../../utils/envVarHandler";
import { getRequestBody } from "./../../utils/getRequestBody";
import { EmailAddress } from "./../../utils/mailer/brevo/EmailAddress";
import { Email } from "./../../utils/mailer/brevo/Email";
import { EmailService } from "./../../utils/mailer/email.service";

export async function sendChatContactEmail(request: IncomingMessage) {
  
  try{
    const emailService = new EmailService();
    let roomNumber: string;
    const adminChatToken = env["ADMIN_CHAT_TOKEN"]
      ? env["ADMIN_CHAT_TOKEN"]
      : await findEnvironmentVariable("ADMIN_CHAT_TOKEN");
    const URL = request.headers["origin"];
    const requestBody = await getRequestBody<{ roomName: string }>(request);
    roomNumber = requestBody.roomName.substring(
      requestBody.roomName.search(/-/) + 1
    );
    const recipientEmailAddress = env["MAILER_RECIPIENT"] 
    ? env["MAILER_RECIPIENT"] 
    : await findEnvironmentVariable("MAILER_RECIPIENT");

    if (roomNumber && adminChatToken) {
      const sender = new EmailAddress('Gabilandia', 'embassy@gabilandia.com');
      const recipient = new EmailAddress('Gabriel De Los Rios', recipientEmailAddress);
      const htmlContent = `Ambassador!, access through this <a href='${URL}/admin/chat?room=${roomNumber}&token=${adminChatToken}'>link</a>`;
      const subject = 'Someone is waiting in the embassy!';
      const email = new Email()
                        .setContent(htmlContent)
                        .setRecipient(recipient)
                        .setSender(sender)
                        .setSubject(subject)
      await emailService.send(email)
    }
  } catch(e) {
    console.log(e)
  }

}
