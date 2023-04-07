export const spotifyWorker = `
onmessage = (time) => fetchNextSong((time = 60000));

function fetchNextSong(timeToNextSong) {
  setTimeout(() => {
    fetch("/song")
      .then((response) => response.json())
      .then((response) => {
        postMessage(response);
        if (response.error) {
          return fetchNextSong(60000);
        }
        let timeToNextSong =
          response.song?.duration - response.song?.playingSecond;
        if (timeToNextSong === 0) timeToNextSong = 30000;
        return fetchNextSong(timeToNextSong);
      })
      .catch((e) => {
        let error = { error: e };
        postMessage(null);
        fetchNextSong(60000);
      });
  }, timeToNextSong);
}

`;
