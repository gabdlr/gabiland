import { storeSpotifyToken } from "./../storage/spotify/storeSpotifyToken";
import { RefreshTokenResponse } from "./refresh-token.model";
import { SpotifyTokenRecord } from "./token.model";
import { findEnvironmentVariable } from "./../utils/envVarHandler";
import { env } from "node:process";

export async function refreshToken() {
  let token = null;
  let authVar = env["spotify_authorization_token"]
    ? env["spotify_authorization_token"]
    : await findEnvironmentVariable("spotify_authorization_token");
  let refreshToken = env["spotify_refresh_token"]
    ? env["spotify_refresh_token"]
    : await findEnvironmentVariable("spotify_refresh_token");
  try {
    const tokenData: RefreshTokenResponse = await (
      await fetch("https://accounts.spotify.com/api/token", {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
          Authorization: `Basic ${authVar}`,
        },
        body: new URLSearchParams({
          grant_type: "refresh_token",
          refresh_token: refreshToken,
        }),
      })
    ).json();
    token = tokenData.access_token;
    let spotifyToken: SpotifyTokenRecord = {
      token: tokenData.access_token,
      createdAt: new Date(),
    };
    storeSpotifyToken(spotifyToken);
  } catch (error) {
    //handle error
  }
  return token;
}
