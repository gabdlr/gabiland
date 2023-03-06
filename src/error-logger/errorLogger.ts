import { storeErrorLog } from "../storage/firebase/firebase-service";
import { Mail } from "../utils/mailer/mail.model";
import { sendMail } from "../utils/mailer/sendgrid-service";
export async function logError(error: unknown) {
  const errorString = JSON.stringify(error);
  const email: Mail = {
    to: "gab.delosrios@gmail.com",
    from: "gdelosrios@cys.com.ar",
    subject: "We have a situation in Gabiland!",
    text: "Something bad has happened",
    html: errorString,
  };
  storeErrorLog(errorString);
  sendMail(email);
}
