class GabiSpotifySongFetcher extends HTMLElement {
  spotifyWorker;

  constructor() {
    super();

    this.attachShadow({ mode: "open" });
    this.spotifyWorker = new Worker("spotifyWorker.ts");
    this.spotifyWorker.onmessage = (response) => {
      let song = response.data?.song;
      this.shadowRoot?.dispatchEvent(
        new CustomEvent("spotifySong", {
          detail: song,
          bubbles: true,
          cancelable: false,
          composed: true,
        })
      );
    };
    this.spotifyWorker.postMessage(1);
  }

  connectedCallback() {
    if (this.shadowRoot) {
      this.shadowRoot.innerHTML = `<slot name="presenter"></slot>`;
    }
    this.trackVisibility();
  }

  trackVisibility() {
    let blurDate: Date;
    let focusDate: Date;
    document.addEventListener("visibilitychange", () => {
      if (document.visibilityState === "visible") {
        focusDate = new Date();
        if (blurDate) {
          if (focusDate.getTime() - blurDate.getTime() >= 60000) {
            this.spotifyWorker.postMessage(1);
          }
        }
      } else {
        blurDate = new Date();
      }
    });
  }

  disconnectedCallback() {
    this.spotifyWorker.terminate();
  }
}
customElements.define("gabi-spotify-song-fetcher", GabiSpotifySongFetcher);
