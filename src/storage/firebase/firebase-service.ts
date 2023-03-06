import { env } from "process";
import { findEnvironmentVariable } from "../../utils/envVarHandler";
export async function storeErrorLog(error: string) {
  const firebaseURL =
    env["FIREBASE_URL"] || (await findEnvironmentVariable("FIREBASE_URL"));
  const firebaseSecret =
    env["FIREBASE_SECRET"] ||
    (await findEnvironmentVariable("FIREBASE_SECRET"));
  const log = JSON.stringify({
    message: error,
    date: { ".sv": "timestamp" },
    secret: firebaseSecret,
  });
  fetch(`${firebaseURL}/logs.json`, {
    method: "POST",
    body: log,
  });
}
