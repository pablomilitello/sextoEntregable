const socketClient = io();

const userInput = document.getElementById('user');
const formInput = document.getElementById('form');
const messageInput = document.getElementById('message');
const chatInput = document.getElementById('chat');

let user;

//Ingreso al Chat
Swal.fire({
  title: 'WELCOME',
  text: 'Enter your username',
  input: 'text',
  inputValidator: (value) => {
    if (!value) {
      return 'Enter your username';
    }
  },
}).then((username) => {
  user = username.value;
  userInput.innerText = user;
  //Evento de usuario recién conectado
  socketClient.emit('newUser', user);
});

//Mensajes
formInput.onsubmit = (e) => {
  e.preventDefault();
  const info = {
    name: user,
    data: messageInput.value,
  };
  socketClient.emit('message', info);
  formInput.reset();
};

//Chat
export const chat = socketClient.on('chat', (info) => {
  const dataChat = info
    .map((obj) => {
      return `<p>${obj.name}: ${obj.data}</p>`;
    })
    .join(' ');
  chatInput.innerHTML = dataChat;
  return dataChat;
});

//Nuevo usuario conectado
socketClient.on('broadcastChat', (user) => {
  Toastify({
    text: `${user} connected`,
    duration: 5000,
    position: 'right', // `left`, `center` or `right`
    style: {
      background: 'linear-gradient(to right, #00b09b, #96c93d)',
    },
  }).showToast();
});
