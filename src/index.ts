import http from "node:http";
import { utils } from "./utils";
import { store } from "./storage";
import { fetchSong } from "./spotify/fetchSong";
import { renderSpotifyComponent } from "./spotify/component";
import { songEndpoint } from "./spotify/songEndpoint";
const hostname = "0.0.0.0";

const server = http.createServer(async (req, res) => {
  res.statusCode = 200;
  res.setHeader("Content-Type", "text/html");
  if (req.url === "/favicon.ico" || req.url === "/robots.txt") return res.end();
  if (req.url === "/song") {
    const response = await songEndpoint(res);
    return res.end(JSON.stringify(response));
  }

  if (req.url && req.url.length > 1) {
    let incomingMessage = utils.parseURL(req.url);
    let sanitizedMessage = utils.sanitizeString(incomingMessage);
    if (sanitizedMessage.length > 0) {
      await store.storeMessage(sanitizedMessage);
    }
  }
  let messagesComponent = await store.retriveMessages();
  const song = await fetchSong();

  let spotifyComponent = "";
  if (song) spotifyComponent = renderSpotifyComponent(song);

  const content =
    `
  <!DOCTYPE html>
  <html lang="en">
  <head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Gabiland Kingdom</title>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0-alpha1/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-GLhlTQ8iRABdZLl6O3oVMWSktQOp6b7In1Zl3/Jr59b6EGGoI1aFkw7cmDA6j6gD" crossorigin="anonymous">
  </head>
  <style>
   ::-webkit-scrollbar {
      width: 20px;
    }
    ::-webkit-scrollbar-track {
      background-color: transparent;
    }
    ::-webkit-scrollbar-thumb {
      background-color: #d6dee1;
    }
    ::-webkit-scrollbar-thumb {
      background-color: #d6dee1;
      border-radius: 20px;
    }
    ::-webkit-scrollbar-thumb {
      background-color: #d6dee1;
      border-radius: 20px;
      border: 6px solid transparent;
      background-clip: content-box;
    }
    .alert-success {
      --bs-alert-color: #e71ad2;
      --bs-alert-bg: rgba(54, 41, 54, 0.9);
      --bs-alert-border-color: var(--bs-success-border-subtle);
      --bs-alert-link-color: var(--bs-success-text);
    }
  </style>
  <body style="background-image: url( 'https://res.cloudinary.com/programming-web-venture/image/upload/v1676096775/background_wevsyq.svg' ); background-position: center; background-size: cover;">
    <div class="container vh-100">
      <nav class="navbar fixed-top" style="background-color: rgba(24, 24, 24, 0.9); min-height: 70px;" id="spotifyContainer">
        <div class="container-fluid">` +
    spotifyComponent +
    `
          <div class="d-flex">
            <div>
            <img heigth="64px" width="64px" src=""></img>
            </div>
            <div>
            </div>
          </div>
        </div>
      </nav>
      <main class="d-flex align-items-center h-100 p-4">
        <div class="card w-100" style="height: 400px; overflow-y: auto; background-color: rgba(255, 255, 255, 0.1);">
          <div class="card-body d-flex flex-column-reverse">` +
    messagesComponent +
    `
          </div>
        </div>
      </main>
    </div>
  </body>
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

  document.addEventListener('DOMContentLoaded', () =>{ 
    history.pushState({prev:window.location.pathname},'','/');
    ${
      song
        ? `fetchNextSong(${
            song?.duration * 1000 - song?.playingSecond * 1000 === 0
              ? song?.duration * 1000
              : song?.duration * 1000 - song?.playingSecond * 1000
          })`
        : `fetchNextSong(3600000); document.getElementById('spotifyContainer').style.setProperty('display','none');`
    }
  });
  
  </script>
  </html>
  `;
  res.end(content);
});

server.listen(8888, hostname, () => {});
