import { readFile } from "fs/promises";
import { cwd } from "process";

export async function findEnvironmentVariable(variable: string) {
  let envVarValue = "";
  try {
    const file = (await readFile(`${cwd()}/.env`)).toString();
    envVarValue = searchTextInFile(file, variable);
  } catch (error) {
    //handle error
  }
  return envVarValue;

  function searchTextInFile(file: string, text: string) {
    let textResult = "";
    let startPositionKey = 0;
    let endPositionKey = 0;
    let startPositionValue = 0;
    let endPositionValue = 0;
    startPositionKey = file.search(text);
    endPositionKey =
      startPositionKey + file.substring(startPositionKey).search("=");
    if (file.substring(startPositionKey, endPositionKey) === text) {
      startPositionValue = endPositionKey + 1;
      endPositionValue =
        startPositionValue +
        file.substring(startPositionValue).search(/(\r|\n)/);
      //EOF
      if (endPositionValue === endPositionKey) endPositionValue = file.length;
      textResult = file.substring(startPositionValue, endPositionValue);
    }
    return textResult;
  }
}
