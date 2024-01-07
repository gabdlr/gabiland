export const webcomponents = `
"use strict";
class GabiChatPresenter extends HTMLElement {
    constructor() {
        super();
        this.chatWrapper = null;
        this._elementBuilder = {
            assemble(element, classes = [], attributes = []) {
                if (classes.length > 0)
                    element.classList.add(...classes);
                if (attributes.length > 0) {
                    attributes.forEach((attr) => element.setAttribute(attr.qualifiedName, attr.value));
                }
                return element;
            },
            builders: {
                div: {
                    build() {
                        return document.createElement("div");
                    },
                },
                span: {
                    build() {
                        return document.createElement("span");
                    },
                },
                form: {
                    build() {
                        return document.createElement("form");
                    },
                },
                input: {
                    build() {
                        return document.createElement("input");
                    },
                },
                button: {
                    build() {
                        return document.createElement("button");
                    },
                },
                svg: {
                    build() {
                        return document.createElementNS("http://www.w3.org/2000/svg", "svg");
                    },
                },
                g: {
                    build() {
                        return document.createElementNS("http://www.w3.org/2000/svg", "g");
                    },
                },
                path: {
                    build() {
                        return document.createElementNS("http://www.w3.org/2000/svg", "path");
                    },
                },
            },
            //@ts-ignore
            build(elementType, classes, attributes) {
                let element = this.builders[elementType].build();
                element = this.assemble(element, classes, attributes);
                return element;
            },
            //@ts-ignore
            buildCollection(elementType, classes, attributes, qty = 1) {
                const elements = [];
                for (let i = 0, j = qty; i < j; i++) {
                    let element = this.builders[elementType].build();
                    element = this.assemble(element, classes, attributes);
                    elements.push(element);
                }
                return elements;
            },
            attributeFactory(qualifiedName, value) {
                return { qualifiedName, value };
            },
        };
        this.attachShadow({ mode: "open" });
    }
    connectedCallback() {
        var _a;
        this.chatWrapper = document.querySelector("gabi-chat-wrapper");
        this.render();
        this.setUpListeners();
        if ((_a = this.chatWrapper) === null || _a === void 0 ? void 0 : _a.alreadyStarted) {
            this.chatWrapper.startChatRoomSession();
        }
    }
    autoScrollDown() {
        var _a;
        const chatBodyEl = (_a = this.shadowRoot) === null || _a === void 0 ? void 0 : _a.querySelector("#chatBody");
        if (chatBodyEl) {
            const isTop = chatBodyEl.scrollTop ===
                chatBodyEl.scrollHeight - chatBodyEl.clientHeight;
            if (!isTop) {
                chatBodyEl.scrollTop = chatBodyEl.scrollHeight;
            }
        }
    }
    closeChat() {
        var _a, _b;
        (_a = this.shadowRoot) === null || _a === void 0 ? void 0 : _a.dispatchEvent(new CustomEvent("gabiChatClose", {
            bubbles: true,
            cancelable: false,
            composed: true,
        }));
        (_b = this.chatWrapper) === null || _b === void 0 ? void 0 : _b.removeChild(this);
    }
    enableChatInput() {
        var _a, _b;
        (_b = (_a = this.shadowRoot) === null || _a === void 0 ? void 0 : _a.getElementById("chatInput")) === null || _b === void 0 ? void 0 : _b.removeAttribute("disabled");
    }
    onChatOpen() {
        this.enableChatInput();
    }
    render() {
        var _a, _b;
        const CHAT_TITLE_TEXT = "Gabiland's embassy";
        const CHAT_INPUT_PLACEHOLDER = "Write your message...";
        const styles = document.createElement("style");
        styles.textContent = \`
    *, ::after, ::before {
      box-sizing: border-box;
    }
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
    
    [type=button]:not(:disabled), [type=reset]:not(:disabled), [type=submit]:not(:disabled), button:not(:disabled) {
      cursor: pointer;
    }
    [role=button] {
      cursor: pointer;
    }
    [type=button], [type=reset], [type=submit], button {
      -webkit-appearance: button;
    }
    
    #chatContainer {
      position: fixed;
      bottom: 30px; 
      right: 30px; 
      z-index: 999;
    }
    #chatContainer .bg-white {
      border: 1px solid #E7E7E9;
      font-size: 10px;
      border-radius: 20px;
    }
    #chatContainer .card {
      border-top-right-radius: 0;
      border-top-left-radius: 0;
      border: none;
    }
    #chatContainer .chat {
      border: none;
      background: #E2FFE8;
      font-size: 10px;
      border-radius: 20px;
    }
    #chatContainer .chat-body::-webkit-scrollbar {
      width: 15px;
    }
    #chatContainer.chat-container {
      width: 225px;
    }
    #chatContainer .chat-header {
      background: linear-gradient(90deg, var(--chat-bg-heading-start) 0%, var(--chat-bg-heading-end) 74%);
      border-radius: 15px;
      border-bottom-right-radius: 0;
      border-bottom-left-radius: 0;
      font-size: 12px;
      height: 46px;
    }
    #chatContainer .chat-title > span {
      color: #ffffff;
      font-weight: bold;
      font-size: 14px;
      line-height: 14px;
      text-shadow: 1.5px 1.3px #3b3333;
    }
    #chatContainer .chat-body {
      height: 200px;
      overflow: scroll;
    }
    #chatContainer .form-control {
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
      border:1px solid var(--chat-darken-color);
    }
    #chatContainer .form-control::placeholder{
      font-size: 12px;
      color: #C4C4C4;
    }
    #chatContainer .form-group .btn {
      border-top-left-radius: 0;
      border-bottom-left-radius: 0;
      border-top-right-radius: 50%;
      border-bottom-right-radius: 50%;
      height: 44px;
      --bs-btn-hover-bg: var(--chat-darken-color);
      --bs-btn-hover-border-color: var(--chat-darken-color);
      --bs-btn-bg: var(--chat-lighten-color);
      --bs-btn-border-color: var(--chat-lighten-color);
      --bs-btn-padding-x: 0;
    }
    #chatInput {
      resize: none; 
      overflow: hidden
    }

    button, select {
      text-transform: none;
    }
    input, optgroup, select, textarea {
      margin: 0;
      font-family: inherit;
      font-size: inherit;
      line-height: inherit;
    }
    
    .btn {
      --bs-btn-padding-x: 0.75rem;
      --bs-btn-padding-y: 0.375rem;
      --bs-btn-font-family: ;
      --bs-btn-font-size: 1rem;
      --bs-btn-font-weight: 400;
      --bs-btn-line-height: 1.5;
      --bs-btn-color: #212529;
      --bs-btn-bg: transparent;
      --bs-btn-border-width: var(--bs-border-width);
      --bs-btn-border-color: transparent;
      --bs-btn-border-radius: 0.375rem;
      --bs-btn-hover-border-color: transparent;
      --bs-btn-box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.15),0 1px 1px rgba(0, 0, 0, 0.075);
      --bs-btn-disabled-opacity: 0.65;
      --bs-btn-focus-box-shadow: 0 0 0 0.25rem rgba(var(--bs-btn-focus-shadow-rgb), .5);
      display: inline-block;
      padding: var(--bs-btn-padding-y) var(--bs-btn-padding-x);
      font-family: var(--bs-btn-font-family);
      font-size: var(--bs-btn-font-size);
      font-weight: var(--bs-btn-font-weight);
      line-height: var(--bs-btn-line-height);
      color: var(--bs-btn-color);
      text-align: center;
      text-decoration: none;
      vertical-align: middle;
      cursor: pointer;
      -webkit-user-select: none;
      -moz-user-select: none;
      user-select: none;
      border: var(--bs-btn-border-width) solid var(--bs-btn-border-color);
      border-radius: var(--bs-btn-border-radius);
      background-color: var(--bs-btn-bg);
      transition: color .15s ease-in-out,background-color .15s ease-in-out,border-color .15s ease-in-out,box-shadow .15s ease-in-out;
    }
    .btn-success {
      --bs-btn-color: #fff;
      --bs-btn-bg: #198754;
      --bs-btn-border-color: #198754;
      --bs-btn-hover-color: #fff;
      --bs-btn-hover-bg: #157347;
      --bs-btn-hover-border-color: #146c43;
      --bs-btn-focus-shadow-rgb: 60,153,110;
      --bs-btn-active-color: #fff;
      --bs-btn-active-bg: #146c43;
      --bs-btn-active-border-color: #13653f;
      --bs-btn-active-shadow: inset 0 3px 5px rgba(0, 0, 0, 0.125);
      --bs-btn-disabled-color: #fff;
      --bs-btn-disabled-bg: #198754;
      --bs-btn-disabled-border-color: #198754;
    }
    .btn:hover {
      color: var(--bs-btn-hover-color);
      background-color: var(--bs-btn-hover-bg);
      border-color: var(--bs-btn-hover-border-color);
    }
    .card {
      --bs-card-spacer-y: 1rem;
      --bs-card-spacer-x: 1rem;
      --bs-card-title-spacer-y: 0.5rem;
      --bs-card-title-color: ;
      --bs-card-subtitle-color: ;
      --bs-card-border-width: var(--bs-border-width);
      --bs-card-border-color: var(--bs-border-color-translucent);
      --bs-card-border-radius: var(--bs-border-radius);
      --bs-card-box-shadow: ;
      --bs-card-inner-border-radius: calc(var(--bs-border-radius) - (var(--bs-border-width)));
      --bs-card-cap-padding-y: 0.5rem;
      --bs-card-cap-padding-x: 1rem;
      --bs-card-cap-bg: rgba(var(--bs-body-color-rgb), 0.03);
      --bs-card-cap-color: ;
      --bs-card-height: ;
      --bs-card-color: ;
      --bs-card-bg: var(--bs-body-bg);
      --bs-card-img-overlay-padding: 1rem;
      --bs-card-group-margin: 0.75rem;
      position: relative;
      display: flex;
      flex-direction: column;
      min-width: 0;
      height: var(--bs-card-height);
      word-wrap: break-word;
      background-color: var(--bs-card-bg);
      background-clip: border-box;
      border: var(--bs-card-border-width) solid var(--bs-card-border-color);
      border-radius: var(--bs-card-border-radius);
    }
    .form-control {
      display: block;
      width: 100%;
      padding: 0.375rem 0.75rem;
      font-size: 1rem;
      font-weight: 400;
      line-height: 1.5;
      color: var(--bs-body-color);
      background-color: var(--bs-form-control-bg);
      background-clip: padding-box;
      border: var(--bs-border-width) solid var(--bs-border-color);
      -webkit-appearance: none;
      -moz-appearance: none;
      appearance: none;
      border-radius: 0.375rem;
      transition: border-color .15s ease-in-out,box-shadow .15s ease-in-out;
      resize: none; 
      overflow: hidden;
    }
    .form-control:disabled {
      background-color: var(--bs-form-control-disabled-bg);
      opacity: 1;
    }
    .form-group .btn:active{
      --bs-btn-active-bg: var(--chat-darken-color);
      --bs-btn-active-border-color: var(--chat-darken-color);
    }
    .justify-content-between {
      justify-content: space-between!important;
    }
    .justify-content-center {
      justify-content: center!important;
    }
    .flex-column {
      flex-direction: column!important;
    }
    .flex-row {
      flex-direction: row!important;
    }
    .flex-row-reverse {
      flex-direction: row-reverse!important;
    }
    .d-flex {
      display: flex!important;
    }
    .p-2 {
      padding: 0.5rem!important;
    }
    .p-3 {
      padding: 1rem!important;
    }
    .pt-0 {
      padding-top: 0!important;
    }
    .pt-2 {
      padding-top: 0.5rem!important;
    }
    .px-2 {
      padding-right: 0.5rem!important;
      padding-left: 0.5rem!important;
    }
    .text-muted {
      --bs-text-opacity: 1;
      color: var(--bs-secondary-color)!important;
    }
    \`;
        const containerClasses = [
            "d-flex",
            "justify-content-center",
            "chat-container",
            "flex-column",
        ];
        const container = this._elementBuilder.build("div", containerClasses, [
            this._elementBuilder.attributeFactory("id", "chatContainer"),
        ]);
        const headerClasses = [
            "d-flex",
            "flex-row",
            "justify-content-between",
            "p-3",
            "chat-header",
            "chat-title",
        ];
        const header = this._elementBuilder.build("div", headerClasses);
        const headerTitleClasses = ["font-weight-light"];
        const headerTitle = this._elementBuilder.build("span", headerTitleClasses);
        headerTitle.innerText = CHAT_TITLE_TEXT;
        const headerCloseButtonClasses = ["chat-close"];
        const headerCloseButton = this._elementBuilder.build("span", headerCloseButtonClasses, [
            this._elementBuilder.attributeFactory("aria-pressed", "false"),
            this._elementBuilder.attributeFactory("role", "button"),
        ]);
        headerCloseButton.onclick = () => this.closeChat();
        headerCloseButton.innerText = "X";
        header.appendChild(headerTitle);
        header.appendChild(headerCloseButton);
        const bodyContainerClasses = ["card"];
        const bodyContainer = this._elementBuilder.build("div", bodyContainerClasses);
        const bodyClasses = ["px-2", "chat-body"];
        const body = this._elementBuilder.build("div", bodyClasses, [
            this._elementBuilder.attributeFactory("id", "chatBody"),
        ]);
        const footerClasses = ["form-group", "p-2", "pt-0"];
        const footer = this._elementBuilder.build("div", footerClasses);
        const footerForm = this._elementBuilder.build("form", void 0, [
            this._elementBuilder.attributeFactory("id", "chatForm"),
        ]);
        const footerFormContentClasses = ["d-flex"];
        const footerFormContent = this._elementBuilder.build("div", footerFormContentClasses);
        const footerFormContentInputChatInputClasses = ["form-control"];
        const footerFormContentInputChatInput = this._elementBuilder.build("input", footerFormContentInputChatInputClasses, [
            this._elementBuilder.attributeFactory("id", "chatInput"),
            this._elementBuilder.attributeFactory("placeholder", CHAT_INPUT_PLACEHOLDER),
        ]);
        footerFormContentInputChatInput.disabled = true;
        const footerFormContentButtonClasses = ["btn", "btn-success"];
        const footerFormContentButton = this._elementBuilder.build("button", footerFormContentButtonClasses);
        footerFormContentButton.type = "submit";
        const footerFormContentButtonSvg = this._elementBuilder.build("svg", void 0, [
            this._elementBuilder.attributeFactory("width", "30px"),
            this._elementBuilder.attributeFactory("height", "30px"),
            this._elementBuilder.attributeFactory("viewBox", "0 0 400 400"),
            this._elementBuilder.attributeFactory("fill", "none"),
            this._elementBuilder.attributeFactory("xmlns", "http://www.w3.org/2000/svg"),
        ]);
        const footerFormContentButtonSvgGElArray = this._elementBuilder.buildCollection("g", void 0, void 0, 3);
        this._elementBuilder.assemble(footerFormContentButtonSvgGElArray[0], void 0, [
            this._elementBuilder.attributeFactory("id", "SVGRepo_bgCarrier"),
            this._elementBuilder.attributeFactory("stroke-width", "0"),
        ]);
        this._elementBuilder.assemble(footerFormContentButtonSvgGElArray[1], void 0, [
            this._elementBuilder.attributeFactory("id", "SVGRepo_tracerCarrier"),
            this._elementBuilder.attributeFactory("stroke-linecap", "round"),
            this._elementBuilder.attributeFactory("stroke-linejoin", "round"),
        ]);
        this._elementBuilder.assemble(footerFormContentButtonSvgGElArray[2], void 0, [this._elementBuilder.attributeFactory("id", "SVGRepo_iconCarrier")]);
        const footerFormContentButtonSvgThirdGElPath = this._elementBuilder.build("path");
        this._elementBuilder.assemble(footerFormContentButtonSvgThirdGElPath, void 0, [
            this._elementBuilder.attributeFactory("d", "M165.865 345C67.4268 338.855 27.5031 77.085 213.503 69.1662C405.382 60.997 340.806 357.21 197.786 260.179C147.022 225.723 192.405 137.4 241.736 158.785"),
            this._elementBuilder.attributeFactory("stroke", "#fafafa"),
            this._elementBuilder.attributeFactory("stroke-opacity", "0.9"),
            this._elementBuilder.attributeFactory("stroke-width", "16"),
            this._elementBuilder.attributeFactory("stroke-linecap", "round"),
            this._elementBuilder.attributeFactory("stroke-linejoin", "round"),
        ]);
        footerFormContentButtonSvgGElArray[2].appendChild(footerFormContentButtonSvgThirdGElPath);
        footerFormContentButtonSvgGElArray.forEach((el) => footerFormContentButtonSvg.appendChild(el));
        footerFormContentButton.appendChild(footerFormContentButtonSvg);
        footerFormContent.appendChild(footerFormContentInputChatInput);
        footerFormContent.appendChild(footerFormContentButton);
        footerForm.appendChild(footerFormContent);
        footer.appendChild(footerForm);
        bodyContainer.appendChild(body);
        bodyContainer.appendChild(footer);
        container.appendChild(header);
        container.appendChild(bodyContainer);
        (_a = this.shadowRoot) === null || _a === void 0 ? void 0 : _a.appendChild(styles);
        (_b = this.shadowRoot) === null || _b === void 0 ? void 0 : _b.appendChild(container);
    }
    setUpListeners() {
        var _a, _b;
        if ((_a = this.chatWrapper) === null || _a === void 0 ? void 0 : _a.shadowRoot) {
            this.chatWrapper.shadowRoot.addEventListener(gabiChatEvents.open, this.onChatOpen.bind(this));
            this.chatWrapper.shadowRoot.addEventListener(gabiChatEvents.data, (data) => {
                if (!data.detail.visitor) {
                    this.appendMessage(data.detail.message, data.detail.visitor);
                }
            });
            this.chatWrapper.shadowRoot.addEventListener(gabiChatEvents.historyMessage, (e) => {
                this.appendMessage(e.detail.data.message, e.detail.data.visitor);
            });
            this.chatWrapper.shadowRoot.addEventListener(gabiChatEvents.close, () => void 0);
            this.chatWrapper.shadowRoot.addEventListener(gabiChatEvents.error, () => void 0);
        }
        const chatForm = (_b = this.shadowRoot) === null || _b === void 0 ? void 0 : _b.querySelector("#chatForm");
        chatForm === null || chatForm === void 0 ? void 0 : chatForm.addEventListener("submit", this.sendMessage.bind(this));
    }
    appendMessage(message, isVisitor) {
        var _a;
        const chatBody = (_a = this.shadowRoot) === null || _a === void 0 ? void 0 : _a.querySelector("#chatBody");
        const messageEl = this.createMessageEl(message, isVisitor);
        chatBody === null || chatBody === void 0 ? void 0 : chatBody.appendChild(messageEl);
        this.autoScrollDown();
    }
    createMessageEl(text, isVisitor = true) {
        const message = document.createElement("div");
        const messageBlock = document.createElement("div");
        const messageIconWrapperClasses = ["d-flex", "no-wrap"];
        const messageIconWrapper = this._elementBuilder.build("div", messageIconWrapperClasses);
        const messageTextWrapper = document.createElement("div");
        const messageIconSvg = this._elementBuilder.build("svg", void 0, [
            this._elementBuilder.attributeFactory("width", "30px"),
            this._elementBuilder.attributeFactory("height", "30px"),
            this._elementBuilder.attributeFactory("xmlns", "http://www.w3.org/2000/svg"),
            this._elementBuilder.attributeFactory("xmlns:xlink", "http://www.w3.org/1999/xlink"),
            this._elementBuilder.attributeFactory("preserveAspectRatio", "xMidYMid meet"),
            this._elementBuilder.attributeFactory("aria-hidden", "true"),
            this._elementBuilder.attributeFactory("role", "img"),
        ]);
        const messageSpanEl = document.createElement("span");
        messageSpanEl.innerText = text;
        messageTextWrapper.appendChild(messageSpanEl);
        messageIconWrapper.appendChild(messageIconSvg);
        messageBlock.appendChild(messageIconWrapper);
        messageBlock.appendChild(messageTextWrapper);
        message.appendChild(messageBlock);
        if (isVisitor) {
            const messageBlockClasses = [
                "d-flex",
                "flex-row",
                "pt-2",
                "justify-content-start",
                "flex-row-reverse",
            ];
            this._elementBuilder.assemble(messageBlock, messageBlockClasses);
            const messageIconSvgClasses = ["d-inline"];
            this._elementBuilder.assemble(messageIconSvg, messageIconSvgClasses, [
                this._elementBuilder.attributeFactory("viewBox", "0 0 512 512"),
            ]);
            const messageIconSvgPathElArray = this._elementBuilder.buildCollection("path", void 0, void 0, 6);
            this._elementBuilder.assemble(messageIconSvgPathElArray[0], void 0, [
                this._elementBuilder.attributeFactory("fill", "#FFA1E0"),
                this._elementBuilder.attributeFactory("d", "M440.978 323.425c3.819-14.914 5.852-30.544 5.852-46.649c0-103.524-83.926-187.46-187.46-187.46c-22.642 0-44.346 4.014-64.439 11.37c-39.597-53.207-108.116-71.15-117.883-62.258c-13.158 11.98-32.999 74.787-5.471 141.8c3.49 8.496 8.713 16.362 15.139 23.411c-9.532 22.473-14.806 47.189-14.806 73.136c0 16.106 2.033 31.735 5.852 46.649c-6.345 11.508-9.789 23.817-9.789 36.614c0 63.903 49.429 115.707 191.397 115.707s191.397-51.804 191.397-115.707c0-12.796-3.444-25.106-9.789-36.613z"),
            ]);
            this._elementBuilder.assemble(messageIconSvgPathElArray[1], void 0, [
                this._elementBuilder.attributeFactory("fill", "#FFC7EF"),
                this._elementBuilder.attributeFactory("d", "M259.37 299.192c-80.334 0-99.93 33.493-99.93 74.808c0 41.316 19.596 74.808 99.93 74.808S359.3 415.316 359.3 374c0-41.315-19.595-74.808-99.93-74.808z"),
            ]);
            this._elementBuilder.assemble(messageIconSvgPathElArray[2], void 0, [
                this._elementBuilder.attributeFactory("fill", "#E583C9"),
                this._elementBuilder.attributeFactory("d", "M228.347 366.537c0 14.532-7.888 26.312-17.617 26.312s-17.617-11.78-17.617-26.312s7.888-26.312 17.617-26.312s17.617 11.78 17.617 26.312zm79.664-26.312c-9.73 0-17.617 11.78-17.617 26.312s7.888 26.312 17.617 26.312s17.617-11.78 17.617-26.312s-7.888-26.312-17.617-26.312z"),
            ]);
            this._elementBuilder.assemble(messageIconSvgPathElArray[3], void 0, [
                this._elementBuilder.attributeFactory("fill", "#2B3B47"),
                this._elementBuilder.attributeFactory("d", "M376.812 230.085V271.805c0 13.985-11.337 25.321-25.321 25.321s-25.321-11.337-25.321-25.321V230.085c0-13.985 11.337-25.321 25.321-25.321s25.321 11.336 25.321 25.321zM167.25 204.763c-13.985 0-25.321 11.337-25.321 25.321V271.804c0 13.985 11.337 25.321 25.321 25.321s25.321-11.337 25.321-25.321v-41.719c0-13.985-11.337-25.322-25.321-25.322zm43.48 144.092c-9.73 0-17.617 11.78-17.617 26.312s7.888 26.312 17.617 26.312s17.617-11.78 17.617-26.312s-7.887-26.312-17.617-26.312zm97.281 0c-9.73 0-17.617 11.78-17.617 26.312s7.888 26.312 17.617 26.312s17.617-11.78 17.617-26.312s-7.888-26.312-17.617-26.312z"),
            ]);
            this._elementBuilder.assemble(messageIconSvgPathElArray[4], void 0, [
                this._elementBuilder.attributeFactory("fill", "#E583C9"),
                this._elementBuilder.attributeFactory("d", "M93.158 182.158c-20.737-50.48-9.529-93.588.383-102.612c6.398-5.825 46.27 3.638 76.174 32.563c-31.392 17.129-57.338 42.974-74.602 74.281a57.871 57.871 0 0 1-1.955-4.232zm335.801 14.663c12.297-13.871 28.025-49.209 38.205-68.102c0 0-30.307-15.857-66.709-46.109c-18.014-14.971-27.164-24.931-63.187 23.616c40.232 18.406 72.814 50.628 91.691 90.595z"),
            ]);
            this._elementBuilder.assemble(messageIconSvgPathElArray[5], void 0, [
                this._elementBuilder.attributeFactory("fill", "#FFA1E0"),
                this._elementBuilder.attributeFactory("d", "M359.3 81.64c71.309-5.37 65.299 64.754 65.628 88.668c0 0 52.798-6.458 53.367-28.893S422.704 19.681 359.3 81.64z"),
            ]);
            messageIconSvgPathElArray.forEach((el) => messageIconSvg.appendChild(el));
            const messageWrapperClasses = ["bg-white", "p-3"];
            this._elementBuilder.assemble(messageTextWrapper, messageWrapperClasses);
            const messageSpanElClasses = ["text-muted"];
            this._elementBuilder.assemble(messageSpanEl, messageSpanElClasses);
        }
        else {
            const messageBlockClasses = ["d-flex", "flex-row", "pt-2"];
            this._elementBuilder.assemble(messageBlock, messageBlockClasses);
            this._elementBuilder.assemble(messageIconSvg, void 0, [
                this._elementBuilder.attributeFactory("viewBox", "0 0 64 64"),
                this._elementBuilder.attributeFactory("fill", "#000000"),
                this._elementBuilder.attributeFactory("transform", "matrix(-1, 0, 0, 1, 0, 0)"),
            ]);
            const messageIconSvgGElArray = this._elementBuilder.buildCollection("g", void 0, void 0, 3);
            this._elementBuilder.assemble(messageIconSvgGElArray[0], void 0, [
                this._elementBuilder.attributeFactory("id", "SVGRepo_bgCarrier"),
                this._elementBuilder.attributeFactory("stroke-width", "0"),
            ]);
            this._elementBuilder.assemble(messageIconSvgGElArray[1], void 0, [
                this._elementBuilder.attributeFactory("id", "SVGRepo_tracerCarrier"),
                this._elementBuilder.attributeFactory("stroke-linecap", "round"),
                this._elementBuilder.attributeFactory("stroke-linejoin", "round"),
            ]);
            this._elementBuilder.assemble(messageIconSvgGElArray[2], void 0, [
                this._elementBuilder.attributeFactory("id", "SVGRepo_iconCarrier"),
            ]);
            const messageIconSvgThirdGElFirstPathElArray = this._elementBuilder.buildCollection("path", void 0, void 0, 6);
            this._elementBuilder.assemble(messageIconSvgThirdGElFirstPathElArray[0], void 0, [
                this._elementBuilder.attributeFactory("d", "M2 2l4.4 5.9c.3-.6.7-1.2 1-1.9L2 2"),
                this._elementBuilder.attributeFactory("fill", "#ff9c70"),
            ]);
            this._elementBuilder.assemble(messageIconSvgThirdGElFirstPathElArray[1], void 0, [
                this._elementBuilder.attributeFactory("d", "M9.1 11.5c.7-.9 1.4-1.8 2-2.7L7.5 6.1c-.3.6-.7 1.2-1 1.9l2.6 3.5"),
                this._elementBuilder.attributeFactory("fill", "#ffe76e"),
            ]);
            this._elementBuilder.assemble(messageIconSvgThirdGElFirstPathElArray[2], void 0, [
                this._elementBuilder.attributeFactory("d", "M11.6 14.9l3.3-3.3l-3.8-2.8c-.7.9-1.4 1.8-2 2.7l2.5 3.4"),
                this._elementBuilder.attributeFactory("fill", "#d3ff75"),
            ]);
            this._elementBuilder.assemble(messageIconSvgThirdGElFirstPathElArray[3], void 0, [
                this._elementBuilder.attributeFactory("d", "M14.1 18.2l4.8-3.6l-3.9-2.9l-3.3 3.3l2.4 3.2"),
                this._elementBuilder.attributeFactory("fill", "#59ffba"),
            ]);
            this._elementBuilder.assemble(messageIconSvgThirdGElFirstPathElArray[4], void 0, [
                this._elementBuilder.attributeFactory("d", "M16.4 21.3c2.2-1.2 4.4-2.5 6.5-3.7l-4.1-3.1l-4.8 3.6l2.4 3.2"),
                this._elementBuilder.attributeFactory("fill", "#73deff"),
            ]);
            this._elementBuilder.assemble(messageIconSvgThirdGElFirstPathElArray[5], void 0, [
                this._elementBuilder.attributeFactory("d", "M23 17.6c-2.2 1.2-4.4 2.5-6.5 3.7l3.9 5.2l4.9-4.9l1.4-1.4l-3.7-2.6"),
                this._elementBuilder.attributeFactory("fill", "#8387f7"),
            ]);
            messageIconSvgThirdGElFirstPathElArray.forEach((path) => messageIconSvgGElArray[2].appendChild(path));
            const messageIconSvgThirdGElGELArray = this._elementBuilder.buildCollection("g", void 0, void 0, 4);
            this._elementBuilder.assemble(messageIconSvgThirdGElGELArray[0], void 0, [
                this._elementBuilder.attributeFactory("fill", "#ff639b"),
            ]);
            const messageIconSvgThirdGElFirstGElPathElArray = this._elementBuilder.buildCollection("path", void 0, void 0, 2);
            this._elementBuilder.assemble(messageIconSvgThirdGElFirstGElPathElArray[0], void 0, [
                this._elementBuilder.attributeFactory("d", "M32.3 17.8s4.2-7.1 22.2-8.8C36.2 7 31 13.6 31 13.6s.7 2.7 1.3 4.2"),
            ]);
            this._elementBuilder.assemble(messageIconSvgThirdGElFirstGElPathElArray[1], void 0, [
                this._elementBuilder.attributeFactory("d", "M31.1 18.8s9-6.3 25.1-5.2l-14.7 7.1s8.4 1.2 19.8 1.9l-11.9 3.9s4.2 2.6 11.8 5.1l-8 1.2s6.3.4 8.7 6.2l-5.5-.4s2.5 5.9 5.5 9.3l-5.2-3s3 5.1 5.2 10.1l-5.4-1.6c2.5 5.9 4.8 8.4 4.8 8.4c-13.5-4-30.2-43-30.2-43"),
            ]);
            messageIconSvgThirdGElFirstGElPathElArray.forEach((path) => messageIconSvgThirdGElGELArray[0].appendChild(path));
            messageIconSvgGElArray[2].appendChild(messageIconSvgThirdGElGELArray[0]);
            const messageIconSvgThirdGElSecondPathElArray = this._elementBuilder.buildCollection("path", void 0, void 0, 3);
            this._elementBuilder.assemble(messageIconSvgThirdGElSecondPathElArray[0], void 0, [
                this._elementBuilder.attributeFactory("d", "M29.4 20.4s11.9-5.4 28.7-1.6l-18.2 3.6s12.2.6 19.6 5.8H47.8s7.3 1.7 10.6 7.1l-6.9-.7S59 37.8 62 44.2l-7.3-3.8s5.8 3.1 5 13.4L55.5 45s1.6 10.7 4.8 13.2l-4.4-.1c2 2.2 3 3.9 3 3.9H48.1L29.4 20.4"),
                this._elementBuilder.attributeFactory("fill", "#fca9c9"),
            ]);
            this._elementBuilder.assemble(messageIconSvgThirdGElSecondPathElArray[1], void 0, [
                this._elementBuilder.attributeFactory("d", "M28.2 19s-.6-4.4 2.6-10.9c0 0 4.1 5.1 5.1 14.2L28.2 19"),
                this._elementBuilder.attributeFactory("fill", "#b2c1c0"),
            ]);
            this._elementBuilder.assemble(messageIconSvgThirdGElSecondPathElArray[2], void 0, [
                this._elementBuilder.attributeFactory("d", "M10.4 53.9c1.5 1 5-3 9-3.7c15-2.8 12.2-8.6 12.2-8.6c4.1 5.1-2.2 17.1-5.8 20.4h30.4C56 22 31.1 18.8 31.1 18.8c-.8-7.2-7-10.8-7-10.8c-1.9 4.5-1 12.5-1 12.5C20 25.9 4.2 40.8 2.4 43c-1.8 2.2 3.8 8.8 3.8 8.8c1.5.2 3.4 1.5 4.2 2.1"),
                this._elementBuilder.attributeFactory("fill", "#eff6f7"),
            ]);
            messageIconSvgThirdGElSecondPathElArray.forEach((path) => messageIconSvgGElArray[2].appendChild(path));
            messageIconSvgThirdGElGELArray[1].setAttribute("fill", "#b2c1c0");
            const messageIconSvgThirdGElSecondGElPathElArray = this._elementBuilder.buildCollection("path", void 0, void 0, 3);
            messageIconSvgThirdGElSecondGElPathElArray[0].setAttribute("d", "M15.1 52c.8-.6 2.7-1.8 5.6-2.4c2-.4 3.9-1 5.7-1.8c1.8-.8 3.4-1.9 4.4-3.6c.9-1.6.9-3.7.2-5.5c1.1 1.6 1.5 3.9.5 5.9c-.9 2-2.8 3.3-4.7 4.1c-1.9.9-3.9 1.4-6 1.7c-2.4.3-4.7 1.2-5.7 1.6");
            messageIconSvgThirdGElSecondGElPathElArray[1].setAttribute("d", "M6.2 45.8c-.5.4-1.8.6-2.2.1c-.4-.5.3-1.6.8-1.9c.5-.4 1.2-.3 1.6.2c.4.6.3 1.3-.2 1.6");
            messageIconSvgThirdGElSecondGElPathElArray[2].setAttribute("d", "M15.9 43.1c-.1 2.3-1.3 4.6-3.1 6.2c-.9.8-2 1.5-3.1 1.9c-1.1.4-2.4.6-3.6.6c2.3-.7 4.4-1.7 6-3.2c.8-.7 1.5-1.6 2.2-2.5c.6-.9 1.2-1.9 1.6-3");
            messageIconSvgThirdGElSecondGElPathElArray.forEach((path) => messageIconSvgThirdGElGELArray[1].appendChild(path));
            messageIconSvgGElArray[2].appendChild(messageIconSvgThirdGElGELArray[1]);
            const messageIconSvgThirdGElPathElArray = this._elementBuilder.buildCollection("path", void 0, void 0, 2);
            messageIconSvgThirdGElPathElArray[0].setAttribute("d", "M16.4 35.2s.9-.7 1.7-.5c0 0-1.1 1.1-.3 2.9c0 0 .9-2.1 2.5-2.2c0 0-1.1 1.5.3 2.9c0 0 .3-2.1 2.3-2.8c0 0-.3 1.1.7 2.5c0 0-.3-1.9 1.1-2.9c1.4-.9 3-1.5 3.7-3.8c0 0-3.4 3.5-8.1 2.5c-1.1-.4-2.9-.7-3.9 1.4");
            messageIconSvgThirdGElPathElArray[0].setAttribute("fill", "#3e4347");
            messageIconSvgGElArray[2].appendChild(messageIconSvgThirdGElPathElArray[0]);
            messageIconSvgThirdGElGELArray[2].setAttribute("fill", "#b2c1c0");
            const messageIconSvgThirdGElThirdGElPathElArray = this._elementBuilder.buildCollection("path", void 0, void 0, 2);
            messageIconSvgThirdGElThirdGElPathElArray[0].setAttribute("d", "M25.4 21.6c-1.7-2.2-.6-8.4-.4-9.3c.2-1 5.8 2.8 4.3 9.5c-.1.6-.4 1.2-1 1.2s-.6-1.7-.3-2.8c.3-1.1-.4 0-.6.7c-.3.8-.5.2-.4-.6c.1-.8-.6.8-.4 1.7c.1.9 0 1.1-1.2-.4");
            messageIconSvgThirdGElThirdGElPathElArray[1].setAttribute("d", "M5 42.1c-.5.3-.4.5 0 .3c.5-.2 2.7-.7 2.9 1.6c0 0 .1 1.1.4 0c.3-1-.3-3.7-3.3-1.9");
            messageIconSvgThirdGElThirdGElPathElArray.forEach((path) => messageIconSvgThirdGElGELArray[2].appendChild(path));
            messageIconSvgGElArray[2].appendChild(messageIconSvgThirdGElGELArray[2]);
            messageIconSvgThirdGElGELArray[3].setAttribute("fill", "#ff639b");
            const messageIconSvgThirdGElFourthGElPathElArray = this._elementBuilder.buildCollection("path", void 0, void 0, 2);
            messageIconSvgThirdGElFourthGElPathElArray[0].setAttribute("d", "M23 18s2.7 11 13.5 16.6c0 0-26.6-5.8-13.5-16.6");
            messageIconSvgThirdGElFourthGElPathElArray[1].setAttribute("d", "M31.1 18.8s6.8 18 20.8 23C38.1 28.6 41.5 21.2 30.5 16c0 0 0 1.3.6 2.8");
            messageIconSvgThirdGElFourthGElPathElArray.forEach((path) => messageIconSvgThirdGElGELArray[3].appendChild(path));
            messageIconSvgGElArray[2].appendChild(messageIconSvgThirdGElGELArray[3]);
            this._elementBuilder.assemble(messageIconSvgThirdGElPathElArray[1], void 0, [
                this._elementBuilder.attributeFactory("fill", "#b2c1c0"),
                this._elementBuilder.attributeFactory("d", "M31.7 41.6S38 45.7 33.4 62h-7.5s9.3-11.2 5.8-20.4"),
            ]);
            messageIconSvgGElArray[2].appendChild(messageIconSvgThirdGElPathElArray[1]);
            messageIconSvg.appendChild(messageIconSvgGElArray[0]);
            messageIconSvg.appendChild(messageIconSvgGElArray[1]);
            messageIconSvg.appendChild(messageIconSvgGElArray[2]);
            const messageTextWrapperClasses = ["chat", "ml-2", "p-3"];
            this._elementBuilder.assemble(messageTextWrapper, messageTextWrapperClasses);
        }
        return message;
    }
    sendMessage(event) {
        var _a, _b;
        event.preventDefault();
        const chatInput = (_a = this.shadowRoot) === null || _a === void 0 ? void 0 : _a.querySelector("#chatInput");
        if (GabiChatPresenter.isFirstMessage) {
            this.notifyContact();
            GabiChatPresenter.isFirstMessage = false;
        }
        const message = chatInput === null || chatInput === void 0 ? void 0 : chatInput.value;
        if (!message) {
            return;
        }
        else {
            chatInput.value = "";
            (_b = this.shadowRoot) === null || _b === void 0 ? void 0 : _b.dispatchEvent(new CustomEvent(gabiChatEvents.publishMessage, {
                bubbles: true,
                cancelable: false,
                composed: false,
                detail: { message, visitor: true },
            }));
            this.appendMessage(message, true);
        }
    }
    notifyContact() {
        var _a;
        const roomName = (_a = this.chatWrapper) === null || _a === void 0 ? void 0 : _a.room.name;
        fetch("/chat/contact", {
            method: "POST",
            body: JSON.stringify({ roomName }),
        });
    }
}
GabiChatPresenter.isFirstMessage = true;
customElements.define("gabi-chat-presenter", GabiChatPresenter);
"use strict";
class GabiChatWrapper extends HTMLElement {
    constructor() {
        var _a;
        super();
        this.presenter = null;
        this.alreadyStarted = false;
        this.attachShadow({ mode: "open" });
        const presenterSlot = document.createElement("slot");
        presenterSlot.name = "presenter";
        (_a = this.shadowRoot) === null || _a === void 0 ? void 0 : _a.appendChild(presenterSlot);
    }
    connectedCallback() {
        var _a;
        (_a = this.shadowRoot) === null || _a === void 0 ? void 0 : _a.addEventListener("slotchange", () => {
            var _a, _b;
            this.presenter = document.querySelector("gabi-chat-presenter");
            (_b = (_a = this.presenter) === null || _a === void 0 ? void 0 : _a.shadowRoot) === null || _b === void 0 ? void 0 : _b.addEventListener(gabiChatEvents.publishMessage, (event) => this.publishMessage(event.detail));
        });
        const SCALEDRONE_CDN = "https://cdn.scaledrone.com/scaledrone.min.js";
        //@ts-ignore
        if (!window.ScaleDrone) {
            const scriptElement = document.createElement("script");
            scriptElement.src = SCALEDRONE_CDN;
            const documentHead = document.querySelector("head");
            scriptElement.onload = this.setUpDrone.bind(this);
            documentHead === null || documentHead === void 0 ? void 0 : documentHead.appendChild(scriptElement);
        }
        else {
            this.setUpDrone();
        }
    }
    setUpDrone() {
        const CLIENT_ID = "IMWtB9IIGdCktA3W";
        //@ts-ignore
        this.drone = new ScaleDrone(CLIENT_ID, {});
        this.drone.on("open", (error) => {
            if (error) {
                console.error(error);
            }
            this.startChatRoomSession();
        });
        this.drone.on("close", (event) => {
            var _a;
            (_a = this.shadowRoot) === null || _a === void 0 ? void 0 : _a.dispatchEvent(new CustomEvent(gabiChatEvents.close, {
                detail: event,
                bubbles: false,
                cancelable: false,
                composed: false,
            }));
        });
        this.drone.on("error", (error) => {
            var _a;
            (_a = this.shadowRoot) === null || _a === void 0 ? void 0 : _a.dispatchEvent(new CustomEvent(gabiChatEvents.error, {
                detail: error,
                bubbles: false,
                cancelable: false,
                composed: false,
            }));
            console.error(error);
        });
    }
    startChatRoomSession() {
        this.room = this.drone.subscribe(this.getRoomName(), {
            historyCount: 100,
        });
        this.room.on("open", (error) => {
            var _a;
            if (error) {
                console.error(error);
            }
            else {
                (_a = this.shadowRoot) === null || _a === void 0 ? void 0 : _a.dispatchEvent(new CustomEvent(gabiChatEvents.open, {
                    bubbles: false,
                    cancelable: false,
                    composed: false,
                }));
            }
        });
        this.room.on("data", (data) => {
            var _a;
            (_a = this.shadowRoot) === null || _a === void 0 ? void 0 : _a.dispatchEvent(new CustomEvent(gabiChatEvents.data, {
                detail: data,
                bubbles: false,
                cancelable: false,
                composed: false,
            }));
        });
        this.room.on("history_message", (log) => {
            var _a;
            (_a = this.shadowRoot) === null || _a === void 0 ? void 0 : _a.dispatchEvent(new CustomEvent(gabiChatEvents.historyMessage, {
                detail: log,
                bubbles: false,
                cancelable: false,
                composed: false,
            }));
        });
        this.alreadyStarted = true;
    }
    getRoomName() {
        const LOCAL_STORAGE_CHAT_SESSION_ID = "LOCAL_STORAGE_CHAT_SESSION_ID";
        function generateRoomName() {
            return (Math.random().toString(36).substring(2) +
                Date.now().toString(36).substring(2));
        }
        let localStorageChatSessionId = localStorage.getItem(LOCAL_STORAGE_CHAT_SESSION_ID);
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
    publishMessage(message) {
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
};
"use strict";

class GabiSpotifyPresenter extends HTMLElement {
    constructor() {
        super();
        this.isMounted = false;
        this.attachShadow({ mode: "open" });
    }
    connectedCallback() {
        document.addEventListener("spotifySong", (e) => {
            const song = e.detail;
            this.handleSongEvent(song);
        });
    }
    handleSongEvent(song) {
        if (!song) {
            if (this.isMounted) {
                this.unmountSpotifyComponent();
                this.isMounted = false;
            }
        }
        else {
            if (!this.isMounted) {
                this.renderSpotifyComponent(song);
                this.isMounted = true;
            }
            else {
                this.updateSpotifyComponent(song);
            }
        }
    }
    renderSpotifyComponent(song) {
        var _a, _b;
        const styleElement = document.createElement("style");
        styleElement.textContent = \`
    img, svg {
      vertical-align: middle;
    }

    .d-flex {
      display: flex!important;
    }

    .flex-column {
      flex-direction: column!important;
    }

    .flex-row {
      flex-direction: row!important;
    }

    .flex-wrap {
      flex-wrap: wrap!important;
    }

    .justify-content-center {
      justify-content: center!important;
    }

    .m-0 {
      margin: 0!important;
    }

    .me-1 {
      margin-right: .25rem!important;
    }

    .me-2 {
      margin-right: .5rem!important;
    }

    .song-title-text, .song-complementary-info-text {
      font-family: CircularSp,CircularSp-Arab,CircularSp-Hebr,CircularSp-Cyrl,CircularSp-Grek,CircularSp-Deva,sans-serif;
      margin-block: 0px;
      -webkit-tap-highlight-color: transparent;
      text-decoration: none;
      font-weight: 400;
    }

    .song-complementary-info-text {
      font-size: 0.6875rem;
      color: #b3b3b3;
    }

    .song-title-text {
      font-size: 0.8125rem;
      color: #fff;
    }

    \`;
        (_a = this.shadowRoot) === null || _a === void 0 ? void 0 : _a.appendChild(styleElement);
        const flexDiv = document.createElement("div");
        flexDiv.classList.add("d-flex");
        const flexDivFirstChild = document.createElement("div");
        flexDivFirstChild.classList.add("me-2");
        const imageLink = document.createElement("a");
        imageLink.setAttribute("href", song.trackURL);
        imageLink.setAttribute("id", "spotifyAlbumHref");
        imageLink.setAttribute("target", "blank");
        const imageElement = document.createElement("img");
        imageElement.setAttribute("height", "64px");
        imageElement.setAttribute("width", "64px");
        imageElement.setAttribute("alt", "Album image");
        let albumImageUrl = this.resolveSongAlbum(song);
        imageElement.setAttribute("src", albumImageUrl);
        imageElement.setAttribute("id", "spotifyAlbumImage");
        imageLink.appendChild(imageElement);
        flexDivFirstChild.appendChild(imageLink);
        const flexDivSecondChild = document.createElement("div");
        flexDivSecondChild.classList.add("d-flex", "flex-column", "justify-content-center");
        const songTitleLink = document.createElement("a");
        songTitleLink.classList.add("song-title-text");
        songTitleLink.setAttribute("href", song.albumURL);
        songTitleLink.setAttribute("target", "blank");
        songTitleLink.setAttribute("id", "spotifyTrack");
        songTitleLink.innerText = song.name;
        flexDivSecondChild.appendChild(songTitleLink);
        const artistDiv = document.createElement("div");
        artistDiv.classList.add("d-flex", "flex-row", "flex-wrap");
        artistDiv.setAttribute("id", "spotifyArtist");
        const artistEl = this.assembleArtistElement(song);
        artistEl.forEach((artist) => artistDiv.appendChild(artist));
        flexDivSecondChild.appendChild(artistDiv);
        flexDiv.appendChild(flexDivFirstChild);
        flexDiv.appendChild(flexDivSecondChild);
        //spotifyComponent.appendChild(flexDiv);
        (_b = this.shadowRoot) === null || _b === void 0 ? void 0 : _b.appendChild(flexDiv);
    }
    updateSpotifyComponent(song) {
        var _a, _b, _c, _d, _e;
        const artistNodes = (_a = this.shadowRoot) === null || _a === void 0 ? void 0 : _a.querySelectorAll(".artist");
        const spotifyAlbumHref = (_b = this.shadowRoot) === null || _b === void 0 ? void 0 : _b.getElementById("spotifyAlbumHref");
        const spotifyAlbumImage = (_c = this.shadowRoot) === null || _c === void 0 ? void 0 : _c.getElementById("spotifyAlbumImage");
        const spotifyArtist = (_d = this.shadowRoot) === null || _d === void 0 ? void 0 : _d.getElementById("spotifyArtist");
        const spotifyTrack = (_e = this.shadowRoot) === null || _e === void 0 ? void 0 : _e.getElementById("spotifyTrack");
        spotifyAlbumHref === null || spotifyAlbumHref === void 0 ? void 0 : spotifyAlbumHref.setAttribute("href", song.trackURL);
        let albumImageUrl = this.resolveSongAlbum(song);
        spotifyAlbumImage === null || spotifyAlbumImage === void 0 ? void 0 : spotifyAlbumImage.setAttribute("src", albumImageUrl);
        spotifyTrack && (spotifyTrack.innerText = song.name);
        spotifyTrack === null || spotifyTrack === void 0 ? void 0 : spotifyTrack.setAttribute("href", song.album.external_urls.spotify);
        artistNodes === null || artistNodes === void 0 ? void 0 : artistNodes.forEach((node) => node.remove());
        const artistEl = this.assembleArtistElement(song);
        artistEl.forEach((artist) => spotifyArtist.appendChild(artist));
    }
    assembleArtistElement(song) {
        return song.artist.map((artist, index) => {
            const artistRef = document.createElement("a");
            artistRef.setAttribute("href", artist.external_urls.spotify);
            artistRef.setAttribute("target", "blank");
            artistRef.classList.add("artist", "song-complementary-info-text", "m-0", "me-1");
            artistRef.innerText =
                artist.name + (index + 1 !== song.artist.length ? "," : "");
            return artistRef;
        });
    }
    resolveSongAlbum(song) {
        var _a, _b;
        let albumImageUrl = (_a = song.album.images.find((imageURL) => imageURL.width === 64)) === null || _a === void 0 ? void 0 : _a.url;
        if (!albumImageUrl)
            albumImageUrl = (_b = song.album.images[0].url) !== null && _b !== void 0 ? _b : "";
        return albumImageUrl;
    }
    unmountSpotifyComponent() {
        var _a;
        while ((_a = this.shadowRoot) === null || _a === void 0 ? void 0 : _a.firstChild) {
            this.shadowRoot.removeChild(this.shadowRoot.firstChild);
        }
    }
}
customElements.define("gabi-spotify-presenter", GabiSpotifyPresenter);
"use strict";
class GabiSpotifySongFetcher extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: "open" });
        this.spotifyWorker = new Worker("spotifyWorker.ts");
        this.spotifyWorker.onmessage = (response) => {
            var _a, _b;
            let song = (_a = response.data) === null || _a === void 0 ? void 0 : _a.song;
            (_b = this.shadowRoot) === null || _b === void 0 ? void 0 : _b.dispatchEvent(new CustomEvent("spotifySong", {
                detail: song,
                bubbles: true,
                cancelable: false,
                composed: true,
            }));
        };
        this.spotifyWorker.postMessage(1);
    }
    connectedCallback() {
        if (this.shadowRoot) {
            this.shadowRoot.innerHTML = \`<slot name="presenter"></slot>\`;
        }
        this.trackVisibility();
    }
    trackVisibility() {
        let blurDate;
        let focusDate;
        document.addEventListener("visibilitychange", () => {
            if (document.visibilityState === "visible") {
                focusDate = new Date();
                if (blurDate) {
                    if (focusDate.getTime() - blurDate.getTime() >= 60000) {
                        this.spotifyWorker.postMessage(1);
                    }
                }
            }
            else {
                blurDate = new Date();
            }
        });
    }
    disconnectedCallback() {
        this.spotifyWorker.terminate();
    }
}
customElements.define("gabi-spotify-song-fetcher", GabiSpotifySongFetcher);
`