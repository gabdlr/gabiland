import { env } from "process";
import { Email } from "./../utils/mailer/brevo/Email";
import { EmailAddress } from "./../utils/mailer/brevo/EmailAddress";
import { EmailService } from "./../utils/mailer/email.service";
import { findEnvironmentVariable } from "./../utils/envVarHandler";

export  async function logError(error: unknown) {
  
  try {
    const recipientEmailAddress = env["MAILER_RECIPIENT"] 
    ? env["MAILER_RECIPIENT"] 
    : await findEnvironmentVariable("MAILER_RECIPIENT");
    const emailService = new EmailService();
    const sender = new EmailAddress('Gabilandia', 'errors@gabilandia.com');
    const recipient = new EmailAddress('Gabriel De Los Rios', recipientEmailAddress);
    const errorString = JSON.stringify(error);
    const subject = 'We have a situation in Gabiland!';
    const email = new Email()
                      .setContent(errorString)
                      .setRecipient(recipient)
                      .setSender(sender)
                      .setSubject(subject);
    emailService.send(email)
  } catch (error) {
    console.log(error)
  }

}
