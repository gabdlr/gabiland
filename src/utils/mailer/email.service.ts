import { env } from "process";
import { findEnvironmentVariable } from "../envVarHandler";
import { BrevoMailer } from "./brevo/BrevoMailer";
import { Email } from "./brevo/Email";
import { MailSender } from "./mailSender.interface";

export class EmailService implements MailSender {
  
  async send(email: Email): Promise<Response> {
    const mailerApikey = env["MAILER_API_KEY"]
        ? env["MAILER_API_KEY"]
        : await findEnvironmentVariable("MAILER_API_KEY");
    const mailerURL = env["MAILER_URL"]
        ? env["MAILER_URL"]
        : await findEnvironmentVariable("MAILER_URL"); 
    const mailer: MailSender = new BrevoMailer(mailerApikey, mailerURL);
    return mailer.send(email)
  }
}