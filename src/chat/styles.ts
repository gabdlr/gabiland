export const chatStyles = `
<style>
#chatContainer .chat-body::-webkit-scrollbar {
  width: 15px;
}
.contact-container #chatContainer .card{
  width: 300px;
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
  height: 200px;
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
`;
