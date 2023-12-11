export function renderAdminChatComponent(chatRoomId: string) {
  return `
  <!DOCTYPE html>
  <html lang="es">
  <head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="robots" content="index,nofollow,noarchive" />
    <meta name="description" content="A web developer website">
    <title>Gabiland Republic</title>
    <link rel="icon" type="ico" href="https://res.cloudinary.com/programming-web-venture/image/upload/v1677117169/favicon_ioevdp.ico"/>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0-alpha1/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-GLhlTQ8iRABdZLl6O3oVMWSktQOp6b7In1Zl3/Jr59b6EGGoI1aFkw7cmDA6j6gD" crossorigin="anonymous">
    <script type='text/javascript' src='https://cdn.scaledrone.com/scaledrone.min.js'></script>
  </head>
  <style>
  #chatContainer .chat-body::-webkit-scrollbar {
    width: 15px;
  }
  .card{
    width: 80%;
    border: none;
    border-radius: 15px;
  }
  #chatContainer .chat-header{
    background: rgb(246,124,198);
    background: linear-gradient(90deg, rgba(246,124,198,1) 0%, rgba(232,52,160,1) 74%);
    border-radius: 15px;
    border-bottom-right-radius: 0;
    border-bottom-left-radius: 0;
    font-size: 12px;
    height: 46px;
  }
  #chatContainer .chat{
    border: none;
    background: #E2FFE8;
    font-size: 10px;
    border-radius: 20px;
  }
  #chatContainer .bg-white{
    border: 1px solid #E7E7E9;
    font-size: 10px;
    border-radius: 20px;
  }
  #chatContainer .form-control{
    border-radius: 12px;
    border-top-right-radius: 0;
    border-bottom-right-radius: 0;
    border: 1px solid #F0F0F0;
    font-size: 12px;
    resize: none; 
    overflow: hidden;
  }
  #chatContainer .form-control:focus{
    box-shadow: none;
    outline: none !important;
    border:1px solid #e71ad2;
  }
  #chatContainer .form-control::placeholder{
    font-size: 12px;
    color: #C4C4C4;
  }

  #chatContainer.chat-container{
    display: none!important;
    width: 225px;
  }

  #chatContainer .chat-title > span{
    color: #ffffff;
    font-weight: bold;
    font-size: 14px;
    line-height: 14px;
    text-shadow: 1.5px 1.3px #3b3333;
  }

  #chatContainer .chat-body{
    height: 400px;
    overflow: scroll;
  }

  #chatContainer .form-group .btn {
    border-top-left-radius: 0;
    border-bottom-left-radius: 0;
    border-top-right-radius: 50%;
    border-bottom-right-radius: 50%;
    --bs-btn-hover-bg: #e71ad2;
    --bs-btn-hover-border-color: #e71ad2;
    --bs-btn-bg: #f577c3;
    --bs-btn-border-color: #f577c3;
    --bs-btn-padding-x: 0;
  }

  .form-group .btn:active{
    --bs-btn-active-bg: #e71ad2;
    --bs-btn-active-border-color: #e71ad2;
  }

  .contact-container {
    position: fixed;
    bottom: 30px; 
    right: 30px; 
    z-index: 999;
  }
  .icon {
    animation: rotation 4s infinite linear;
  }
  @keyframes rotation {
    from {
      transform: rotate(0deg);
    }
    to {
      transform: rotate(359deg);
    }
  }
  </style>
  <body>
    <div class="row row justify-content-center align-items-center vh-100">
      <div id="chatContainer" class="card">
        <div class="d-flex flex-row justify-content-between p-3 chat-header chat-title">
          <span class="font-weight-light">Gabiland's embassy</span>
          <span class="chat-close" aria-pressed="false" role="button" onclick="toggleChat()">X</span>
        </div>
        <div class="px-2 chat-body">
        </div> 
        <div class="form-group p-2 pt-0">
          <form id="chatForm">
            <div class="d-flex">
              <input
                id="chatInput"
                style="resize: none; overflow: hidden;"
                class="form-control"
                placeholder="Write your message..."
              />
              <button type="submit" class="btn btn-success">
                <svg width="30px" height="30px" viewBox="0 0 400 400" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <g id="SVGRepo_bgCarrier" stroke-width="0"/>
                  <g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"/>
                  <g id="SVGRepo_iconCarrier">
                    <path d="M165.865 345C67.4268 338.855 27.5031 77.085 213.503 69.1662C405.382 60.997 340.806 357.21 197.786 260.179C147.022 225.723 192.405 137.4 241.736 158.785" stroke="#fafafa" stroke-opacity="0.9" stroke-width="16" stroke-linecap="round" stroke-linejoin="round"/>
                  </g>
                </svg>
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
</body>
<script>


  document.addEventListener("DOMContentLoaded", () => {

    const CLIENT_ID = 'IMWtB9IIGdCktA3W';
    const drone = new ScaleDrone(CLIENT_ID, {});
    const roomName = 'observable-${chatRoomId}';
    
    drone.on('open', error => {
      if (error) {
        return console.error(error);
      }
      
      const room = drone.subscribe(roomName,{
        historyCount: 100
      });
      room.on('open', error => {
        if (error) {
          return console.error(error);
        }
      });

      room.on('data', (data) => {
          addMessageToListDOM(data.message,data.visitor);
      });
      room.on('history_message', log => {
        addMessageToListDOM(log.data.message,log.data.visitor);
      });
    });
    
    drone.on('close', event => {
      console.log('Connection was closed', event);
    });
    
    drone.on('error', error => {
      console.error(error);
    });
    
    
    //------------- DOM STUFF
    
    const DOM = {
      messages: document.querySelector('.chat-body'),
      input: document.getElementById('chatInput'),
      form: document.getElementById('chatForm'),
    };
    
    DOM.form.addEventListener('submit', sendMessage);
    
    function sendMessage(event) {
      event.preventDefault();
      const value = DOM.input.value;
      if (value === '') {
        return;
      }
      DOM.input.value = '';
      drone.publish({
        room: roomName,
        message: {message: value,visitor:false},
      });
    }
    
    function createMessageElement(text,isVisitor = true) {
      const el = document.createElement('div');
      if(isVisitor){
        el.innerHTML = \`<div class="d-flex flex-row pt-2 justify-content-start flex-row-reverse">
        <div class="d-flex no-wrap">
          <svg class="d-inline" width="30px" height="30px" viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" aria-hidden="true" role="img" class="iconify iconify--fxemoji" preserveAspectRatio="xMidYMid meet">
            <path fill="#FFA1E0" d="M440.978 323.425c3.819-14.914 5.852-30.544 5.852-46.649c0-103.524-83.926-187.46-187.46-187.46c-22.642 0-44.346 4.014-64.439 11.37c-39.597-53.207-108.116-71.15-117.883-62.258c-13.158 11.98-32.999 74.787-5.471 141.8c3.49 8.496 8.713 16.362 15.139 23.411c-9.532 22.473-14.806 47.189-14.806 73.136c0 16.106 2.033 31.735 5.852 46.649c-6.345 11.508-9.789 23.817-9.789 36.614c0 63.903 49.429 115.707 191.397 115.707s191.397-51.804 191.397-115.707c0-12.796-3.444-25.106-9.789-36.613z"></path>
            <path fill="#FFC7EF" d="M259.37 299.192c-80.334 0-99.93 33.493-99.93 74.808c0 41.316 19.596 74.808 99.93 74.808S359.3 415.316 359.3 374c0-41.315-19.595-74.808-99.93-74.808z"></path><path fill="#E583C9" d="M228.347 366.537c0 14.532-7.888 26.312-17.617 26.312s-17.617-11.78-17.617-26.312s7.888-26.312 17.617-26.312s17.617 11.78 17.617 26.312zm79.664-26.312c-9.73 0-17.617 11.78-17.617 26.312s7.888 26.312 17.617 26.312s17.617-11.78 17.617-26.312s-7.888-26.312-17.617-26.312z"></path>
            <path fill="#2B3B47" d="M376.812 230.085V271.805c0 13.985-11.337 25.321-25.321 25.321s-25.321-11.337-25.321-25.321V230.085c0-13.985 11.337-25.321 25.321-25.321s25.321 11.336 25.321 25.321zM167.25 204.763c-13.985 0-25.321 11.337-25.321 25.321V271.804c0 13.985 11.337 25.321 25.321 25.321s25.321-11.337 25.321-25.321v-41.719c0-13.985-11.337-25.322-25.321-25.322zm43.48 144.092c-9.73 0-17.617 11.78-17.617 26.312s7.888 26.312 17.617 26.312s17.617-11.78 17.617-26.312s-7.887-26.312-17.617-26.312zm97.281 0c-9.73 0-17.617 11.78-17.617 26.312s7.888 26.312 17.617 26.312s17.617-11.78 17.617-26.312s-7.888-26.312-17.617-26.312z"></path>
            <path fill="#E583C9" d="M93.158 182.158c-20.737-50.48-9.529-93.588.383-102.612c6.398-5.825 46.27 3.638 76.174 32.563c-31.392 17.129-57.338 42.974-74.602 74.281a57.871 57.871 0 0 1-1.955-4.232zm335.801 14.663c12.297-13.871 28.025-49.209 38.205-68.102c0 0-30.307-15.857-66.709-46.109c-18.014-14.971-27.164-24.931-63.187 23.616c40.232 18.406 72.814 50.628 91.691 90.595z"></path>
            <path fill="#FFA1E0" d="M359.3 81.64c71.309-5.37 65.299 64.754 65.628 88.668c0 0 52.798-6.458 53.367-28.893S422.704 19.681 359.3 81.64z"></path>
          </svg>
        </div>  
        <div class="bg-white mr-2 p-3">
          <span class="text-muted">\${text}</span>
        </div>
      </div>\`;
      }
      else{
        el.innerHTML = \`<div class="d-flex flex-row pt-2">
          <div class="d-flex no-wrap">
            <svg width="30px" height="30px" viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" aria-hidden="true" role="img" class="iconify iconify--emojione" preserveAspectRatio="xMidYMid meet" fill="#000000" transform="matrix(-1, 0, 0, 1, 0, 0)">
            <g id="SVGRepo_bgCarrier" stroke-width="0"/>
              <g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"/>
              <g id="SVGRepo_iconCarrier"> <path d="M2 2l4.4 5.9c.3-.6.7-1.2 1-1.9L2 2" fill="#ff9c70"></path>
                <path d="M9.1 11.5c.7-.9 1.4-1.8 2-2.7L7.5 6.1c-.3.6-.7 1.2-1 1.9l2.6 3.5" fill="#ffe76e"></path>
                <path d="M11.6 14.9l3.3-3.3l-3.8-2.8c-.7.9-1.4 1.8-2 2.7l2.5 3.4" fill="#d3ff75"></path>
                <path d="M14.1 18.2l4.8-3.6l-3.9-2.9l-3.3 3.3l2.4 3.2" fill="#59ffba"></path>
                <path d="M16.4 21.3c2.2-1.2 4.4-2.5 6.5-3.7l-4.1-3.1l-4.8 3.6l2.4 3.2" fill="#73deff"></path>
                <path d="M23 17.6c-2.2 1.2-4.4 2.5-6.5 3.7l3.9 5.2l4.9-4.9l1.4-1.4l-3.7-2.6" fill="#8387f7"></path>
              <g fill="#ff639b">
                <path d="M32.3 17.8s4.2-7.1 22.2-8.8C36.2 7 31 13.6 31 13.6s.7 2.7 1.3 4.2"></path>
                <path d="M31.1 18.8s9-6.3 25.1-5.2l-14.7 7.1s8.4 1.2 19.8 1.9l-11.9 3.9s4.2 2.6 11.8 5.1l-8 1.2s6.3.4 8.7 6.2l-5.5-.4s2.5 5.9 5.5 9.3l-5.2-3s3 5.1 5.2 10.1l-5.4-1.6c2.5 5.9 4.8 8.4 4.8 8.4c-13.5-4-30.2-43-30.2-43"></path>
              </g> 
                <path d="M29.4 20.4s11.9-5.4 28.7-1.6l-18.2 3.6s12.2.6 19.6 5.8H47.8s7.3 1.7 10.6 7.1l-6.9-.7S59 37.8 62 44.2l-7.3-3.8s5.8 3.1 5 13.4L55.5 45s1.6 10.7 4.8 13.2l-4.4-.1c2 2.2 3 3.9 3 3.9H48.1L29.4 20.4" fill="#fca9c9"></path>
                <path d="M28.2 19s-.6-4.4 2.6-10.9c0 0 4.1 5.1 5.1 14.2L28.2 19" fill="#b2c1c0"></path>
                <path d="M10.4 53.9c1.5 1 5-3 9-3.7c15-2.8 12.2-8.6 12.2-8.6c4.1 5.1-2.2 17.1-5.8 20.4h30.4C56 22 31.1 18.8 31.1 18.8c-.8-7.2-7-10.8-7-10.8c-1.9 4.5-1 12.5-1 12.5C20 25.9 4.2 40.8 2.4 43c-1.8 2.2 3.8 8.8 3.8 8.8c1.5.2 3.4 1.5 4.2 2.1" fill="#eff6f7"></path>
              <g fill="#b2c1c0">
                <path d="M15.1 52c.8-.6 2.7-1.8 5.6-2.4c2-.4 3.9-1 5.7-1.8c1.8-.8 3.4-1.9 4.4-3.6c.9-1.6.9-3.7.2-5.5c1.1 1.6 1.5 3.9.5 5.9c-.9 2-2.8 3.3-4.7 4.1c-1.9.9-3.9 1.4-6 1.7c-2.4.3-4.7 1.2-5.7 1.6"></path>
                <path d="M6.2 45.8c-.5.4-1.8.6-2.2.1c-.4-.5.3-1.6.8-1.9c.5-.4 1.2-.3 1.6.2c.4.6.3 1.3-.2 1.6"></path>
                <path d="M15.9 43.1c-.1 2.3-1.3 4.6-3.1 6.2c-.9.8-2 1.5-3.1 1.9c-1.1.4-2.4.6-3.6.6c2.3-.7 4.4-1.7 6-3.2c.8-.7 1.5-1.6 2.2-2.5c.6-.9 1.2-1.9 1.6-3"></path>
              </g>
              <path d="M16.4 35.2s.9-.7 1.7-.5c0 0-1.1 1.1-.3 2.9c0 0 .9-2.1 2.5-2.2c0 0-1.1 1.5.3 2.9c0 0 .3-2.1 2.3-2.8c0 0-.3 1.1.7 2.5c0 0-.3-1.9 1.1-2.9c1.4-.9 3-1.5 3.7-3.8c0 0-3.4 3.5-8.1 2.5c-1.1-.4-2.9-.7-3.9 1.4" fill="#3e4347"></path>
              <g fill="#b2c1c0">
                <path d="M25.4 21.6c-1.7-2.2-.6-8.4-.4-9.3c.2-1 5.8 2.8 4.3 9.5c-.1.6-.4 1.2-1 1.2s-.6-1.7-.3-2.8c.3-1.1-.4 0-.6.7c-.3.8-.5.2-.4-.6c.1-.8-.6.8-.4 1.7c.1.9 0 1.1-1.2-.4"></path>
                <path d="M5 42.1c-.5.3-.4.5 0 .3c.5-.2 2.7-.7 2.9 1.6c0 0 .1 1.1.4 0c.3-1-.3-3.7-3.3-1.9"></path>
              </g>
              <g fill="#ff639b">
                <path d="M23 18s2.7 11 13.5 16.6c0 0-26.6-5.8-13.5-16.6"></path>
                <path d="M31.1 18.8s6.8 18 20.8 23C38.1 28.6 41.5 21.2 30.5 16c0 0 0 1.3.6 2.8"></path>
              </g>
              <path d="M31.7 41.6S38 45.7 33.4 62h-7.5s9.3-11.2 5.8-20.4" fill="#b2c1c0"></path>
            </g>
            </svg>
          </div>
          <div class="chat ml-2 p-3">\${text}</div>
        </div>\`
      }
      return el;
    }
    
    function addMessageToListDOM(text,isVisitor) {
      const el = DOM.messages;
      const wasTop = el.scrollTop === el.scrollHeight - el.clientHeight;
      el.appendChild(createMessageElement(text,isVisitor));
      if (wasTop) {
        el.scrollTop = el.scrollHeight - el.clientHeight;
      }
    }
  });
</script> 
  `;
}
