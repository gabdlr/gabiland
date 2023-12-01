export function renderSpotifyComponent() {
  //prettier-ignore
  const template =
      `<section class="navbar fixed-top" style="background-color: #181818; border-bottom: 1px solid #282828;" id="spotifyComponentContainer">
        <div class="container-fluid" id="spotifyComponent">
            <gabi-spotify-song-fetcher>
              <gabi-spotify-presenter slot="presenter"></gabi-spotify-presenter>
            </gabi-spotify-song-fetcher>
        </div>
      </section>`;

  return (
    `
    <style>
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

    
      ` +
    template +
    `    
    <script>
    
    class GabiSpotifySongFetcher extends HTMLElement {
      constructor() {
          super();
          this.attachShadow({ mode: "open" });
          this.spotifyWorker = new Worker("spotifyWorker.ts");
          this.spotifyWorker.onmessage = (response) => {
              var _a, _b;
              let song = (_a = response.data) === null || _a === void 0 ? void 0 : _a.song;
              (_b = this.shadowRoot) === null || _b === void 0 ? void 0 : _b.dispatchEvent(new CustomEvent("spotifySong", {
                  detail: song,
                  bubbles: true,
                  cancelable: false,
                  composed: true,
              }));
          };
          this.spotifyWorker.postMessage(1);
      }
      connectedCallback() {
          if (this.shadowRoot) {
              this.shadowRoot.innerHTML = \`<slot name="presenter"></slot>\`;
          }
          this.trackVisibility();
      }
      trackVisibility() {
          let blurDate;
          let focusDate;
          document.addEventListener("visibilitychange", () => {
              if (document.visibilityState === "visible") {
                  focusDate = new Date();
                  if (blurDate) {
                      if (focusDate.getTime() - blurDate.getTime() >= 60000) {
                          this.spotifyWorker.postMessage(1);
                      }
                  }
              }
              else {
                  blurDate = new Date();
              }
          });
      }
      disconnectedCallback() {
          this.spotifyWorker.terminate();
      }
  }
  
    
      class GabiSpotifyPresenter extends HTMLElement {
        constructor() {
            super();
            this.isMounted = false;
            this.attachShadow({ mode: "open" });
        }
        connectedCallback() {
            document.addEventListener("spotifySong", (e) => {
                const song = e.detail;
                this.handleSongEvent(song);
            });
        }
        handleSongEvent(song) {
            if (!song) {
                if (this.isMounted) {
                    this.unmountSpotifyComponent();
                    this.isMounted = false;
                }
            }
            else {
                if (!this.isMounted) {
                    this.renderSpotifyComponent(song);
                    this.isMounted = true;
                }
                else {
                    this.updateSpotifyComponent(song);
                }
            }
        }
        renderSpotifyComponent(song) {
            var _a, _b;
            const styleElement = document.createElement("style");
            styleElement.textContent = \`
        img, svg {
          vertical-align: middle;
        }
    
        .d-flex {
          display: flex!important;
        }
    
        .flex-column {
          flex-direction: column!important;
        }
    
        .flex-row {
          flex-direction: row!important;
        }
    
        .flex-wrap {
          flex-wrap: wrap!important;
        }
    
        .justify-content-center {
          justify-content: center!important;
        }
    
        .m-0 {
          margin: 0!important;
        }
    
        .me-1 {
          margin-right: .25rem!important;
        }
    
        .me-2 {
          margin-right: .5rem!important;
        }
    
        .song-title-text, .song-complementary-info-text {
          font-family: CircularSp,CircularSp-Arab,CircularSp-Hebr,CircularSp-Cyrl,CircularSp-Grek,CircularSp-Deva,sans-serif;
          margin-block: 0px;
          -webkit-tap-highlight-color: transparent;
          text-decoration: none;
          font-weight: 400;
        }
    
        .song-complementary-info-text {
          font-size: 0.6875rem;
          color: #b3b3b3;
        }
    
        .song-title-text {
          font-size: 0.8125rem;
          color: #fff;
        }
    
        \`;
            (_a = this.shadowRoot) === null || _a === void 0 ? void 0 : _a.appendChild(styleElement);
            const flexDiv = document.createElement("div");
            flexDiv.classList.add("d-flex");
            const flexDivFirstChild = document.createElement("div");
            flexDivFirstChild.classList.add("me-2");
            const imageLink = document.createElement("a");
            imageLink.setAttribute("href", song.trackURL);
            imageLink.setAttribute("id", "spotifyAlbumHref");
            imageLink.setAttribute("target", "blank");
            const imageElement = document.createElement("img");
            imageElement.setAttribute("height", "64px");
            imageElement.setAttribute("width", "64px");
            imageElement.setAttribute("alt", "Album image");
            let albumImageUrl = this.resolveSongAlbum(song);
            imageElement.setAttribute("src", albumImageUrl);
            imageElement.setAttribute("id", "spotifyAlbumImage");
            imageLink.appendChild(imageElement);
            flexDivFirstChild.appendChild(imageLink);
            const flexDivSecondChild = document.createElement("div");
            flexDivSecondChild.classList.add("d-flex", "flex-column", "justify-content-center");
            const songTitleLink = document.createElement("a");
            songTitleLink.classList.add("song-title-text");
            songTitleLink.setAttribute("href", song.albumURL);
            songTitleLink.setAttribute("target", "blank");
            songTitleLink.setAttribute("id", "spotifyTrack");
            songTitleLink.innerText = song.name;
            flexDivSecondChild.appendChild(songTitleLink);
            const artistDiv = document.createElement("div");
            artistDiv.classList.add("d-flex", "flex-row", "flex-wrap");
            artistDiv.setAttribute("id", "spotifyArtist");
            const artistEl = this.assembleArtistElement(song);
            artistEl.forEach((artist) => artistDiv.appendChild(artist));
            flexDivSecondChild.appendChild(artistDiv);
            flexDiv.appendChild(flexDivFirstChild);
            flexDiv.appendChild(flexDivSecondChild);
            //spotifyComponent.appendChild(flexDiv);
            (_b = this.shadowRoot) === null || _b === void 0 ? void 0 : _b.appendChild(flexDiv);
        }
        updateSpotifyComponent(song) {
            var _a, _b, _c, _d, _e;
            const artistNodes = (_a = this.shadowRoot) === null || _a === void 0 ? void 0 : _a.querySelectorAll(".artist");
            const spotifyAlbumHref = (_b = this.shadowRoot) === null || _b === void 0 ? void 0 : _b.getElementById("spotifyAlbumHref");
            const spotifyAlbumImage = (_c = this.shadowRoot) === null || _c === void 0 ? void 0 : _c.getElementById("spotifyAlbumImage");
            const spotifyArtist = (_d = this.shadowRoot) === null || _d === void 0 ? void 0 : _d.getElementById("spotifyArtist");
            const spotifyTrack = (_e = this.shadowRoot) === null || _e === void 0 ? void 0 : _e.getElementById("spotifyTrack");
            spotifyAlbumHref === null || spotifyAlbumHref === void 0 ? void 0 : spotifyAlbumHref.setAttribute("href", song.trackURL);
            let albumImageUrl = this.resolveSongAlbum(song);
            spotifyAlbumImage === null || spotifyAlbumImage === void 0 ? void 0 : spotifyAlbumImage.setAttribute("src", albumImageUrl);
            spotifyTrack && (spotifyTrack.innerText = song.name);
            spotifyTrack === null || spotifyTrack === void 0 ? void 0 : spotifyTrack.setAttribute("href", song.album.external_urls.spotify);
            artistNodes === null || artistNodes === void 0 ? void 0 : artistNodes.forEach((node) => node.remove());
            const artistEl = this.assembleArtistElement(song);
            artistEl.forEach((artist) => spotifyArtist.appendChild(artist));
        }
        assembleArtistElement(song) {
            return song.artist.map((artist, index) => {
                const artistRef = document.createElement("a");
                artistRef.setAttribute("href", artist.external_urls.spotify);
                artistRef.setAttribute("target", "blank");
                artistRef.classList.add("artist", "song-complementary-info-text", "m-0", "me-1");
                artistRef.innerText =
                    artist.name + (index + 1 !== song.artist.length ? "," : "");
                return artistRef;
            });
        }
        resolveSongAlbum(song) {
            var _a, _b;
            let albumImageUrl = (_a = song.album.images.find((imageURL) => imageURL.width === 64)) === null || _a === void 0 ? void 0 : _a.url;
            if (!albumImageUrl)
                albumImageUrl = (_b = song.album.images[0].url) !== null && _b !== void 0 ? _b : "";
            return albumImageUrl;
        }
        unmountSpotifyComponent() {
            var _a;
            while ((_a = this.shadowRoot) === null || _a === void 0 ? void 0 : _a.firstChild) {
                this.shadowRoot.removeChild(this.shadowRoot.firstChild);
            }
        }
    }
    customElements.define(
      "gabi-spotify-song-fetcher",
      GabiSpotifySongFetcher
    );
    customElements.define(
      "gabi-spotify-presenter",
      GabiSpotifyPresenter
    );
    document.addEventListener('spotifySong', (e) => {
      const song = e.detail;
      const spotifyComponentContainer = document.getElementById('spotifyComponentContainer');
      if(!song || song.error){
        if(spotifyComponentContainer.classList.contains("slide-down")){
          spotifyComponentContainer.classList.add("slide-up");
          spotifyComponentContainer.classList.remove("slide-down");
        }
        return;
      }else{
        spotifyComponentContainer.classList.add("slide-down");
        spotifyComponentContainer.classList.remove("slide-up");
      }
    });

  </script>
  `
  );
}
