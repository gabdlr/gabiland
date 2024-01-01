import http from "node:http";
import { utils } from "./utils";
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
import { spotifyWorker } from "./spotify/spotifyWorker";
import { webcomponents } from "./webcomponents";
const hostname = "0.0.0.0";

const server = http.createServer(async (req, res) => {
  res.statusCode = 200;
  res.setHeader("Content-Type", "text/html");
  if (req.url?.includes("/admin/chat")) {
    const room = await resolveAdminChatRequest(req.url);
    if (room) {
      const content = renderAdminChatComponent(room);
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
  } else if (req.url === "/robots.txt") {
    res.setHeader("Content-Type", "text/plain");
    return res.end(`User-agent: *\nDisallow: /assets`);
  } else if (req.url === "/spotifyWorker.ts") {
    res.setHeader("Content-Type", "application/javascript");
    return res.end(spotifyWorker);
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
  } else if (req.url?.startsWith("/mensaje=") && !filterRequest(req.url)) {
    const message = req.url.split("=")[1];
    let incomingMessage = utils.parseURL(message);
    let sanitizedMessage = utils.sanitizeString(incomingMessage);
    if (sanitizedMessage.length > 0) {
      try {
        await storeMessage({ content: sanitizedMessage });
      } catch (error) {
        logError(error);
      }
    }
  }
  const chatComponent = renderChatComponent();
  const messagePanelComponent = await renderMessagePanelComponent();
  const spotifyComponent = renderSpotifyComponent();
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
    <meta http-equiv="Content-Security-Policy" content="default-src 'self'; img-src https://*; child-src 'none'; script-src 'unsafe-inline' https://cdn.scaledrone.com/scaledrone.min.js; style-src-elem https://cdn.jsdelivr.net/npm/bootstrap@5.3.0-alpha1/dist/css/bootstrap.min.css 'unsafe-inline'; worker-src 'self'; connect-src 'self' wss://api.scaledrone.com/v3/websocket;" />
    <title>Gabiland Republic</title>
    <link rel="preconnect" href="wss://api.scaledrone.com/v3/websocket">
    <link rel="preconnect" href="https://res.cloudinary.com">
    <link rel="preconnect" href="https://cdn.jsdelivr.net">
    <link rel="icon" type="ico" href="https://res.cloudinary.com/programming-web-venture/image/upload/v1677117169/favicon_ioevdp.ico"/>
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
    body {
      display: flex;
      justify-content: center;
      align-items: center;
      min-height: 100vh;
      background: radial-gradient(ellipse at bottom, #0d1d31 0%, #0c0d13 100%);
      overflow: hidden;
    }
    
    .stars {
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 120%;
      transform: rotate(-45deg);
    }
    
    .star {
      --star-color: var(--primary-color);
      --star-tail-length: 6em;
      --star-tail-height: 2px;
      --star-width: calc(var(--star-tail-length) / 6);
      --fall-duration: 9s;
      --tail-fade-duration: var(--fall-duration);
      position: absolute;
      top: var(--top-offset);
      left: 0;
      width: var(--star-tail-length);
      height: var(--star-tail-height);
      color: var(--star-color);
      background: linear-gradient(45deg, currentColor, transparent);
      border-radius: 50%;
      filter: drop-shadow(0 0 6px currentColor);
      transform: translate3d(104em, 0, 0);
      animation: fall var(--fall-duration) var(--fall-delay) linear infinite, tail-fade var(--tail-fade-duration) var(--fall-delay) ease-out infinite;
    }
    @media screen and (max-width: 750px) {
      .star {
        animation: fall var(--fall-duration) var(--fall-delay) linear infinite;
      }
    }
    .star:nth-child(1) {
      --star-tail-length: 5.7em;
      --top-offset: 77.03vh;
      --fall-duration: 9.538s;
      --fall-delay: 0.017s;
    }
    .star:nth-child(2) {
      --star-tail-length: 7.31em;
      --top-offset: 20.1vh;
      --fall-duration: 9.097s;
      --fall-delay: 1.605s;
    }
    .star:nth-child(3) {
      --star-tail-length: 5.35em;
      --top-offset: 2.48vh;
      --fall-duration: 9.483s;
      --fall-delay: 9.016s;
    }
    .star:nth-child(4) {
      --star-tail-length: 6.01em;
      --top-offset: 67.31vh;
      --fall-duration: 6.2s;
      --fall-delay: 4.687s;
    }
    .star:nth-child(5) {
      --star-tail-length: 5.38em;
      --top-offset: 99.1vh;
      --fall-duration: 10.678s;
      --fall-delay: 2.711s;
    }
    .star:nth-child(6) {
      --star-tail-length: 5.09em;
      --top-offset: 27.47vh;
      --fall-duration: 9.219s;
      --fall-delay: 6.208s;
    }
    .star:nth-child(7) {
      --star-tail-length: 6.69em;
      --top-offset: 9.53vh;
      --fall-duration: 11.683s;
      --fall-delay: 4.355s;
    }
    .star:nth-child(8) {
      --star-tail-length: 5.39em;
      --top-offset: 43.89vh;
      --fall-duration: 9.36s;
      --fall-delay: 5.752s;
    }
    .star:nth-child(9) {
      --star-tail-length: 5.44em;
      --top-offset: 59.43vh;
      --fall-duration: 11.073s;
      --fall-delay: 6.874s;
    }
    .star:nth-child(10) {
      --star-tail-length: 6.4em;
      --top-offset: 63.96vh;
      --fall-duration: 8.441s;
      --fall-delay: 3.307s;
    }
    .star:nth-child(11) {
      --star-tail-length: 6.67em;
      --top-offset: 67.15vh;
      --fall-duration: 7.983s;
      --fall-delay: 6.309s;
    }
    .star:nth-child(12) {
      --star-tail-length: 6.85em;
      --top-offset: 90.03vh;
      --fall-duration: 7.779s;
      --fall-delay: 4.099s;
    }
    .star:nth-child(13) {
      --star-tail-length: 6.83em;
      --top-offset: 60.85vh;
      --fall-duration: 6.171s;
      --fall-delay: 9.84s;
    }
    .star:nth-child(14) {
      --star-tail-length: 7.25em;
      --top-offset: 66.29vh;
      --fall-duration: 7.648s;
      --fall-delay: 3.428s;
    }
    .star:nth-child(15) {
      --star-tail-length: 7.16em;
      --top-offset: 15.66vh;
      --fall-duration: 9.454s;
      --fall-delay: 8.162s;
    }
    .star:nth-child(16) {
      --star-tail-length: 6.29em;
      --top-offset: 20.48vh;
      --fall-duration: 9.133s;
      --fall-delay: 9.94s;
    }
    .star:nth-child(17) {
      --star-tail-length: 5.74em;
      --top-offset: 82.25vh;
      --fall-duration: 9.625s;
      --fall-delay: 3.401s;
    }
    .star:nth-child(18) {
      --star-tail-length: 5.68em;
      --top-offset: 91.66vh;
      --fall-duration: 10.506s;
      --fall-delay: 9.857s;
    }
    .star:nth-child(19) {
      --star-tail-length: 5.05em;
      --top-offset: 79.4vh;
      --fall-duration: 10.247s;
      --fall-delay: 3.11s;
    }
    .star:nth-child(20) {
      --star-tail-length: 6.22em;
      --top-offset: 34.21vh;
      --fall-duration: 8.832s;
      --fall-delay: 1.402s;
    }
    .star:nth-child(21) {
      --star-tail-length: 7.17em;
      --top-offset: 96.48vh;
      --fall-duration: 7.525s;
      --fall-delay: 4.95s;
    }
    .star:nth-child(22) {
      --star-tail-length: 5.37em;
      --top-offset: 35.42vh;
      --fall-duration: 9.959s;
      --fall-delay: 5.572s;
    }
    .star:nth-child(23) {
      --star-tail-length: 6.03em;
      --top-offset: 48.6vh;
      --fall-duration: 9.988s;
      --fall-delay: 3.943s;
    }
    .star:nth-child(24) {
      --star-tail-length: 6.01em;
      --top-offset: 0.47vh;
      --fall-duration: 8.765s;
      --fall-delay: 9.416s;
    }
    .star:nth-child(25) {
      --star-tail-length: 7.05em;
      --top-offset: 4.2vh;
      --fall-duration: 11.199s;
      --fall-delay: 1.144s;
    }
    .star:nth-child(26) {
      --star-tail-length: 5.37em;
      --top-offset: 42.23vh;
      --fall-duration: 10.04s;
      --fall-delay: 7.039s;
    }
    .star:nth-child(27) {
      --star-tail-length: 6.19em;
      --top-offset: 33.58vh;
      --fall-duration: 6.781s;
      --fall-delay: 5.076s;
    }
    .star:nth-child(28) {
      --star-tail-length: 5.01em;
      --top-offset: 11.9vh;
      --fall-duration: 10.143s;
      --fall-delay: 5.489s;
    }
    .star:nth-child(29) {
      --star-tail-length: 5.25em;
      --top-offset: 12.01vh;
      --fall-duration: 9.694s;
      --fall-delay: 4.234s;
    }
    .star:nth-child(30) {
      --star-tail-length: 5.2em;
      --top-offset: 33.63vh;
      --fall-duration: 6.117s;
      --fall-delay: 8.917s;
    }
    .star:nth-child(31) {
      --star-tail-length: 5.01em;
      --top-offset: 0.53vh;
      --fall-duration: 7.729s;
      --fall-delay: 3.939s;
    }
    .star:nth-child(32) {
      --star-tail-length: 5.52em;
      --top-offset: 78.81vh;
      --fall-duration: 8.172s;
      --fall-delay: 6.738s;
    }
    .star:nth-child(33) {
      --star-tail-length: 7.11em;
      --top-offset: 56.68vh;
      --fall-duration: 9.054s;
      --fall-delay: 2.076s;
    }
    .star:nth-child(34) {
      --star-tail-length: 6.5em;
      --top-offset: 14.52vh;
      --fall-duration: 6.724s;
      --fall-delay: 2.24s;
    }
    .star:nth-child(35) {
      --star-tail-length: 6.28em;
      --top-offset: 34.47vh;
      --fall-duration: 10.968s;
      --fall-delay: 9.767s;
    }
    .star:nth-child(36) {
      --star-tail-length: 5.98em;
      --top-offset: 12.64vh;
      --fall-duration: 6.197s;
      --fall-delay: 7.714s;
    }
    .star:nth-child(37) {
      --star-tail-length: 6.68em;
      --top-offset: 20.86vh;
      --fall-duration: 11.135s;
      --fall-delay: 2.699s;
    }
    .star:nth-child(38) {
      --star-tail-length: 5.58em;
      --top-offset: 16.12vh;
      --fall-duration: 8.695s;
      --fall-delay: 1.113s;
    }
    .star:nth-child(39) {
      --star-tail-length: 6.34em;
      --top-offset: 76.66vh;
      --fall-duration: 8.694s;
      --fall-delay: 4.494s;
    }
    .star:nth-child(40) {
      --star-tail-length: 6.85em;
      --top-offset: 68.54vh;
      --fall-duration: 11.828s;
      --fall-delay: 2.932s;
    }
    .star:nth-child(41) {
      --star-tail-length: 5.3em;
      --top-offset: 38.4vh;
      --fall-duration: 9.78s;
      --fall-delay: 2.694s;
    }
    .star:nth-child(42) {
      --star-tail-length: 7.06em;
      --top-offset: 32.33vh;
      --fall-duration: 7.058s;
      --fall-delay: 7.136s;
    }
    .star:nth-child(43) {
      --star-tail-length: 6.13em;
      --top-offset: 79.78vh;
      --fall-duration: 7.202s;
      --fall-delay: 3.38s;
    }
    .star:nth-child(44) {
      --star-tail-length: 7.19em;
      --top-offset: 38.14vh;
      --fall-duration: 8.077s;
      --fall-delay: 4.399s;
    }
    .star:nth-child(45) {
      --star-tail-length: 7.17em;
      --top-offset: 83.86vh;
      --fall-duration: 6.604s;
      --fall-delay: 1.055s;
    }
    .star:nth-child(46) {
      --star-tail-length: 5.49em;
      --top-offset: 5.54vh;
      --fall-duration: 6.758s;
      --fall-delay: 5.266s;
    }
    .star:nth-child(47) {
      --star-tail-length: 5.28em;
      --top-offset: 42.52vh;
      --fall-duration: 6.761s;
      --fall-delay: 2.998s;
    }
    .star:nth-child(48) {
      --star-tail-length: 6.5em;
      --top-offset: 66.69vh;
      --fall-duration: 11.371s;
      --fall-delay: 7.001s;
    }
    .star:nth-child(49) {
      --star-tail-length: 6.96em;
      --top-offset: 60.78vh;
      --fall-duration: 8.903s;
      --fall-delay: 7.66s;
    }
    .star:nth-child(50) {
      --star-tail-length: 6.79em;
      --top-offset: 62.93vh;
      --fall-duration: 9.264s;
      --fall-delay: 0.103s;
    }
    .star::before, .star::after {
      position: absolute;
      content: "";
      top: 0;
      left: calc(var(--star-width) / -2);
      width: var(--star-width);
      height: 100%;
      background: linear-gradient(45deg, transparent, currentColor, transparent);
      border-radius: inherit;
      animation: blink 2s linear infinite;
    }
    .star::before {
      transform: rotate(45deg);
    }
    .star::after {
      transform: rotate(-45deg);
    }
    
    @keyframes fall {
      to {
        transform: translate3d(-30em, 0, 0);
      }
    }
    @keyframes tail-fade {
      0%, 50% {
        width: var(--star-tail-length);
        opacity: 1;
      }
      70%, 80% {
        width: 0;
        opacity: 0.4;
      }
      100% {
        width: 0;
        opacity: 0;
      }
    }
    @keyframes blink {
      50% {
        opacity: 0.6;
      }
    }
  </style>
  <body>
  <div class="stars">
    <div class="star"></div>
    <div class="star"></div>
    <div class="star"></div>
    <div class="star"></div>
    <div class="star"></div>
    <div class="star"></div>
    <div class="star"></div>
    <div class="star"></div>
    <div class="star"></div>
    <div class="star"></div>
    <div class="star"></div>
    <div class="star"></div>
    <div class="star"></div>
    <div class="star"></div>
    <div class="star"></div>
    <div class="star"></div>
    <div class="star"></div>
    <div class="star"></div>
    <div class="star"></div>
    <div class="star"></div>
    <div class="star"></div>
    <div class="star"></div>
    <div class="star"></div>
    <div class="star"></div>
    <div class="star"></div>
    <div class="star"></div>
    <div class="star"></div>
    <div class="star"></div>
    <div class="star"></div>
    <div class="star"></div>
    <div class="star"></div>
    <div class="star"></div>
    <div class="star"></div>
    <div class="star"></div>
    <div class="star"></div>
    <div class="star"></div>
    <div class="star"></div>
    <div class="star"></div>
    <div class="star"></div>
    <div class="star"></div>
    <div class="star"></div>
    <div class="star"></div>
    <div class="star"></div>
    <div class="star"></div>
    <div class="star"></div>
    <div class="star"></div>
    <div class="star"></div>
    <div class="star"></div>
    <div class="star"></div>
    <div class="star"></div>
  </div>

    ` + chatComponent + `

    <div class="container vh-100">
        ` + spotifyComponent + `
      <main class="d-flex align-items-center h-100 p-4">
        ` + messagePanelComponent + `
      </main>
    </div>
  </body>
  <script>
    history.pushState({prev:window.location.pathname},'','/');
    ${webcomponents}
  </script>
  </html>
  `;
  res.end(content);
});

server.listen(8888, hostname, () => {});
