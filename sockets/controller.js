const { Socket } = require("socket.io")




//Este tipo de tipado no se hace con los sockets
const socketController = (socket = new Socket()) => {

    // console.log('Cliente conectado', socket.id);

    
}


module.exports = {
    socketController
}