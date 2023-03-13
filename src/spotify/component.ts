import { Song } from "./Song";

export function renderSpotifyComponent(song: Song | null) {
  let artistEl = "";
  let template: string | null = null;

  if (song) {
    song.artist.map((artist, index) => {
      artistEl += `<a class="artist d-inline song-complementary-info-text m-0 me-1" href="${
        artist.external_urls.spotify
      }" target="blank">${artist.name}${
        index + 1 < song.artist.length ? "," : ""
      }</a>`;
    });

    //prettier-ignore
    template =
      `
    <div id="spotifyComponent" class="container-fluid">  
      <div class="d-flex">
        <div class="me-2">
          <a href="${song.trackURL ?? " "}" id="spotifyAlbumHref" target="blank">
            <img height="64px" width="64px" alt="Album image" src="${song.albumImageUrl ?? " "}" id="spotifyAlbumImage">
          </a>
        </div>
        <div class="d-flex flex-column justify-content-center">
          <a href="${song.albumURL ?? " "}" class="song-title-text" target="blank" id="spotifyTrack">
            ${song.name ?? " "}
          </a>
          <div class="d-flex flex-row flex-wrap" id="spotifyArtist">
          ` + artistEl + `
          </div>
        </div>
      </div>
    </div>
    `;
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
      #spotifyComponentContainer {
        height: 0px;
        overflow: hidden;
        visibility: hidden;
      }
      
      .slide-down {
        animation: slide-down 0.6s linear both;
      }
      
      .slide-up {
        animation: slide-up 0.6s linear both;
      }
      
      @keyframes slide-down {
        0% {
          visibility: hidden;
          height: 0;
        }
      
        95% {
          visibility: visible;
          height: 60px;
        }
      
        100% {
          visibility: visible;
          height: auto;
        }
      }
      
      @keyframes slide-up {
        from {
          visibility: visible;
          height: 70px;
        }
      
        to {
          visibility: hidden;
          height: 0;
        }
      }  
    </style>

    <section class="navbar fixed-top slide-down" style="background-color: #181818; border-bottom: 1px solid #282828;" id="spotifyComponentContainer">
      ` +
    template +
    `    
    </section>
    <script>
    document.addEventListener('DOMContentLoaded', () =>{
      let blurDate;
      let focusDate; 

      function fetchNextSong(timeToNextSong) {
        setTimeout(() => {
          fetch("/song")
            .then((response) => response.json())
            .then((response) => {
              syncSpotifyComponent(response);
              if(response.error){
                return fetchNextSong(60000)
              }
              let timeToNextSong = response.song?.duration  - response.song?.playingSecond;
              if(timeToNextSong === 0) timeToNextSong = 30000;
              return fetchNextSong(timeToNextSong);
            }).catch((e)=>{
              let error = {error: e} 
              syncSpotifyComponent(null);
              fetchNextSong(60000)
            });
        }, timeToNextSong);
      }

      function assembleArtistElement(song){
        return song.song.artist.map((artist, index) => {
          const artistRef = document.createElement("a");
          artistRef.setAttribute("href", artist.external_urls.spotify);
          artistRef.setAttribute("target","blank");
          artistRef.classList.add("artist", "song-complementary-info-text", "m-0", "me-1");
          artistRef.innerText =
            artist.name + (index + 1 !== song.song.artist.length ? "," : "");
          return artistRef;
        });
      }

      function resolveSongAlbum(song) {
        let albumImageUrl = song.song.album.images.find((imageURL) => imageURL.width === 64)?.url;
        if (!albumImageUrl) albumImageUrl = song.song.album.images[0].url ?? "";
        return albumImageUrl
      }

      function renderSpotifyComponent(song) {
        const spotifyComponentContainer = document.getElementById('spotifyComponentContainer');
        const spotifyComponent = document.createElement("div");
        spotifyComponent.setAttribute("id", "spotifyComponent");
        spotifyComponent.classList.add("container-fluid");
        
        const flexDiv = document.createElement("div");
        flexDiv.classList.add("d-flex");
        const flexDivFirstChild = document.createElement("div");
        flexDivFirstChild.classList.add("me-2");
        
        const imageLink = document.createElement("a");
        imageLink.setAttribute("href", song.song.trackURL);
        imageLink.setAttribute("id", "spotifyAlbumHref");
        imageLink.setAttribute("target", "blank");
        
        const imageElement = document.createElement("img");
        imageElement.setAttribute("height", "64px");
        imageElement.setAttribute("width", "64px");
        imageElement.setAttribute("alt", "Album image");
        let albumImageUrl = resolveSongAlbum(song);
        imageElement.setAttribute("src", albumImageUrl);
        
        imageElement.setAttribute("id", "spotifyAlbumImage");
        imageLink.appendChild(imageElement);
        flexDivFirstChild.appendChild(imageLink);
        
        const flexDivSecondChild = document.createElement("div");
        flexDivSecondChild.classList.add("d-flex", "flex-column", "justify-content-center");
        
        const songTitleLink = document.createElement("a");
        songTitleLink.classList.add("song-title-text");
        songTitleLink.setAttribute("href", song.song.albumURL);
        songTitleLink.setAttribute("target", "blank");
        songTitleLink.setAttribute("id", "spotifyTrack");
        songTitleLink.innerText = song.song.name;
        flexDivSecondChild.appendChild(songTitleLink);
        
        const artistDiv = document.createElement("div");
        artistDiv.classList.add("d-flex", "flex-row", "flex-wrap");
        artistDiv.setAttribute("id", "spotifyArtist");
        const artistEl = assembleArtistElement(song);
        artistEl.forEach((artist) => artistDiv.appendChild(artist));
        flexDivSecondChild.appendChild(artistDiv);
        flexDiv.appendChild(flexDivFirstChild);
        flexDiv.appendChild(flexDivSecondChild);
        spotifyComponent.appendChild(flexDiv);
        spotifyComponentContainer.appendChild(spotifyComponent);
      }
  
      function syncSpotifyComponent(song) {
        const spotifyComponentContainer = document.getElementById('spotifyComponentContainer');
        const spotifyComponent = document.getElementById('spotifyComponent');
        if(!song || song.error){
          if(spotifyComponentContainer.classList.contains("slide-down")){
            spotifyComponentContainer.classList.add("slide-up");
            spotifyComponentContainer.classList.remove("slide-down");
            if(spotifyComponent) spotifyComponentContainer.removeChild(spotifyComponent);
          }
          return;
        }
        
        if(!spotifyComponent){
          renderSpotifyComponent(song);
        }else{
          const artistNodes = document.querySelectorAll(".artist");
          const spotifyAlbumHref = document.getElementById("spotifyAlbumHref");
          const spotifyAlbumImage = document.getElementById("spotifyAlbumImage");
          const spotifyArtist = document.getElementById("spotifyArtist");
          const spotifyTrack = document.getElementById("spotifyTrack");
          
          spotifyAlbumHref.setAttribute("href", song.song.trackURL);
          let albumImageUrl = resolveSongAlbum(song);
          spotifyAlbumImage.setAttribute("src", albumImageUrl);
    
          spotifyTrack.innerText = song.song.name;
          spotifyTrack.setAttribute("href", song.song.album.external_urls.spotify); 

          artistNodes.forEach((node) => node.remove());
          const artistEl = assembleArtistElement(song);
          artistEl.forEach((artist) => spotifyArtist.appendChild(artist));
        }

        spotifyComponentContainer.classList.add("slide-down");
        spotifyComponentContainer.classList.remove("slide-up");

      }
      
      document.addEventListener("visibilitychange", () => {
        if (document.visibilityState === 'visible') {
          focusDate = new Date();
          if(blurDate){
            if(focusDate.getTime() - blurDate.getTime() >= 60000){
              fetchNextSong(1);
            }
          }
        }else {
          blurDate = new Date()
        }
      });
      ${
        song
          ? `fetchNextSong(${
              song?.duration * 1000 - song?.playingSecond * 1000 === 0
                ? 60000
                : song?.duration * 1000 - song?.playingSecond * 1000
            });`
          : `fetchNextSong(60000); syncSpotifyComponent(null);`
      }
    });
  </script>
  `
  );
}
