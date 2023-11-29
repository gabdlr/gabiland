import { Song } from "../spotify/Song";

class GabiSpotifyPresenter extends HTMLElement {
  isMounted = false;
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
  }

  connectedCallback() {
    document.addEventListener("spotifySong", (e) => {
      const song: Song | null = (e as CustomEvent).detail;
      this.handleSongEvent(song);
    });
  }

  handleSongEvent(song: Song | null) {
    if (!song) {
      if (this.isMounted) {
        this.unmountSpotifyComponent();
        this.isMounted = false;
      }
    } else {
      if (!this.isMounted) {
        this.renderSpotifyComponent(song);
        this.isMounted = true;
      } else {
        this.updateSpotifyComponent(song);
      }
    }
  }

  renderSpotifyComponent(song: Song) {
    const styleElement = document.createElement("style");
    styleElement.textContent = `
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

    `;
    this.shadowRoot?.appendChild(styleElement);

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
    flexDivSecondChild.classList.add(
      "d-flex",
      "flex-column",
      "justify-content-center"
    );

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
    this.shadowRoot?.appendChild(flexDiv);
  }

  updateSpotifyComponent(song: Song) {
    const artistNodes = this.shadowRoot?.querySelectorAll(".artist");
    const spotifyAlbumHref =
      this.shadowRoot?.getElementById("spotifyAlbumHref");
    const spotifyAlbumImage =
      this.shadowRoot?.getElementById("spotifyAlbumImage");
    const spotifyArtist = this.shadowRoot?.getElementById("spotifyArtist");
    const spotifyTrack = this.shadowRoot?.getElementById("spotifyTrack");

    spotifyAlbumHref?.setAttribute("href", song.trackURL);
    let albumImageUrl = this.resolveSongAlbum(song);
    spotifyAlbumImage?.setAttribute("src", albumImageUrl);

    spotifyTrack && (spotifyTrack.innerText = song.name);
    spotifyTrack?.setAttribute("href", song.album.external_urls.spotify);

    artistNodes?.forEach((node) => node.remove());
    const artistEl = this.assembleArtistElement(song);
    artistEl.forEach((artist) => spotifyArtist!.appendChild(artist));
  }

  assembleArtistElement(song: Song) {
    return song.artist.map((artist, index) => {
      const artistRef = document.createElement("a");
      artistRef.setAttribute("href", artist.external_urls.spotify);
      artistRef.setAttribute("target", "blank");
      artistRef.classList.add(
        "artist",
        "song-complementary-info-text",
        "m-0",
        "me-1"
      );
      artistRef.innerText =
        artist.name + (index + 1 !== song.artist.length ? "," : "");
      return artistRef;
    });
  }

  resolveSongAlbum(song: Song) {
    let albumImageUrl = song.album.images.find(
      (imageURL) => imageURL.width === 64
    )?.url;
    if (!albumImageUrl) albumImageUrl = song.album.images[0].url ?? "";
    return albumImageUrl;
  }

  unmountSpotifyComponent() {
    while (this.shadowRoot?.firstChild) {
      this.shadowRoot.removeChild(this.shadowRoot.firstChild);
    }
  }
}
