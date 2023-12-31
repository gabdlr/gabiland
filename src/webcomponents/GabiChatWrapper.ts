class GabiChatWrapper extends HTMLElement {
  drone: any;
  room: any;
  presenter: GabiChatPresenter | null = null;
  alreadyStarted = false;

  constructor() {
    super();
    this.attachShadow({ mode: "open" });
    const presenterSlot = document.createElement("slot");
    presenterSlot.name = "presenter";
    this.shadowRoot?.appendChild(presenterSlot);
  }

  connectedCallback() {
    this.shadowRoot?.addEventListener("slotchange", () => {
      this.presenter = document.querySelector("gabi-chat-presenter");
      this.presenter?.shadowRoot?.addEventListener<any>(
        gabiChatEvents.publishMessage,
        (event) => this.publishMessage(event.detail)
      );
    });
    const SCALEDRONE_CDN = "https://cdn.scaledrone.com/scaledrone.min.js";
    //@ts-ignore
    if (!window.ScaleDrone) {
      const scriptElement = document.createElement("script");
      scriptElement.src = SCALEDRONE_CDN;
      const documentHead = document.querySelector("head");
      scriptElement.onload = this.setUpDrone.bind(this);
      documentHead?.appendChild(scriptElement);
    } else {
      this.setUpDrone();
    }
  }

  setUpDrone() {
    const CLIENT_ID = "IMWtB9IIGdCktA3W";
    //@ts-ignore
    this.drone = new ScaleDrone(CLIENT_ID, {});

    this.drone.on("open", (error: Error) => {
      if (error) {
        console.error(error);
      }
      this.startChatRoomSession();
    });

    this.drone.on("close", (event: Event) => {
      this.shadowRoot?.dispatchEvent(
        new CustomEvent(gabiChatEvents.close, {
          detail: event,
          bubbles: false,
          cancelable: false,
          composed: false,
        })
      );
    });

    this.drone.on("error", (error: any) => {
      this.shadowRoot?.dispatchEvent(
        new CustomEvent(gabiChatEvents.error, {
          detail: error,
          bubbles: false,
          cancelable: false,
          composed: false,
        })
      );
      console.error(error);
    });
  }

  startChatRoomSession() {
    this.room = this.drone.subscribe(this.getRoomName(), {
      historyCount: 100,
    });

    this.room.on("open", (error: Error) => {
      if (error) {
        console.error(error);
      } else {
        this.shadowRoot?.dispatchEvent(
          new CustomEvent(gabiChatEvents.open, {
            bubbles: false,
            cancelable: false,
            composed: false,
          })
        );
      }
    });

    this.room.on("data", (data: any) => {
      this.shadowRoot?.dispatchEvent(
        new CustomEvent(gabiChatEvents.data, {
          detail: data,
          bubbles: false,
          cancelable: false,
          composed: false,
        })
      );
    });

    this.room.on("history_message", (log: any) => {
      this.shadowRoot?.dispatchEvent(
        new CustomEvent(gabiChatEvents.historyMessage, {
          detail: log,
          bubbles: false,
          cancelable: false,
          composed: false,
        })
      );
    });

    this.alreadyStarted = true;
  }

  getRoomName() {
    const LOCAL_STORAGE_CHAT_SESSION_ID = "LOCAL_STORAGE_CHAT_SESSION_ID";

    function generateRoomName() {
      return (
        Math.random().toString(36).substring(2) +
        Date.now().toString(36).substring(2)
      );
    }

    let localStorageChatSessionId = localStorage.getItem(
      LOCAL_STORAGE_CHAT_SESSION_ID
    );

    if (!localStorageChatSessionId) {
      const roomName = "observable-" + generateRoomName();
      localStorage.setItem(LOCAL_STORAGE_CHAT_SESSION_ID, roomName);
      localStorageChatSessionId = roomName;
    }
    return localStorageChatSessionId;
  }

  disconnectedCallback() {
    this.drone.close();
  }

  publishMessage(message: { message: string; visitor: boolean }) {
    this.drone.publish({ message, room: this.room.name });
  }
}
customElements.define("gabi-chat-wrapper", GabiChatWrapper);
const gabiChatEvents = {
  open: "GabiChatOpen",
  data: "GabiChatData",
  historyMessage: "GabiChatHistoryMessage",
  close: "GabiChatClose",
  error: "GabiChatError",
  publishMessage: "GabiChatPublishMessage",
} as const;
