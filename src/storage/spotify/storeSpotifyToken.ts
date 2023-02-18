import { writeFile } from "fs/promises";
import { SpotifyTokenRecord } from "./../../spotify/token.model";

export async function storeSpotifyToken(spotifyToken: SpotifyTokenRecord) {
  return writeFile("./build/spotifyToken.json", JSON.stringify(spotifyToken));
}
