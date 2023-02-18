import { retriveSpotifyToken } from "./../storage/spotify/retriveSpotifyToken";
import { refreshToken } from "./refreshToken";
import { Song } from "./Song";
import { SpotifySongResponse } from "./song-response.model";

export async function fetchSong() {
  async function getSong(token: string) {
    let song: Song | null = null;
    const response = await fetch(
      "https://api.spotify.com/v1/me/player/currently-playing",
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );
    if (response.status === 200) {
      let responseJson: SpotifySongResponse = await response.json();
      song = new Song(responseJson);
    }
    return song;
  }

  const storedRecord = await retriveSpotifyToken();
  let song: Song | null = null;
  if (
    storedRecord.token &&
    new Date(Date.now() - 59 * 60000) < storedRecord.createdAt
  ) {
    song = await getSong(storedRecord.token);
  } else {
    let token = await refreshToken();
    if (token) {
      song = await getSong(token);
    }
  }

  return song;
}
