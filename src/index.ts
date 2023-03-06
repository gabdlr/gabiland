import http from "node:http";
import { utils } from "./utils";
import { fetchSong } from "./spotify/fetchSong";
import { renderSpotifyComponent } from "./spotify/component";
import { songEndpoint } from "./spotify/songEndpoint";
import { filterRequest } from "./utils/requestFilter";
import { renderChatComponent } from "./chat/component";
import { renderAdminChatComponent } from "./chat/admin/component";
import { resolveAdminChatRequest } from "./chat/admin/resolveRequest";
import { sendChatContactEmail } from "./chat/admin/contactEndpoint";
import { storeMessage } from "./storage/messages-panel/storeMessage";
import { renderMessagePanelComponent } from "./messages-panel/component";
import { logError } from "./error-logger/errorLogger";
const hostname = "0.0.0.0";

const server = http.createServer(async (req, res) => {
  res.statusCode = 200;
  res.setHeader("Content-Type", "text/html");
  if (req.url?.includes("/admin/chat")) {
    const room = await resolveAdminChatRequest(req.url);
    if (room) {
      const content = renderAdminChatComponent(+room);
      return res.end(content);
    }
  }
  if (req.url === "/favicon.ico") req.url = "/assets/favicon.ico";
  if (req.url === "/song") {
    const response = await songEndpoint(res);
    return res.end(JSON.stringify(response));
  } else if (req.url === "/chat/contact") {
    res.setHeader("Content-Type", "application/json");
    try {
      await sendChatContactEmail(req);
      return res.end(JSON.stringify({ response: "ok" }));
    } catch (error) {
      logError(error);
      res.statusCode = 400;
      return res.end(JSON.stringify({ error }));
    }
  } else if (
    req.url &&
    new RegExp(/\/assets\/+(\/[\w]\/)*([\w\.\w])+/).test(req.url)
  ) {
    try {
      const file = await utils.serveStaticFile(req.url, res);
      if (file) {
        return file;
      }
    } catch (error) {
      logError(error);
    }
  } else if (req.url && req.url.length > 1 && !filterRequest(req.url)) {
    let incomingMessage = utils.parseURL(req.url);
    let sanitizedMessage = utils.sanitizeString(incomingMessage);
    if (sanitizedMessage.length > 0) {
      await storeMessage({ content: sanitizedMessage });
    }
  }
  const chatComponent = renderChatComponent();
  const messagePanelComponent = await renderMessagePanelComponent();
  const song = await fetchSong();
  const spotifyComponent = renderSpotifyComponent(song);
  // prettier-ignore
  const content =
    `
  <!DOCTYPE html>
  <html lang="es">
  <head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="robots" content="index,nofollow,noarchive" />
    <meta name="description" content="A web developer website">
    <title>Gabiland Republic</title>
    <link rel="preconnect" href="wss://api.scaledrone.com/v3/websocket">
    <link rel="preconnect" href="https://res.cloudinary.com">
    <link rel="preconnect" href="https://cdn.jsdelivr.net">
    <link rel="icon" type="ico" href="https://res.cloudinary.com/programming-web-venture/image/upload/v1677117169/favicon_ioevdp.ico"/>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0-alpha1/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-GLhlTQ8iRABdZLl6O3oVMWSktQOp6b7In1Zl3/Jr59b6EGGoI1aFkw7cmDA6j6gD" crossorigin="anonymous">
    <script type='text/javascript' src='https://cdn.scaledrone.com/scaledrone.min.js'></script>
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
    body{
      background-color: #000000;
      background-image: url( 'https://res.cloudinary.com/programming-web-venture/image/upload/v1677115090/background-image_ynufzh.webp' ); 
      background-position: center; 
      background-size: cover;
      background-repeat: no-repeat;
    }
  </style>
  <body>
    <div class="contact-container">
    ` + chatComponent + `
    </div>
    <div class="container vh-100">
      <div class="navbar fixed-top" style="min-height: 70px;" id="spotifyContainer">
        ` + spotifyComponent + `
      </div>
      <main class="d-flex align-items-center h-100 p-4">
        ` + messagePanelComponent + `
      </main>
    </div>
  </body>
  <script>
  document.addEventListener('DOMContentLoaded', () =>{ 
    history.pushState({prev:window.location.pathname},'','/');
  });
  </script>
  </html>
  `;
  res.end(content);
});

server.listen(8888, hostname, () => {});
