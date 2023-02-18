import { Album, Artist, SpotifySongResponse } from "./song-response.model";

export class Song {
  private _album: Album = {
    album_type: "",
    artists: [],
    available_markets: [],
    external_urls: {
      spotify: "",
    },
    href: "",
    id: "",
    images: [],
    name: "",
    release_date: "",
    release_date_precision: "",
    total_tracks: 0,
    type: "",
    uri: "",
  };
  private _artist: Artist[] = [];
  private _duration = 0;
  private _name = "";
  private _playingSecond = 0;
  private _albumURL = "";
  private _trackURL = "";
  constructor(songResponse: SpotifySongResponse) {
    this._name = songResponse.item.name;
    this._album = songResponse.item.album;
    this._artist = songResponse.item.artists;
    this._duration = songResponse.item.duration_ms / 1000;
    this._playingSecond = songResponse.progress_ms / 1000;
    this._albumURL = songResponse.item.album.external_urls.spotify;
    this._trackURL = songResponse.item.external_urls.spotify;
  }

  get albumImageUrl() {
    let imageURL = this._album.images.find(
      (imageURL) => imageURL.width === 64
    )?.url;
    if (!imageURL) imageURL = this._album.images[0].url ?? "";
    return imageURL;
  }
  get albumTitle() {
    return this._album.name;
  }
  get albumURL() {
    return this._albumURL;
  }
  set album(album: Album) {
    this._album = album;
  }
  get artist() {
    return this._artist;
  }
  set artist(artist: Artist[]) {
    this._artist = artist;
  }
  get duration() {
    return this._duration;
  }
  get name() {
    return this._name;
  }
  set name(name: string) {
    this._name = name;
  }
  get playingSecond() {
    return this._playingSecond;
  }
  get trackURL() {
    return this._trackURL;
  }
  toObject() {
    return {
      name: this._name,
      album: this._album,
      artist: this._artist,
      duration: this._duration * 1000,
      playingSecond: this._playingSecond * 1000,
      albumURL: this._albumURL,
      trackURL: this._trackURL,
    };
  }
}
