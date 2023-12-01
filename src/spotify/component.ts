import { componentScripts } from "./componentScripts";
import { componentStyles } from "./componentStyles";

export function renderSpotifyComponent() {
  //prettier-ignore
  const template =
      `<section class="navbar fixed-top" id="spotifyComponentContainer">
        <div class="container-fluid" id="spotifyComponent">
            <gabi-spotify-song-fetcher>
              <gabi-spotify-presenter slot="presenter"></gabi-spotify-presenter>
            </gabi-spotify-song-fetcher>
        </div>
      </section>`;

  return componentStyles + template + componentScripts;
}
