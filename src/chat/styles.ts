export const chatStyles = `
<style>
:root{
  --chat-lighten-color: rgb(13 28 47);
  --chat-darken-color: rgb(12 14 22);
  --chat-bg-heading-start: var(--chat-lighten-color);
  --chat-bg-heading-end: var(--chat-darken-color);
}
#chatContainer .chat-body::-webkit-scrollbar {
  width: 15px;
}
.contact-container #chatContainer .card{
  border-top-right-radius: 0;
  border-top-left-radius: 0;
  border: none;
  b
}
#chatContainer .chat-header{
  background: linear-gradient(90deg, var(--chat-bg-heading-start) 0%, var(--chat-bg-heading-end) 74%);
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
  border:1px solid var(--chat-darken-color);
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
  height: 200px;
  overflow: scroll;
}

#chatContainer .form-group .btn {
  border-top-left-radius: 0;
  border-bottom-left-radius: 0;
  border-top-right-radius: 50%;
  border-bottom-right-radius: 50%;
  --bs-btn-hover-bg: var(--chat-darken-color);
  --bs-btn-hover-border-color: var(--chat-darken-color);
  --bs-btn-bg: var(--chat-lighten-color);
  --bs-btn-border-color: var(--chat-lighten-color);
  --bs-btn-padding-x: 0;
}

.form-group .btn:active{
  --bs-btn-active-bg: var(--chat-darken-color);
  --bs-btn-active-border-color: var(--chat-darken-color);
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
`;
