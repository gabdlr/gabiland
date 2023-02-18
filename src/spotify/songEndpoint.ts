import { ServerResponse } from "http";
import { fetchSong } from "./fetchSong";
import { Album, Artist } from "./song-response.model";
export async function songEndpoint(
  res: ServerResponse
): Promise<SongResponse | SongResponseError> {
  let response: SongResponse | SongResponseError = {
    error: "Something went wrong",
  };
  try {
    res.setHeader("Content-Type", "application/json");
    const song = await fetchSong();
    if (song) {
      response = { song: song.toObject() };
    } else {
      res.statusCode = 400;
      response = { error: "nothing returned" };
    }
  } catch (e) {
    res.statusCode = 500;
    response = { error: "Something went wrong" };
  }
  return response;
}

interface SongResponseError {
  error: string;
}

interface SongResponse {
  song: {
    name: string;
    album: Album;
    artist: Artist[];
    duration: number;
    playingSecond: number;
    albumURL: string;
    trackURL: string;
  };
}
