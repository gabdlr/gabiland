export const componentStyles = `<style>
  #spotifyComponentContainer {
    background-color: #181818; 
    border-bottom: 1px solid #282828;
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
</style>`;
