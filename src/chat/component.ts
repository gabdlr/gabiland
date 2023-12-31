import { chatStyles } from "./styles";
export function renderChatComponent() {
  return `
  ${chatStyles}

<script defer>
  renderChatSvgIcon();
  document.addEventListener('gabiChatClose', toggleChat);  
  function renderChatSvgIcon() {
    const svgChatIconElement = document.createElementNS(
      "http://www.w3.org/2000/svg",
      "svg"
    );
    svgChatIconElement.id = "chatSvgIcon";
    const svgChatIconElementClasses = ["icon"];
    svgChatIconElement.classList.add(...svgChatIconElementClasses);
    svgChatIconElement.setAttribute("aria-pressed", "false");
    svgChatIconElement.setAttribute("fill", "#000000");
    svgChatIconElement.setAttribute("heigth", "65px");
    svgChatIconElement.setAttribute("role", "button");
    svgChatIconElement.setAttribute("version", "1.1");
    svgChatIconElement.setAttribute("viewBox", "0 0 1024 1024");
    svgChatIconElement.setAttribute("width", "65px");
    svgChatIconElement.setAttribute("xmlns", "http://www.w3.org/2000/svg");

    const svgChatIconElFirstG = document.createElementNS(
      "http://www.w3.org/2000/svg",
      "g"
    );
    svgChatIconElFirstG.setAttribute("id", "SVGRepo_bgCarrier");
    svgChatIconElFirstG.setAttribute("stroke-width", "0");

    const svgChatIconElSecondG = document.createElementNS(
      "http://www.w3.org/2000/svg",
      "g"
    );
    svgChatIconElSecondG.setAttribute("id", "SVGRepo_tracerCarrier");
    svgChatIconElSecondG.setAttribute("stroke-linecap", "round");
    svgChatIconElSecondG.setAttribute("stroke-linejoin", "round");

    const svgChatIconElThirdG = document.createElementNS(
      "http://www.w3.org/2000/svg",
      "g"
    );
    svgChatIconElThirdG.setAttribute("id", "SVGRepo_iconCarrier");

    const pathElArray = [];
    for(let i = 0; i < 9; i++){
      pathElArray.push(document.createElementNS("http://www.w3.org/2000/svg", "path"));
    }
    pathElArray[0].setAttribute(
      "d",
      "M1001 500.5c0 234.6-219.2 424.8-489.7 424.8-70.2 0-136.9-12.8-197.3-35.9-25.1-9.6-129.6 72.9-152.3 60-25.3-14.5 31.5-124.8 9.7-143C79.1 729.1 21.7 620.6 21.7 500.5c0-234.6 219.2-424.8 489.7-424.8S1001 265.9 1001 500.5z"
    );
    pathElArray[0].setAttribute("fill", "#FAFCFB");
    pathElArray[1].setAttribute(
      "d",
      "M168 964.3c-4.8 0-9.1-1-12.9-3.2-16.4-9.4-13.6-32.5-12.7-40.1 1.7-14 6.2-31 10.5-47.4 3.5-13.4 7.2-27.3 9-38.6 2.2-13.2 0.9-17.7 0.6-18.7-48.2-40.3-86.1-87.7-112.6-140.8-27.7-55.3-41.7-114.2-41.7-175 0-59.4 13.4-117 39.8-171.3 25.5-52.2 61.9-99.1 108.2-139.3 46.2-40.1 100-71.6 159.8-93.5 61.9-22.7 127.6-34.2 195.3-34.2s133.4 11.5 195.3 34.2c59.9 22 113.6 53.4 159.8 93.5 46.4 40.2 82.8 87.1 108.2 139.3 26.4 54.2 39.8 111.9 39.8 171.3 0 59.4-13.4 117-39.8 171.3-25.5 52.2-61.9 99.1-108.2 139.3-46.2 40.1-100 71.6-159.8 93.5-61.9 22.7-127.6 34.2-195.3 34.2-70.2 0-138-12.3-201.8-36.7-1-0.1-6.3-0.1-22.4 7.3-12.3 5.7-27.2 13.9-41.6 21.9-36 20.1-60.3 33-77.5 33zM511.3 89.2c-64.5 0-127.1 11-185.9 32.6-56.8 20.8-107.7 50.6-151.5 88.6-43.6 37.7-77.8 81.7-101.6 130.6-24.6 50.5-37.1 104.2-37.1 159.4 0 56.6 13.1 111.4 38.9 163C99 713.4 134.7 758 180.2 796c17.2 14.4 8.7 46.9-1.2 84.5-3.6 13.5-7.2 27.6-9.1 39-1.7 10.6-1.3 15.7-0.8 17.8 2.6-0.2 8.7-1.5 21.3-7.3 12.5-5.7 27.6-14.1 42.1-22.2 43.6-24.2 69.1-37.6 86.5-30.9 60.7 23.2 125.5 35 192.4 35 64.5 0 127.1-11 185.9-32.6 56.8-20.8 107.7-50.6 151.5-88.6 43.6-37.8 77.8-81.8 101.7-130.8 24.6-50.5 37.1-104.2 37.1-159.4 0-55.3-12.5-108.9-37.1-159.4-23.9-48.9-58.1-92.9-101.7-130.8-43.7-37.9-94.7-67.7-151.5-88.6-58.9-21.6-121.5-32.5-186-32.5z"
    );
    pathElArray[1].setAttribute("fill", "#0F0F0F");
    pathElArray[2].setAttribute(
      "d",
      "M717.4 405.1m-46.6 0a46.6 46.6 0 1 0 93.2 0 46.6 46.6 0 1 0-93.2 0Z"
    );
    pathElArray[2].setAttribute("fill", "#141414");
    pathElArray[3].setAttribute(
      "d",
      "M345.7 442c-7.5 0-13.5-6-13.5-13.5 0-18.3-13.5-33.2-30-33.2s-30 14.9-30 33.2c0 7.5-6 13.5-13.5 13.5s-13.5-6-13.5-13.5c0-33.2 25.6-60.2 57-60.2s57 27 57 60.2c0 7.4-6.1 13.5-13.5 13.5z"
    );
    pathElArray[3].setAttribute("fill", "#141414");
    pathElArray[4].setAttribute(
      "d",
      "M396.2 532.7c0 60.1 51.8 109.2 115.2 109.2 63.3 0 115.2-49.1 115.2-109.2v-27.9H396.2v27.9z"
    );
    pathElArray[4].setAttribute("fill", "#4F423B");
    pathElArray[5].setAttribute(
      "d",
      "M511.3 655.4c-70.9 0-128.7-55.1-128.7-122.7v-41.4H640v41.4c0 67.7-57.7 122.7-128.7 122.7zM409.7 518.3v14.4c0 52.8 45.6 95.7 101.7 95.7s101.7-42.9 101.7-95.7v-14.4H409.7z"
    );
    pathElArray[5].setAttribute("fill", "#141414");
    pathElArray[6].setAttribute(
      "d",
      "M443.2 588.6a68.1 27.1 0 1 0 136.2 0 68.1 27.1 0 1 0-136.2 0Z"
    );
    pathElArray[6].setAttribute("fill", "#D39E33");
    pathElArray[7].setAttribute(
      "d",
      "M175.9 561.8m-42.5 0a42.5 42.5 0 1 0 85 0 42.5 42.5 0 1 0-85 0Z"
    );
    pathElArray[7].setAttribute("fill", "#9DC6AF");
    pathElArray[8].setAttribute(
      "d",
      "M853.4 561.8m-42.5 0a42.5 42.5 0 1 0 85 0 42.5 42.5 0 1 0-85 0Z"
    );
    pathElArray[8].setAttribute("fill", "#9DC6AF");    
    pathElArray.forEach(el => svgChatIconElThirdG.appendChild(el));    
    
    svgChatIconElement.appendChild(svgChatIconElFirstG);
    svgChatIconElement.appendChild(svgChatIconElSecondG);
    svgChatIconElement.appendChild(svgChatIconElThirdG);
    svgChatIconElement.addEventListener('click', toggleChat)
    document.body.appendChild(svgChatIconElement);
  }

  function renderChat() {
    let chatWrapper = document.querySelector('gabi-chat-wrapper');
    if(!chatWrapper){
      chatWrapper = document.createElement('gabi-chat-wrapper');
      document.body.appendChild(chatWrapper);
    }
    const chatPresenter = document.createElement('gabi-chat-presenter');
    chatPresenter.setAttribute('slot','presenter');
    chatWrapper.appendChild(chatPresenter);
  }
  
  function toggleChat() {
    if(document.getElementById('chatSvgIcon')){
      const svgChatIconElement = document.getElementById('chatSvgIcon');
      document.body.removeChild(svgChatIconElement);
      renderChat();
    }else{
      renderChatSvgIcon();
    }
  }
</script> 
  `;
}
