export function sanitizeString(str: string) {
  let messageArray = Array.from(str);
  const santizedMessageArray = messageArray.map((char) => {
    if (char === "<") {
      return "&lsaquo;";
    } else if (char === ">") {
      return "&rsaquo;";
    } else {
      return char;
    }
  });
  return santizedMessageArray.join("");
}
