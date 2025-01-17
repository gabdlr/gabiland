import { Email } from "./brevo/Email";

export interface MailSender {
    send(email: Email): Promise<Response>;
}