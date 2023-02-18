import { readFile } from "node:fs/promises";
import { SpotifyTokenRecord } from "./../../spotify/token.model";
import { storeSpotifyToken } from "./storeSpotifyToken";
export async function retriveSpotifyToken() {
  let spotifyToken: SpotifyTokenRecord = {
    token: null,
    createdAt: new Date(),
  };
  try {
    const storedToken = (
      await readFile("./build/spotifyToken.json")
    ).toString();
    const storedTokenJson: SpotifyTokenRecord = JSON.parse(storedToken);
    spotifyToken.token = storedTokenJson.token;
    spotifyToken.createdAt = new Date(storedTokenJson.createdAt);
  } catch (e) {
    storeSpotifyToken(spotifyToken);
  }
  return spotifyToken;
}
