import { EmailAddress } from "./EmailAddress";
export class Email {
    private _content = "";
    private _recipients: Map<string, EmailAddress> = new Map();
    private _sender?: EmailAddress;
    private _subject = "";
  
    setContent(content: string){
      this._content = content;
      return this;
    }
  
    setRecipient(recipient: EmailAddress){
      if(!this._recipients.has(recipient.email)) {
        this._recipients.set(recipient.email, recipient);
      }
      return this;
    }
    
    setRecipients(recipients: EmailAddress[]){
      for(let i = 0, length = recipients.length; i < length; i++){
        this.setRecipient(recipients[i])
      }
      return this;
    }
    
    setSender(sender: EmailAddress){
      this._sender = sender;
      return this;
    }
  
    setSubject(subject: string){
      this._subject = subject;
      return this;
    }

    toJSON(){
        if(!this._sender){
            throw new Error("Email sender has not been set!");
        }
        if(this._recipients.size === 0){
            throw new Error("No recipients has been set!");
        }
        return JSON.stringify({
            sender: this._sender,
            to: Array.from(this._recipients.values()),
            subject: this._subject,
            htmlContent: this._content
        })
    }
  }