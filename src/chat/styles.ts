export const chatStyles = `
<style>
:root{
  --chat-lighten-color: rgb(13 28 47);
  --chat-darken-color: rgb(12 14 22);
  --chat-bg-heading-start: var(--chat-lighten-color);
  --chat-bg-heading-end: var(--chat-darken-color);
}
.icon {
  animation: rotation 4s infinite linear;
  position: fixed;
  bottom: 30px; 
  right: 30px; 
  z-index: 999;
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
