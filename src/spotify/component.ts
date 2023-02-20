import { Song } from "./Song";

export function renderSpotifyComponent(song: Song | null) {
  let artistEl = "";
  if (song) {
    song.artist.map((artist, index) => {
      artistEl += `<a class="artist d-inline song-complementary-info-text m-0 me-1" href="${
        artist.external_urls.spotify
      }" target="blank">${artist.name}${
        index + 1 < song.artist.length ? "," : ""
      }</a>`;
    });
  }
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
            <a href="${
              song?.trackURL ?? " "
            }" id="spotify-album-href"><img heigth="64px" width="64px" src="${
      song?.albumImageUrl ?? " "
    }" target="blank" id="spotify-album-image"></img></a>
          </div>
          <div class="d-flex flex-column justify-content-center">
            <a href="${
              song?.albumURL ?? " "
            }" class="song-title-text" target="blank" id="spotify-track">${
      song?.name ?? " "
    }</a>
            <div class="d-flex flex-row flex-wrap" id="spotify-artist">
            ` +
    artistEl +
    `</div>
          </div>
        </div>
      </div>
    </nav>
    <script>
      function fetchNextSong(timeToNextSong) {
    setTimeout(() => {
      fetch("/song")
        .then((response) => response.json())
        .then((response) => {
          syncSpotifyComponent(response);
          return fetchNextSong(
            (response.song?.duration  - response.song?.playingSecond ) === 0 ? 
            response.song?.duration  : 
            (response.song?.duration  - response.song?.playingSecond)
          );
        });
    }, timeToNextSong);
  }
  
  function syncSpotifyComponent(song) {
    if(song.error){
      document.getElementById('spotifyContainer').style.setProperty('display','none');
      return fetchNextSong(3600000);
    }
    
    //updates image
    if(document.getElementById('spotifyContainer').style['display'] !== 'block'){
      document.getElementById('spotifyContainer').style.setProperty('display','block');
    }
    document.getElementById("spotify-album-href")?.setAttribute("href", song.song.trackURL);
    let albumImageUrl = song.song.album.images.find((imageURL) => imageURL.width === 64)?.url;
    if (!albumImageUrl) albumImageUrl = song.song.album.images[0].url ?? "";
    document.getElementById("spotify-album-image")?.setAttribute("src", albumImageUrl);

    //updates song title
    document.getElementById("spotify-track").innerText = song.song.name;
    document.getElementById("spotify-track")?.setAttribute("href", song.song.album.external_urls.spotify);
    
    //updates artists
    document.querySelectorAll(".artist").forEach((node) => node.remove());
    song.song.artist.forEach((artist, index) => {
      let artistRef = document.createElement("a");
      artistRef.setAttribute("href", artist.external_urls.spotify);
      artistRef.classList.add("artist", "song-complementary-info-text", "m-0", "me-1");
      artistRef.innerText = artist.name + (index + 1 !== song.song.artist.length ? "," : "");
      document.getElementById("spotify-artist").appendChild(artistRef);
    });
  }
  
    function fetchNextSong(timeToNextSong) {
      setTimeout(() => {
        fetch("/song")
          .then((response) => response.json())
          .then((response) => {
            syncSpotifyComponent(response);
            return fetchNextSong(
              (response.song?.duration  - response.song?.playingSecond ) === 0 ? 
              response.song?.duration  : 
              (response.song?.duration  - response.song?.playingSecond)
            );
          });
      }, timeToNextSong);
    }
    
    function syncSpotifyComponent(song) {
      if(song.error){
        document.getElementById('spotifyContainer').style.setProperty('display','none');
        return fetchNextSong(3600000);
      }
      
      //updates image
      if(document.getElementById('spotifyContainer').style['display'] !== 'block'){
        document.getElementById('spotifyContainer').style.setProperty('display','block');
      }
      document.getElementById("spotify-album-href")?.setAttribute("href", song.song.trackURL);
      let albumImageUrl = song.song.album.images.find((imageURL) => imageURL.width === 64)?.url;
      if (!albumImageUrl) albumImageUrl = song.song.album.images[0].url ?? "";
      document.getElementById("spotify-album-image")?.setAttribute("src", albumImageUrl);

      //updates song title
      document.getElementById("spotify-track").innerText = song.song.name;
      document.getElementById("spotify-track")?.setAttribute("href", song.song.album.external_urls.spotify);
      
      //updates artists
      document.querySelectorAll(".artist").forEach((node) => node.remove());
      song.song.artist.forEach((artist, index) => {
        let artistRef = document.createElement("a");
        artistRef.setAttribute("href", artist.external_urls.spotify);
        artistRef.classList.add("artist", "song-complementary-info-text", "m-0", "me-1");
        artistRef.innerText = artist.name + (index + 1 !== song.song.artist.length ? "," : "");
        document.getElementById("spotify-artist").appendChild(artistRef);
      });
    }
    ${
      song
        ? `fetchNextSong(${
            song?.duration * 1000 - song?.playingSecond * 1000 === 0
              ? song?.duration * 1000
              : song?.duration * 1000 - song?.playingSecond * 1000
          })`
        : `fetchNextSong(3600000); document.getElementById('spotifyContainer').style.setProperty('display','none');`
    }
  </script>
  `
  );
}
