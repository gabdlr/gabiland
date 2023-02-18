import { Song } from "./Song";

export function renderSpotifyComponent(song: Song | null) {
  if (!song) return "";
  let artistEl = "";
  song.artist.map((artist, index) => {
    artistEl += `<a class="artist d-inline song-complementary-info-text m-0 me-1" href="${
      artist.external_urls.spotify
    }" target="blank">${artist.name}${
      index + 1 < song.artist.length ? "," : ""
    }</a>`;
  });
  return (
    `
    <style>
      .song-title-text {
        font-size: 0.8125rem;
        color: #fff;
      }
      .song-complementary-info-text {
        font-size: 0.6875rem;
        color: #b3b3b3;
      }
      .song-title-text, .song-complementary-info-text{
        font-family: CircularSp,CircularSp-Arab,CircularSp-Hebr,CircularSp-Cyrl,CircularSp-Grek,CircularSp-Deva,sans-serif;
        margin-block: 0px;
        -webkit-tap-highlight-color: transparent;
        text-decoration: none;
        font-weight: 400;
      }
      .song-title-text:hover, .song-complementary-info-text:hover{
        text-decoration: underline;
      }
    </style>
    <nav class="navbar fixed-top" style="background-color: #181818; min-height: 70px; border-bottom: 1px solid #282828;">
      <div class="container-fluid">
        <div class="d-flex">
          <div class="me-2">
            <a href="${song.trackURL}" id="spotify-album-href"><img heigth="64px" width="64px" src="${song.albumImageUrl}" target="blank" id="spotify-album-image"></img></a>
          </div>
          <div class="d-flex flex-column justify-content-center" id="spotify-artist">
            <a href="${song.albumURL}" class="song-title-text" target="blank"  id="spotify-track">${song.name}</a>
            <div class="d-flex flex-row">
            ` +
    artistEl +
    `</div>
          </div>
        </div>
      </div>
    </nav>
  `
  );
}
