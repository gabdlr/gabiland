export const componentScripts = `    
<script>
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
`;
