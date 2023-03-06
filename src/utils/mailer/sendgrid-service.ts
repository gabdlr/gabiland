const sg = require("@sendgrid/mail");
import { env } from "process";
import { findEnvironmentVariable } from "./../../utils/envVarHandler";
import { Mail } from "./mail.model";

export async function sendMail(mail: Mail) {
  sg.setApiKey(
    env["SENDGRID_API_KEY"]
      ? env["SENDGRID_API_KEY"]
      : await findEnvironmentVariable("SENDGRID_API_KEY")
  );
  const msg = {
    to: mail.to,
    from: mail.from,
    subject: mail.subject,
    text: mail.text,
    html: mail.html,
  };
  sg.send(msg);
}
