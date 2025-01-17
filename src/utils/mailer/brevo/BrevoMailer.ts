import { Email } from "./Email";
import { MailSender } from "../mailSender.interface";

export class BrevoMailer implements MailSender {

    constructor(private _apiKey?: string, private _mailerURL?: string) {
        if (!this._apiKey) {
            throw new Error("API key not provided!");
        }
        if(!_mailerURL) {
            throw new Error("Mailer URL not provided!")
        }
    }
    
    async send(email: Email): Promise<Response> {
        const headers = new Headers();
        headers.set('accept', 'application/json');
        headers.set('api-key', this._apiKey!);
        headers.set('Content-Type', 'application/json');
        return fetch(this._mailerURL!, {
            method: 'POST',
            headers,
            body: email.toJSON()
        });
    }
    
} 