export class EmailAddress {
  constructor(public name = "", public email = ""){
    if(!email) {
      throw new Error("Email field is required");
    }
  }
  
}